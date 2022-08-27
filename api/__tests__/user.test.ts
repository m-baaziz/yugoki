/* eslint-disable @typescript-eslint/no-explicit-any */
import 'dotenv/config';
import {
  mongoClient,
  mongoDb,
  _Collection,
  _Database,
} from '../src/datasources';
import { signIn } from '../src/resolvers/user';
import { seedUsers } from '../seed/lib';
import UserAPI from '../src/datasources/user';
import { Collection, MongoClient } from 'mongodb';

describe('user resolvers', () => {
  let userAPI: UserAPI;
  let dbClient: MongoClient;
  let userCollection: Collection;

  beforeAll(async () => {
    const MONGO_HOST = process.env.MONGO_HOST;
    const MONGO_PORT = parseInt(process.env.MONGO_PORT, 10);
    dbClient = await mongoClient(MONGO_HOST, MONGO_PORT);
    const db = mongoDb(dbClient, _Database.Test);
    userCollection = db.collection(_Collection.User);
    await seedUsers(db);
    userAPI = new UserAPI(db, {
      jwtSecret: 'test-secret',
      jwtValiditySec: 60 * 60 * 24,
    });
  });

  afterAll(async () => {
    await userCollection.drop();
    dbClient.close();
  });

  it('sign in', async () => {
    try {
      const token = await signIn(
        undefined,
        {
          email: 'user@db.com',
          password: 'password',
        },
        { dataSources: { userAPI } } as any,
      );
      expect(token.length).toBeGreaterThan(0);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  });
});
