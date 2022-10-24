/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Collection, Db, ObjectId, WithId } from 'mongodb';

import { _Collection } from '.';
import {
  SubscriptionOptionDbObject,
  SubscriptionOptionInput,
} from '../generated/graphql';
import { listByFilter } from './helpers';

export default class SubscriptionOptionAPI extends DataSource {
  collection: Collection<SubscriptionOptionDbObject>;
  context: any;

  constructor(db: Db) {
    super();
    this.collection = db.collection<SubscriptionOptionDbObject>(
      _Collection.SubscriptionOption,
    );
  }

  initialize(config: DataSourceConfig<any>): void | Promise<void> {
    this.context = config.context;
  }

  async createIndexes(): Promise<void> {
    try {
      await this.collection.createIndex({ site: 1 }, { unique: false });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async findSubscriptionOptionById(
    id: string,
  ): Promise<WithId<SubscriptionOptionDbObject>> {
    try {
      const subscriptionOption = await this.collection.findOne({
        _id: new ObjectId(id),
      });
      if (!subscriptionOption) {
        return Promise.reject(`Subscription Option with id ${id} not found`);
      }
      return Promise.resolve(subscriptionOption);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async listSubscriptionOptions(
    first: number,
    after?: string,
  ): Promise<[WithId<SubscriptionOptionDbObject>[], boolean]> {
    return listByFilter(this.collection, {}, first, after);
  }

  async listSubscriptionOptionsBySite(
    cslId: string,
    first: number,
    after?: string,
  ): Promise<[WithId<SubscriptionOptionDbObject>[], boolean]> {
    return listByFilter(this.collection, { site: cslId }, first, after);
  }

  async listEnabledSubscriptionOptionsBySite(
    cslId: string,
    first: number,
    after?: string,
  ): Promise<[WithId<SubscriptionOptionDbObject>[], boolean]> {
    return listByFilter(
      this.collection,
      { site: cslId, enabled: true },
      first,
      after,
    );
  }

  async createSubscriptionOption(
    cslId: string,
    input: SubscriptionOptionInput,
  ): Promise<SubscriptionOptionDbObject> {
    try {
      const subscriptionOption: SubscriptionOptionDbObject = {
        site: cslId,
        ...input,
        enabled: true,
      };

      const result = await this.collection.insertOne(subscriptionOption);

      return {
        ...subscriptionOption,
        _id: result.insertedId,
      };
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async enableSubscriptionOption(
    id: string,
  ): Promise<SubscriptionOptionDbObject> {
    try {
      await this.collection.updateOne(
        {
          _id: new ObjectId(id),
        },
        { $set: { enabled: true } },
        { upsert: false },
      );
      const subscriptionOption = await this.findSubscriptionOptionById(id);
      return Promise.resolve(subscriptionOption);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async disableSubscriptionOption(
    id: string,
  ): Promise<SubscriptionOptionDbObject> {
    try {
      await this.collection.updateOne(
        {
          _id: new ObjectId(id),
        },
        { $set: { enabled: false } },
        { upsert: false },
      );
      const subscriptionOption = await this.findSubscriptionOptionById(id);
      return Promise.resolve(subscriptionOption);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async disableSubscriptionOptionsBySite(cslId: string): Promise<number> {
    try {
      const result = await this.collection.updateMany(
        {
          site: cslId,
        },
        { $set: { enabled: false } },
        { upsert: false },
      );
      return Promise.resolve(result.modifiedCount);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
