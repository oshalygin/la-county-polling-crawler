import express from 'express';

const application = express();

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
    return response.status(200).json({});
  } catch (error) {
    console.error(error);
    return response.status(400).send('Bad Request');
  }
};

application.get('*', getPollingLocation);
exports.getPollingLocation = application;
