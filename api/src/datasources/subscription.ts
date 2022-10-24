/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Collection, Db, ObjectId, WithId } from 'mongodb';

import { _Collection } from '.';
import {
  SubscriptionDbObject,
  SubscriberDetailsInput,
} from '../generated/graphql';
import { listByFilter } from './helpers';
import SubscriptionOptionAPI from './subscriptionOption';

export default class SubscriptionAPI extends DataSource {
  collection: Collection<SubscriptionDbObject>;
  context: any;
  subscriptionOptionAPI: SubscriptionOptionAPI;

  constructor(db: Db, subscriptionOptionAPI: SubscriptionOptionAPI) {
    super();
    this.collection = db.collection<SubscriptionDbObject>(
      _Collection.Subscription,
    );
    this.subscriptionOptionAPI = subscriptionOptionAPI;
  }

  initialize(config: DataSourceConfig<any>): void | Promise<void> {
    this.context = config.context;
  }

  async createIndexes(): Promise<void> {
    try {
      await this.collection.createIndex(
        { subscriptionOption: 1 },
        { unique: false },
      );
      await this.collection.createIndex({ club: 1 }, { unique: false });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async findSubscriptionById(
    id: string,
  ): Promise<WithId<SubscriptionDbObject>> {
    try {
      const subscription = await this.collection.findOne({
        _id: new ObjectId(id),
      });
      if (!subscription) {
        return Promise.reject(`Subscription with id ${id} not found`);
      }
      return Promise.resolve(subscription);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async listSubscriptions(
    first: number,
    after?: string,
  ): Promise<[WithId<SubscriptionDbObject>[], boolean]> {
    return listByFilter(this.collection, {}, first, after);
  }

  async listSubscriptionsBySubscriptionOption(
    subscriptionOptionId: string,
    first: number,
    after?: string,
  ): Promise<[WithId<SubscriptionDbObject>[], boolean]> {
    return listByFilter(
      this.collection,
      { subscriptionOption: new ObjectId(subscriptionOptionId) },
      first,
      after,
    );
  }

  async listSubscriptionsBySite(
    siteId: string,
    first: number,
    after?: string,
  ): Promise<[WithId<SubscriptionDbObject>[], boolean]> {
    return listByFilter(this.collection, { site: siteId }, first, after);
  }

  async createSubscription(
    subscriptionOptionId: string,
    subscriberDetails: SubscriberDetailsInput,
  ): Promise<SubscriptionDbObject> {
    try {
      const now = new Date();
      const subscriptionOption =
        await this.subscriptionOptionAPI.findSubscriptionOptionById(
          subscriptionOptionId,
        );
      const subscription: SubscriptionDbObject = {
        subscriptionOption: new ObjectId(subscriptionOptionId),
        site: subscriptionOption.site,
        subscriberDetails,
        createdAtRFC3339: now.toISOString(),
      };

      const result = await this.collection.insertOne(subscription);

      return {
        ...subscription,
        _id: result.insertedId,
      };
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
