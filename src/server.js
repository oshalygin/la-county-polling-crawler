import express from 'express';
import cheerio from 'cheerio';
import puppeteer from 'puppeteer';

const port = process.env.PORT || 8080; // eslint-disable-line no-process-env

const application = express();

const BASE_URL = 'https://www.lavote.net/Locator';

const LAST_NAME_ID_FIELD = '#ctl00_pg_content_C001_txtLastName';
const BIRTH_DATE_ID_FIELD = '#ctl00_pg_content_C001_txtBirthdate';
const HOUSE_NUMBER_ID_FIELD = '#ctl00_pg_content_C001_txtHouseNumber';
const ZIP_CODE_ID_FIELD = '#ctl00_pg_content_C001_txtZipCode';
const SUBMIT_ID_FIELD = '#ctl00_pg_content_C001_btnPollLocatorSubmit';

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

  console.log(addressAnchorLink);

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

  const locationCity = locationAddressCityLine.split(',')[0];
  const locationState = locationAddressCityLine.split(',')[1].split(' ')[1];
  const locationZipCode = locationAddressCityLine.split(',')[1].split(' ')[2];

  return {
    locationOne: addressLocationOne,
    locationTwo: addressLocationTwo,
    street: locationStreet,
    city: locationCity,
    state: locationState,
    zipCode: locationZipCode,
  };
}

export const getPollingLocation = async (request, response) => {
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
    const pollingLocation = await retrievePollingLocation(
      lastName,
      birthDate,
      houseNumber,
      zipCode,
    );

    return response.status(200).json(pollingLocation);
  } catch (error) {
    console.error(error);
    return response.status(400).send('Bad Request');
  }
};

application.get('*', getPollingLocation);

application.listen(port, error => {
  if (error) {
    console.error(error);
  }
  console.info(`Serving API from http://localhost:${port}`);
});

export default application;
