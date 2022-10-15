/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Collection, Db, ObjectId, WithId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { _Collection } from '.';
import { FileUploadDbObject, FileUploadInput } from '../generated/graphql';
import { listByFilter } from './helpers';
import { logger } from '../logger';

export type S3Config = {
  bucket: string;
  presignedUrlsValidityPeriod: {
    get: number;
    put: number;
  };
};

export default class FileUploadAPI extends DataSource {
  collection: Collection<FileUploadDbObject>;
  context: any;
  s3Client: S3Client;
  s3Config: S3Config;

  constructor(db: Db, s3Client: S3Client, s3Config: S3Config) {
    super();
    this.collection = db.collection<FileUploadDbObject>(_Collection.FileUpload);
    this.s3Client = s3Client;
    this.s3Config = s3Config;
  }

  initialize(config: DataSourceConfig<any>): void | Promise<void> {
    this.context = config.context;
  }

  async createIndexes(): Promise<void> {
    try {
      await this.collection.createIndex({ key: 1 }, { unique: true });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async findFileUploadById(id: string): Promise<WithId<FileUploadDbObject>> {
    try {
      const fileUpload = await this.collection.findOne({
        _id: new ObjectId(id),
      });
      if (!fileUpload) {
        return Promise.reject(`File upload with id ${id} not found`);
      }
      return Promise.resolve(fileUpload);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async listFileUploads(
    first: number,
    after?: string,
  ): Promise<[WithId<FileUploadDbObject>[], boolean]> {
    return listByFilter(this.collection, {}, first, after);
  }

  async createFileUpload(input: FileUploadInput): Promise<FileUploadDbObject> {
    try {
      const fileUpload: FileUploadDbObject = {
        key: uuidv4(),
        ...input,
      };

      const result = await this.collection.insertOne(fileUpload);

      return {
        ...fileUpload,
        _id: result.insertedId,
      };
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async deleteFileUpload(id: string): Promise<boolean> {
    try {
      const fileUpload = await this.findFileUploadById(id);
      const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.s3Config.bucket,
        Key: fileUpload.key,
      });
      logger.info(
        `Deleting file ${fileUpload.key} from bucket ${this.s3Config.bucket}.`,
      );
      await this.s3Client.send(deleteCommand);
      return Promise.resolve(result.deletedCount === 1);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async generateFileUrlGet(id: string): Promise<string> {
    try {
      const fileUpload = await this.findFileUploadById(id);
      const getCommand = new GetObjectCommand({
        Bucket: this.s3Config.bucket,
        Key: fileUpload.key,
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
        Key: fileUpload.key,
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
