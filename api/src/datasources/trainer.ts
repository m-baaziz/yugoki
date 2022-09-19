/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Collection, Db, ObjectId, WithId } from 'mongodb';

import { _Collection } from '.';
import { TrainerDbObject } from '../generated/graphql';
import { logger } from '../logger';

const TRAINERS_LIST_LIMIT = 1000;

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
}
