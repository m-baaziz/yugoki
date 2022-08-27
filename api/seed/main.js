const { MongoClient } = require('mongodb');
const { seedUsers, seedSports } = require('./lib');

const DATABASE = 'dev';
const mongoClient = new MongoClient('mongodb://192.168.64.2:27017');

mongoClient
  .connect()
  .then((connection) => connection.db(DATABASE))
  .then(seedUsers)
  .then(seedSports)
  .then(() => {
    mongoClient.close();
  })
  .catch(console.error);
