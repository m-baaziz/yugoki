/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Collection, Db, ObjectId, WithId } from 'mongodb';

import { _Collection } from '.';
import { TrainerDbObject, TrainerInput } from '../generated/graphql';
import { logger } from '../logger';
import FileUploadAPI from './fileUpload';
import { listByFilter } from './helpers';

export const TRAINERS_LIST_LIMIT = 1000;

export default class TrainerAPI extends DataSource {
  collection: Collection<TrainerDbObject>;
  context: any;
  fileUploadAPI: FileUploadAPI;

  constructor(db: Db, fileUploadAPI: FileUploadAPI) {
    super();
    this.collection = db.collection<TrainerDbObject>(_Collection.Trainer);
    this.fileUploadAPI = fileUploadAPI;
  }

  initialize(config: DataSourceConfig<any>): void | Promise<void> {
    this.context = config.context;
  }

  async createIndexes(): Promise<void> {
    try {
      await this.collection.createIndex({ club: 1 }, { unique: false });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async findTrainerById(id: string): Promise<WithId<TrainerDbObject>> {
    try {
      const trainer = await this.collection.findOne({
        _id: new ObjectId(id),
      });
      if (!trainer) {
        return Promise.reject(`Trainer with id ${id} not found`);
      }
      return Promise.resolve(trainer);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async findTrainersByIds(ids: string[]): Promise<WithId<TrainerDbObject>[]> {
    try {
      if (ids.length > TRAINERS_LIST_LIMIT) {
        logger.warn(
          `Requesting too many trainers (${ids.length}, will limit to ${TRAINERS_LIST_LIMIT}`,
        );
      }
      const trainers = await this.collection
        .find({
          _id: {
            $in: ids.map((id) => new ObjectId(id)),
          },
        })
        .limit(TRAINERS_LIST_LIMIT)
        .toArray();
      return Promise.resolve(trainers);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async listTrainersByClub(
    clubId: string,
    first: number,
    after?: string,
  ): Promise<[WithId<TrainerDbObject>[], boolean]> {
    return listByFilter(
      this.collection,
      { club: new ObjectId(clubId) },
      first,
      after,
    );
  }

  async createTrainer(
    clubId: string,
    input: TrainerInput,
  ): Promise<TrainerDbObject> {
    try {
      const trainer: TrainerDbObject = {
        club: new ObjectId(clubId),
        ...input,
      };

      const result = await this.collection.insertOne(trainer);

      return {
        ...trainer,
        _id: result.insertedId,
      };
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async deleteTrainer(id: string): Promise<boolean> {
    // make transaction
    try {
      const trainer = await this.findTrainerById(id);
      if (trainer.photo) {
        this.fileUploadAPI
          .deleteFileUpload(trainer.photo)
          .then((success) => {
            if (success)
              logger.info(
                `Successfully deleted trainer photo ${trainer.photo}`,
              );
            else
              logger.error(`Could not delete trainer photo ${trainer.photo}`);
          })
          .catch((e) => {
            logger.error(e.toString());
          });
      }
      const result = await this.collection.deleteOne({ _id: trainer._id });
      return Promise.resolve(result.deletedCount === 1);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async deleteTrainersByClub(clubId: string): Promise<number> {
    try {
      const cursor = await this.collection.find({
        club: new ObjectId(clubId),
      });
      let deleteCount = 0;
      while (await cursor.hasNext()) {
        const id = (await cursor.next())._id.toString();
        if (await this.deleteTrainer(id)) {
          deleteCount += 1;
        }
      }
      return Promise.resolve(deleteCount);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
