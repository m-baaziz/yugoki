/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Collection, Db, ObjectId, WithId } from 'mongodb';
import jwt from 'jsonwebtoken';

import { User, UserDbObject } from '../generated/graphql';
import { _Collection } from '.';

export type InsertUserArgs = {
  email: string;
  passwordHash: string;
};

export type UserAPIConfig = {
  jwtSecret: string;
  jwtValiditySec: number;
};

export type UserJwt = User & jwt.JwtPayload;

export default class UserAPI extends DataSource {
  collection: Collection<UserDbObject>;
  config: UserAPIConfig;
  context: any;

  constructor(db: Db, config: UserAPIConfig) {
    super();
    this.collection = db.collection<UserDbObject>(_Collection.User);
    this.config = config;
  }

  initialize(config: DataSourceConfig<any>): void | Promise<void> {
    this.context = config.context;
  }

  async createIndexes(): Promise<void> {
    try {
      await this.collection.createIndex({ email: 1 }, { unique: true });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async generateToken(user: User): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        user,
        this.config.jwtSecret,
        {
          expiresIn: this.config.jwtValiditySec,
        },
        (err, encoded) => {
          if (err) {
            return reject(err);
          }
          return resolve(encoded);
        },
      );
    });
  }

  async verifyToken(token: string): Promise<UserDbObject> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.config.jwtSecret, {}, async (err, decoded) => {
        if (err) {
          return reject(err);
        }
        try {
          if (typeof decoded === 'string') {
            return reject('Invalid token');
          }
          const userJwt = decoded as UserJwt;
          const user = await this.findUserById(userJwt.id);
          return resolve(user);
        } catch (e) {
          return reject(e);
        }
      });
    });
  }

  async insertUser({
    email,
    passwordHash,
  }: InsertUserArgs): Promise<WithId<UserDbObject>> {
    try {
      if ((await this.collection.countDocuments({ email })) > 0)
        return Promise.reject('User with the same email already exists');
      const user: UserDbObject = {
        email,
        passwordHash,
      };
      const result = await this.collection.insertOne(user);

      return Promise.resolve({
        _id: result.insertedId,
        ...user,
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async findUserById(id: string): Promise<WithId<UserDbObject>> {
    try {
      const user = await this.collection.findOne({ _id: new ObjectId(id) });
      if (!user) {
        return Promise.reject('User not found');
      }
      return Promise.resolve(user);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async findUserByEmail(email: string): Promise<WithId<UserDbObject>> {
    try {
      const user = await this.collection.findOne({ email });
      if (!user) {
        return Promise.reject('User not found');
      }
      return Promise.resolve(user);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
