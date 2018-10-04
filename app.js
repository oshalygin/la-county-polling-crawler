/* eslint-disable id-length */
const express = require('express');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const db = require('./db.js');
const userDAL = require('./userDAL');

const port = process.env.PORT || 8080; // eslint-disable-line no-process-env

const application = express();

const BASE_URL = 'https://www.lavote.net/Locator';

const LAST_NAME_ID_FIELD = '#ctl00_pg_content_C001_txtLastName';
const BIRTH_DATE_ID_FIELD = '#ctl00_pg_content_C001_txtBirthdate';
const HOUSE_NUMBER_ID_FIELD = '#ctl00_pg_content_C001_txtHouseNumber';
const ZIP_CODE_ID_FIELD = '#ctl00_pg_content_C001_txtZipCode';
const SUBMIT_ID_FIELD = '#ctl00_pg_content_C001_btnPollLocatorSubmit';

const STATE_PLANE_URL = 'http://www.earthpoint.us/StatePlane.aspx';

const X_ID_FIELD = '#ContentPlaceHolder1_X';
const Y_ID_FIELD = '#ContentPlaceHolder1_Y';
const STATE_PLANE_ZONE_ID_FIELD = '#ContentPlaceHolder1_dlZone';
const XY_UNIT_MEASURE_ID_FIELD = '#ContentPlaceHolder1_rbUnitOfMeasure_1';
const CALCULATE_LAT_LONG_SUBMIT_ID_FIELD =
  '#ContentPlaceHolder1_btnXYCalc_Button1';

const LAT_LONG_TEXT_LOCATION =
  '#ContentPlaceHolder1_UpdatePanel4 > table > tbody > tr:nth-child(4) > td:nth-child(2)';

const STATE_PLANE_ZONE = '0405';

async function retrieveLatLong(addressAnchorLink) {
  const splitAddress = addressAnchorLink.split('=');
  const x = splitAddress[1].replace('&y', '');
  const y = splitAddress[2].replace('&st', '');

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  await page.goto(STATE_PLANE_URL);

  await page.select(STATE_PLANE_ZONE_ID_FIELD, STATE_PLANE_ZONE);
  await page.click(XY_UNIT_MEASURE_ID_FIELD);

  await page.type(X_ID_FIELD, x);
  await page.type(Y_ID_FIELD, y);

  await page.click(CALCULATE_LAT_LONG_SUBMIT_ID_FIELD);
  await page.waitForSelector(LAT_LONG_TEXT_LOCATION);

  // Parse the document
  const document = await page.evaluate(() => document.body.innerHTML);
  const $ = cheerio.load(document); // eslint-disable-line id-length

  const latLongString = $(LAT_LONG_TEXT_LOCATION).text();

  const cleansedLatLongString = latLongString.split('°').join('');
  const lat = cleansedLatLongString.split(',')[0];
  const lng = cleansedLatLongString.split(',')[1].trim();

  return {
    lat: Number(lat),
    lng: Number(lng),
  };
}

async function retrievePollingLocation(
  lastName,
  birthDate,
  houseNumber,
  zipCode,
) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  // Retrieve the page
  await page.goto(BASE_URL);

  // Fill out form fields
  await page.type(LAST_NAME_ID_FIELD, lastName);
  await page.type(BIRTH_DATE_ID_FIELD, birthDate);
  await page.type(HOUSE_NUMBER_ID_FIELD, houseNumber);
  await page.type(ZIP_CODE_ID_FIELD, zipCode);

  await page.click(SUBMIT_ID_FIELD);
  await page.waitForNavigation();

  // Parse the document
  const document = await page.evaluate(() => document.body.innerHTML);
  const $ = cheerio.load(document); // eslint-disable-line id-length

  const addressAnchorLink = $("a[href*='locatormap']").attr('href');

  if (!addressAnchorLink) {
    return null;
  }

  // Parse the location URL
  const addressSchema = addressAnchorLink.split('&');
  const addressLocationOne = addressSchema
    .find(schema => schema.includes('pl1'))
    .split('=')[1]
    .split('_')
    .join(' ');

  const addressLocationTwo = addressSchema
    .find(schema => schema.includes('pl2'))
    .split('=')[1]
    .split('_')
    .join(' ');

  const locationStreet = addressSchema
    .find(schema => schema.includes('pl3'))
    .split('=')[1]
    .split('_')
    .join(' ');

  const locationAddressCityLine = addressSchema
    .find(schema => schema.includes('pl4'))
    .split('=')[1]
    .split('_')
    .join(' ');

  const locationCity = locationAddressCityLine.split(',')[0].trim();
  const locationState = locationAddressCityLine.split(',')[1].split(' ')[1];
  const locationZipCode = locationAddressCityLine.split(',')[1].split(' ')[2];

  const hoursOfOperation = $('.colorMaroon.textBold.fs').text();

  const electionName = $('.election_title_text.fs > h3 > span').text();

  const electionDateString = $(
    '#ctl00_pg_content_C001_divResultsPollingPlace > div > div.election_title.fs > div',
  ).text();

  const electionDate = electionDateString.replace(' ', '').split('- ')[1];

  return {
    addressAnchorLink,
    electionName,
    electionDate,
    hoursOfOperation,
    locationOne: addressLocationOne,
    locationTwo: addressLocationTwo,
    street: locationStreet,
    city: locationCity,
    state: locationState,
    zipCode: locationZipCode,
  };
}

const getPollingLocation = async (request, response) => {
  const { lastName, birthDate, houseNumber, zipCode } = request.query;
  if (!lastName) {
    return response
      .status(400)
      .json('The queryString parameter [lastName] cannot be empty');
  }

  if (!birthDate) {
    return response
      .status(400)
      .json('The queryString parameter [birthDate] cannot be empty');
  }

  if (!houseNumber) {
    return response
      .status(400)
      .json('The queryString parameter [houseNumber] cannot be empty');
  }

  if (!zipCode) {
    return response
      .status(400)
      .json('The queryString parameter [zipCode] cannot be empty');
  }

  try {
    const user = await userDAL.find({ lastName, birthDate, houseNumber });

    if (user) {
      return response.status(200).json(user);
    }

    const pollingLocation = await retrievePollingLocation(
      lastName,
      birthDate,
      houseNumber,
      zipCode,
    );

    if (!pollingLocation) {
      return response.status(404).send('No Results Found');
    }

    const location = await retrieveLatLong(pollingLocation.addressAnchorLink);

    const address = {
      ...pollingLocation,
      location,
    };

    if (address.addressAnchorLink || !user) {
      await userDAL.findOneAndUpdate({
        lastName,
        birthDate,
        houseNumber,
        userZipCode: zipCode,
        ...address,
      });
    }

    return response.status(200).json(address);
  } catch (error) {
    console.error(error);
    return response.status(400).send('Bad Request');
  }
};

application.get('*', getPollingLocation);

db.connect()
  .then(nativeConnection => db.connectedOutput(nativeConnection))
  .catch(error => console.log(error));

application.listen(port, error => {
  if (error) {
    console.error(error);
  }
  console.info(`Serving API from http://localhost:${port}`);
});

module.exports = application;
