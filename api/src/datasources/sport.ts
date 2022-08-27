/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Collection, Db, ObjectId, WithId } from 'mongodb';

import { _Collection } from '.';
import { SportDbObject } from '../generated/graphql';

export default class SportAPI extends DataSource {
  collection: Collection<SportDbObject>;
  context: any;

  constructor(db: Db) {
    super();
    this.collection = db.collection<SportDbObject>(_Collection.Sport);
  }

  initialize(config: DataSourceConfig<any>): void | Promise<void> {
    this.context = config.context;
  }

  async createIndexes(): Promise<void> {
    try {
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async findSportById(id: string): Promise<WithId<SportDbObject>> {
    try {
      const sport = await this.collection.findOne({
        _id: new ObjectId(id),
      });
      if (!sport) {
        return Promise.reject(`Sport with id ${id} not found`);
      }
      return Promise.resolve(sport);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async listSports(
    first: number,
    after?: string,
  ): Promise<[WithId<SportDbObject>[], boolean]> {
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
      const sports = await cursor.toArray();
      const hasNext = sports.length > first;
      if (hasNext) {
        sports.pop();
      }
      return Promise.resolve([sports, hasNext]);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
