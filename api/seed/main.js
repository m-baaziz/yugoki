// const { MongoClient } = require('mongodb');
// const {
//   seedUsers,
//   seedSports,
//   seedClubs,
//   seedSites,
//   seedTrainers,
//   seedEvents,
// } = require('./lib');

// const DATABASE = 'dev';
// const mongoClient = new MongoClient('mongodb://192.168.64.2:27017');

// mongoClient
//   .connect()
//   .then((connection) => connection.db(DATABASE))
//   // .then(seedUsers)
//   // .then(seedSports)
//   // .then(seedClubs)
//   // .then(seedSites)
//   // .then(seedTrainers)
//   .then(seedEvents)
//   .then(() => {
//     mongoClient.close();
//   })
//   .catch(console.error);
