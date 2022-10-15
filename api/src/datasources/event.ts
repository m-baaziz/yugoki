/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Collection, Db, ObjectId, WithId } from 'mongodb';

import { _Collection } from '.';
import { EventDbObject, EventInput } from '../generated/graphql';
import { logger } from '../logger';
import FileUploadAPI from './fileUpload';
import { listByFilter } from './helpers';

export default class EventAPI extends DataSource {
  collection: Collection<EventDbObject>;
  context: any;
  fileUploadAPI: FileUploadAPI;

  constructor(db: Db, fileUploadAPI: FileUploadAPI) {
    super();
    this.collection = db.collection<EventDbObject>(_Collection.Event);
    this.fileUploadAPI = fileUploadAPI;
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
    // make transaction
    try {
      const event = await this.findEventById(id);
      const result = await this.collection.deleteOne({
        _id: new ObjectId(id),
      });
      if (event.image) {
        this.fileUploadAPI
          .deleteFileUpload(event.image)
          .then((success) => {
            if (success)
              logger.info(`Successfully deleted event image ${event.image}`);
            else logger.error(`Could not delete event image ${event.image}`);
          })
          .catch((e) => {
            logger.error(e.toString());
          });
      }
      return Promise.resolve(result.deletedCount === 1);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async deleteEventsByClubSportLocation(cslId: string): Promise<number> {
    try {
      const cursor = await this.collection.find({
        clubSportLocation: cslId,
      });
      let deleteCount = 0;
      while (await cursor.hasNext()) {
        const id = (await cursor.next())._id.toString();
        if (await this.deleteEvent(id)) {
          deleteCount += 1;
        }
      }
      return Promise.resolve(deleteCount);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
