/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Collection, Db, ObjectId, WithId } from 'mongodb';

import { _Collection } from '.';
import { TrainerDbObject, TrainerInput } from '../generated/graphql';
import { logger } from '../logger';

export const TRAINERS_LIST_LIMIT = 1000;

export default class TrainerAPI extends DataSource {
  collection: Collection<TrainerDbObject>;
  context: any;

  constructor(db: Db) {
    super();
    this.collection = db.collection<TrainerDbObject>(_Collection.Trainer);
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

  async listTrainers(
    first: number,
    after?: string,
  ): Promise<[WithId<TrainerDbObject>[], boolean]> {
    try {
      const filter = {
        ...(after
          ? {
              _id: {
                $gt: new ObjectId(after),
              },
            }
          : {}),
      };
      const cursor = this.collection
        .find(filter)
        .limit(first + 1)
        .sort({ _id: 1 });
      const trainers = await cursor.toArray();
      const hasNext = trainers.length > first;
      if (hasNext) {
        trainers.pop();
      }
      return Promise.resolve([trainers, hasNext]);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async listTrainersByClub(
    clubId: string,
    first: number,
    after?: string,
  ): Promise<[WithId<TrainerDbObject>[], boolean]> {
    try {
      const filter = {
        club: new ObjectId(clubId),
        ...(after
          ? {
              _id: {
                $gt: new ObjectId(after),
              },
            }
          : {}),
      };
      const cursor = this.collection
        .find(filter)
        .limit(first + 1)
        .sort({ _id: 1 });
      const trainers = await cursor.toArray();
      const hasNext = trainers.length > first;
      if (hasNext) {
        trainers.pop();
      }
      return Promise.resolve([trainers, hasNext]);
    } catch (e) {
      return Promise.reject(e);
    }
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
    try {
      const trainer = await this.findTrainerById(id);

      const result = await this.collection.deleteOne({ _id: trainer._id });
      return Promise.resolve(result.deletedCount === 1);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async deleteTrainersByClub(clubId: string): Promise<number> {
    try {
      const result = await this.collection.deleteMany({
        club: new ObjectId(clubId),
      });
      return Promise.resolve(result.deletedCount);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
