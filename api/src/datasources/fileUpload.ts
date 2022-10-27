/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { FileUpload, FileUploadInput } from '../generated/graphql';
import { logger } from '../logger';
import { fileUploadToRecord, parseFileUpload } from '../utils/fileUpload';

const TABLE_NAME = 'FileUpload';

export type S3Config = {
  bucket: string;
  presignedUrlsValidityPeriod: {
    get: number;
    put: number;
  };
};

export default class FileUploadAPI extends DataSource {
  dynamodbClient: DynamoDBClient;
  context: any;
  s3Client: S3Client;
  s3Config: S3Config;

  constructor(
    dynamodbClient: DynamoDBClient,
    s3Client: S3Client,
    s3Config: S3Config,
  ) {
    super();
    this.dynamodbClient = dynamodbClient;
    this.s3Client = s3Client;
    this.s3Config = s3Config;
  }

  initialize(config: DataSourceConfig<any>): void | Promise<void> {
    this.context = config.context;
  }

  async findFileUploadById(id: string): Promise<FileUpload> {
    try {
      const result = await this.dynamodbClient.send(
        new GetItemCommand({
          TableName: TABLE_NAME,
          Key: { FileUploadId: { S: id } },
        }),
      );
      const item = result.Item;
      if (!item) {
        return Promise.reject(`File upload with id ${id} not found`);
      }
      return Promise.resolve(parseFileUpload(item));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async createFileUpload(input: FileUploadInput): Promise<FileUpload> {
    try {
      const id = uuidv4();
      const item: FileUpload = {
        id,
        size: input.size,
        ext: input.ext,
        kind: input.kind,
      };
      await this.dynamodbClient.send(
        new PutItemCommand({
          TableName: TABLE_NAME,
          ConditionExpression: 'attribute_not_exists(#id)',
          ExpressionAttributeNames: {
            '#id': 'Id',
          },
          Item: {
            ...fileUploadToRecord(item),
          },
        }),
      );
      return Promise.resolve(item);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async deleteFileUpload(id: string): Promise<boolean> {
    try {
      const fileUpload = await this.findFileUploadById(id);
      await this.dynamodbClient.send(
        new DeleteItemCommand({
          TableName: TABLE_NAME,
          Key: { FileUploadId: { S: id } },
        }),
      );
      logger.info(
        `Deleting file ${fileUpload.id} from bucket ${this.s3Config.bucket}.`,
      );
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.s3Config.bucket,
          Key: fileUpload.id,
        }),
      );
      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async generateFileUrlGet(id: string): Promise<string> {
    try {
      const fileUpload = await this.findFileUploadById(id);
      const getCommand = new GetObjectCommand({
        Bucket: this.s3Config.bucket,
        Key: fileUpload.id,
      });
      const url = await getSignedUrl(this.s3Client, getCommand, {
        expiresIn: this.s3Config.presignedUrlsValidityPeriod.get,
      });
      return Promise.resolve(url);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async generateFileUrlPut(id: string): Promise<string> {
    try {
      const fileUpload = await this.findFileUploadById(id);
      const putCommand = new PutObjectCommand({
        Bucket: this.s3Config.bucket,
        Key: fileUpload.id,
      });
      const url = await getSignedUrl(this.s3Client, putCommand, {
        expiresIn: this.s3Config.presignedUrlsValidityPeriod.put,
      });
      return Promise.resolve(url);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
