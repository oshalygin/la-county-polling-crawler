import express from 'express';
import { getPollingLocation } from './src/crawler';

const application = express();
const port = 3000;

application.get('*', getPollingLocation);

application.listen(port, error => {
  if (error) {
    console.error(error);
  }
  console.info(`Serving API from http://localhost:${port}`);
});
