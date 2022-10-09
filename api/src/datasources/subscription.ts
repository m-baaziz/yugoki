/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Collection, Db, ObjectId, WithId } from 'mongodb';

import { _Collection } from '.';
import {
  SubscriptionDbObject,
  SubscriberDetailsInput,
} from '../generated/graphql';

export default class SubscriptionAPI extends DataSource {
  collection: Collection<SubscriptionDbObject>;
  context: any;

  constructor(db: Db) {
    super();
    this.collection = db.collection<SubscriptionDbObject>(
      _Collection.Subscription,
    );
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
      const subscriptions = await cursor.toArray();
      const hasNext = subscriptions.length > first;
      if (hasNext) {
        subscriptions.pop();
      }
      return Promise.resolve([subscriptions, hasNext]);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async listSubscriptionsBySubscriptionOption(
    subscriptionOptionId: string,
    first: number,
    after?: string,
  ): Promise<[WithId<SubscriptionDbObject>[], boolean]> {
    try {
      const filter = {
        subscriptionOption: new ObjectId(subscriptionOptionId),
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
      const subscriptions = await cursor.toArray();
      const hasNext = subscriptions.length > first;
      if (hasNext) {
        subscriptions.pop();
      }
      return Promise.resolve([subscriptions, hasNext]);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async createSubscription(
    subscriptionOptionId: string,
    subscriberDetails: SubscriberDetailsInput,
  ): Promise<SubscriptionDbObject> {
    try {
      const now = new Date();
      const subscriptionOption: SubscriptionDbObject = {
        subscriptionOption: new ObjectId(subscriptionOptionId),
        subscriberDetails,
        createdAtRFC3339: now.toISOString(),
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
}
