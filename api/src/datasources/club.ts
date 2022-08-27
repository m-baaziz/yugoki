/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Collection, Db, ObjectId, WithId } from 'mongodb';

import { _Collection } from '.';
import { ClubDbObject } from '../generated/graphql';

export default class ClubAPI extends DataSource {
  collection: Collection<ClubDbObject>;
  context: any;

  constructor(db: Db) {
    super();
    this.collection = db.collection<ClubDbObject>(_Collection.Club);
  }

  initialize(config: DataSourceConfig<any>): void | Promise<void> {
    this.context = config.context;
  }

  async createIndexes(): Promise<void> {
    try {
      await this.collection.createIndex({ name: 1 }, { unique: false });
      await this.collection.createIndex({ address: 1 }, { unique: true });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async findClubById(id: string): Promise<WithId<ClubDbObject>> {
    try {
      const club = await this.collection.findOne({
        _id: new ObjectId(id),
      });
      if (!club) {
        return Promise.reject(`Club with id ${id} not found`);
      }
      return Promise.resolve(club);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async listClubs(
    first: number,
    after?: string,
  ): Promise<[WithId<ClubDbObject>[], boolean]> {
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
      const clubs = await cursor.toArray();
      const hasNext = clubs.length > first;
      if (hasNext) {
        clubs.pop();
      }
      return Promise.resolve([clubs, hasNext]);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
