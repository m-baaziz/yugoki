/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import {
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

import { User } from '../generated/graphql';
import {
  parseUser,
  parseUserWithPasswordHard,
  userToRecord,
  UserWithPasswordHash,
} from '../utils/user';

export type InsertUserArgs = {
  email: string;
  passwordHash: string;
};

export type UserAPIConfig = {
  jwtSecret: string;
  jwtValiditySec: number;
};

export type UserJwt = User & jwt.JwtPayload;

const TABLE_NAME = 'User';
const EMAIL_INDEX_NAME = 'EmailIndex';

export default class UserAPI extends DataSource {
  dynamodbClient: DynamoDBClient;
  config: UserAPIConfig;
  context: any;

  constructor(config: UserAPIConfig, dynamodbClient: DynamoDBClient) {
    super();
    this.dynamodbClient = dynamodbClient;
    this.config = config;
  }

  initialize(config: DataSourceConfig<any>): void | Promise<void> {
    this.context = config.context;
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

  async verifyToken(token: string): Promise<User> {
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

  async findUserById(id: string): Promise<User> {
    try {
      const result = await this.dynamodbClient.send(
        new GetItemCommand({
          TableName: TABLE_NAME,
          Key: { UserId: { S: id } },
        }),
      );
      const item = result.Item;
      if (!item) {
        return Promise.reject(`User with id ${id} not found`);
      }
      return Promise.resolve(parseUser(item));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async findUserByEmail(email: string): Promise<UserWithPasswordHash> {
    try {
      const result = await this.dynamodbClient.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: EMAIL_INDEX_NAME,
          KeyConditionExpression: '#email = :email',
          ExpressionAttributeNames: {
            '#email': 'UserEmail',
          },
          ExpressionAttributeValues: {
            ':email': { S: email },
          },
          Limit: 1,
        }),
      );
      const items = result.Items;
      if (items.length === 0) {
        return Promise.reject(`User with email ${email} not found`);
      }
      return Promise.resolve(parseUserWithPasswordHard(items[0]));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async insertUser(email: string, passwordHash: string): Promise<User> {
    // use cognito for signup ... (get id from cognito result)
    try {
      // trick to guarantee unique emails (needs to be deleted along with the user)
      await this.dynamodbClient.send(
        new PutItemCommand({
          TableName: TABLE_NAME,
          ConditionExpression: 'attribute_not_exists(#id)',
          ExpressionAttributeNames: {
            '#id': 'UserId',
          },
          Item: {
            UserId: { S: email },
          },
        }),
      );
      const id = uuidv4();
      const item: User = {
        id,
        email,
      };
      await this.dynamodbClient.send(
        new PutItemCommand({
          TableName: TABLE_NAME,
          ConditionExpression: 'attribute_not_exists(#id)',
          ExpressionAttributeNames: {
            '#id': 'UserId',
          },
          Item: {
            ...userToRecord(item, passwordHash),
          },
        }),
      );

      return Promise.resolve(item);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
