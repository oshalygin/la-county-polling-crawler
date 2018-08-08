import express from 'express';

const application = express();

export const getPollingLocation = async (request, response) => {
  const { address } = request.params;
  console.log(address);

  try {
    return response.status(200).json({});
  } catch (error) {
    console.error(error);
    return response.status(400).send('Bad Request');
  }
};

application.get('/:address', getPollingLocation);
exports.getPollingLocation = application;


