/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import jwt from 'jsonwebtoken';

import { User } from '../generated/graphql';
import { parseUser, userToRecord } from '../utils/user';

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

  async insertUser(id: string, email: string): Promise<User> {
    // use cognito for signup ... (get id from cognito result)
    try {
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
            ...userToRecord(item),
          },
        }),
      );

      return Promise.resolve(item);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
