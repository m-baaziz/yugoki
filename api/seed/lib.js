const bcrypt = require('bcrypt');

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

module.exports = {
  seedUsers,
  seedSports,
};
