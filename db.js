/* eslint-disable no-console */
/* eslint-disable max-len */
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const connect = () =>
  mongoose.connect(
    'mongodb://admin:olegoleg@cluster0-shard-00-00-bubcx.mongodb.net:27017,cluster0-shard-00-01-bubcx.mongodb.net:27017,cluster0-shard-00-02-bubcx.mongodb.net:27017/polling-crawler?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin',
    {
      useMongoClient: true,
    },
  );

const connectedOutput = nativeConnection => {
  const { host, port, name } = nativeConnection;
  console.info(`Database Connected: monogodb://${host}:${port}/${name}`);
};

const db = {
  connect,
  connectedOutput,
};

module.exports = db;
