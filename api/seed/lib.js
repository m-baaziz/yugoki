const bcrypt = require('bcrypt');
const { ObjectID } = require('bson');

const DEFAULT_PASSWORD = 'password';

async function seedUsers(db) {
  const users = require('./data/users.json');
  console.log(`Inserting ${users.length} users ...`);
  return db
    .collection('user')
    .insertMany(
      users.map((user) => ({
        ...user,
        passwordHash: bcrypt.hashSync(DEFAULT_PASSWORD, 5),
      })),
    )
    .then(() => db);
}

async function seedSports(db) {
  const sports = require('./data/sports.json');
  console.log(`Inserting ${sports.length} sports ...`);
  return db
    .collection('sport')
    .insertMany(
      sports.map((sport) => ({
        ...sport,
      })),
    )
    .then(() => db);
}

async function seedClubs(db) {
  const clubs = require('./data/clubs.json');
  console.log(`Inserting ${clubs.length} clubs ...`);
  return db
    .collection('club')
    .insertMany(
      clubs.map((club) => ({
        ...club,
      })),
    )
    .then(() => db);
}

async function seedClubSportLocation(db) {
  const data = require('./data/club-sport-locations.json');
  console.log(`Inserting ${data.length} items ...`);
  return db
    .collection('club-sport-location')
    .insertMany(
      data.map((item) => ({
        ...item,
        club: ObjectID(item.club),
        sport: ObjectID(item.sport),
      })),
    )
    .then(() => db);
}

module.exports = {
  seedUsers,
  seedSports,
  seedClubs,
  seedClubSportLocation,
};
