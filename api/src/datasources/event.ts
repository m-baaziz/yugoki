/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Collection, Db, ObjectId, WithId } from 'mongodb';

import { _Collection } from '.';
import { EventDbObject, EventInput } from '../generated/graphql';
import { listByFilter } from './helpers';

export default class EventAPI extends DataSource {
  collection: Collection<EventDbObject>;
  context: any;

  constructor(db: Db) {
    super();
    this.collection = db.collection<EventDbObject>(_Collection.Event);
  }

  initialize(config: DataSourceConfig<any>): void | Promise<void> {
    this.context = config.context;
  }

  async createIndexes(): Promise<void> {
    try {
      await this.collection.createIndex(
        { clubSportLocation: 1 },
        { unique: false },
      );
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async findEventById(id: string): Promise<WithId<EventDbObject>> {
    try {
      const event = await this.collection.findOne({
        _id: new ObjectId(id),
      });
      if (!event) {
        return Promise.reject(`Event with id ${id} not found`);
      }
      return Promise.resolve(event);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async listEvents(
    first: number,
    after?: string,
  ): Promise<[WithId<EventDbObject>[], boolean]> {
    return listByFilter(this.collection, {}, first, after);
  }

  async listEventsByCslId(
    cslId: string,
    first: number,
    after?: string,
  ): Promise<[WithId<EventDbObject>[], boolean]> {
    return listByFilter(
      this.collection,
      { clubSportLocation: cslId },
      first,
      after,
    );
  }

  async createEvent(cslId: string, input: EventInput): Promise<EventDbObject> {
    try {
      const clubEvent: EventDbObject = {
        clubSportLocation: cslId,
        ...input,
      };

      const result = await this.collection.insertOne(clubEvent);

      return {
        ...clubEvent,
        _id: result.insertedId,
      };
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async deleteEvent(id: string): Promise<boolean> {
    try {
      const result = await this.collection.deleteOne({
        _id: new ObjectId(id),
      });
      return Promise.resolve(result.deletedCount === 1);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async deleteEventsByClubSportLocation(cslId: string): Promise<number> {
    try {
      const result = await this.collection.deleteMany({
        clubSportLocation: cslId,
      });
      return Promise.resolve(result.deletedCount);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
