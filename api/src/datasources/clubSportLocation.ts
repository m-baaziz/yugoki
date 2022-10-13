/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Collection, Db, ObjectId, WithId } from 'mongodb';

import { _Collection } from '.';
import {
  ClubSportLocationDbObject,
  ClubSportLocationInput,
} from '../generated/graphql';
import { logger } from '../logger';
import EventAPI from './event';
import { listByFilter } from './helpers';
import SubscriptionOptionAPI from './subscriptionOption';

export default class ClubSportLocationAPI extends DataSource {
  collection: Collection<ClubSportLocationDbObject>;
  context: any;
  subscriptionOptionAPI: SubscriptionOptionAPI;
  eventAPI: EventAPI;

  constructor(
    db: Db,
    subscriptionOptionAPI: SubscriptionOptionAPI,
    eventAPI: EventAPI,
  ) {
    super();
    this.collection = db.collection<ClubSportLocationDbObject>(
      _Collection.ClubSportLocation,
    );
    this.subscriptionOptionAPI = subscriptionOptionAPI;
    this.eventAPI = eventAPI;
  }

  initialize(config: DataSourceConfig<any>): void | Promise<void> {
    this.context = config.context;
  }

  async createIndexes(): Promise<void> {
    try {
      await this.collection.createIndex({ name: 1 }, { unique: true });
      await this.collection.createIndex({ sport: 1 }, { unique: false });
      await this.collection.createIndex({ address: 1 }, { unique: false });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async findClubSportLocationById(
    id: string,
  ): Promise<WithId<ClubSportLocationDbObject>> {
    try {
      const club = await this.collection.findOne({
        _id: new ObjectId(id),
      });
      if (!club) {
        return Promise.reject(`Club sport location with id ${id} not found`);
      }
      return Promise.resolve(club);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  listClubSportLocations(
    first: number,
    after?: string,
  ): Promise<[WithId<ClubSportLocationDbObject>[], boolean]> {
    return listByFilter(this.collection, {}, first, after);
  }

  listClubSportLocationsByClub(
    clubId: string,
    first: number,
    after?: string,
  ): Promise<[WithId<ClubSportLocationDbObject>[], boolean]> {
    return listByFilter(
      this.collection,
      { club: new ObjectId(clubId) },
      first,
      after,
    );
  }

  listClubSportLocationsBySportAndArea(
    sport: string,
    topLeftLat: number,
    topLeftLon: number,
    bottomRightLat: number,
    bottomRightLon: number,
    first: number,
    after?: string,
  ): Promise<[WithId<ClubSportLocationDbObject>[], boolean]> {
    const filter = {
      sport: new ObjectId(sport),
      $and: [
        { lat: { $lte: topLeftLat } },
        { lat: { $gte: bottomRightLat } },
        { lon: { $gte: topLeftLon } },
        { lon: { $lte: bottomRightLon } },
      ],
    };
    return listByFilter(this.collection, filter, first, after);
  }

  listClubSportLocationsBySportAndAddress(
    sport: string,
    address: string,
    first: number,
    after?: string,
  ): Promise<[WithId<ClubSportLocationDbObject>[], boolean]> {
    const filter = {
      sport: new ObjectId(sport),
      address: { $regex: address },
    };
    return listByFilter(this.collection, filter, first, after);
  }

  async createClubSportLocation(
    clubId: string,
    sportId: string,
    input: ClubSportLocationInput,
  ): Promise<ClubSportLocationDbObject> {
    try {
      const clubSportLocation: ClubSportLocationDbObject = {
        club: new ObjectId(clubId),
        sport: new ObjectId(sportId),
        ...input,
        trainers: input.trainerIds.map((id) => new ObjectId(id)),
      };

      const result = await this.collection.insertOne(clubSportLocation);

      return {
        ...clubSportLocation,
        _id: result.insertedId,
      };
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async deleteClubSportLocation(id: string): Promise<boolean> {
    try {
      const clubSportLocation = await this.findClubSportLocationById(id);

      const subscriptionOptionsDeleteCount =
        await this.subscriptionOptionAPI.disableSubscriptionOptionsByClubSportLocation(
          id,
        );
      const eventsDeleteCount =
        await this.eventAPI.deleteEventssByClubSportLocation(id);

      logger.info(
        `Deleted ${subscriptionOptionsDeleteCount} subscription options`,
      );
      logger.info(`Deleted ${eventsDeleteCount} events`);

      const result = await this.collection.deleteOne({
        _id: clubSportLocation._id,
      });
      return Promise.resolve(result.deletedCount === 1);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async deleteClubSportLocationsByClub(clubId: string): Promise<number> {
    try {
      const cursor = await this.collection.find({
        club: new ObjectId(clubId),
      });
      let subscriptionOptionsDeleteCount = 0;
      let eventsDeleteCount = 0;
      while (await cursor.hasNext()) {
        const cslId = (await cursor.next())._id.toString();
        subscriptionOptionsDeleteCount +=
          await this.subscriptionOptionAPI.disableSubscriptionOptionsByClubSportLocation(
            cslId,
          );
        eventsDeleteCount +=
          await this.eventAPI.deleteEventssByClubSportLocation(cslId);
      }
      logger.info(
        `Deleted ${subscriptionOptionsDeleteCount} subscription options`,
      );
      logger.info(`Deleted ${eventsDeleteCount} events`);
      const result = await this.collection.deleteMany({
        club: new ObjectId(clubId),
      });
      return Promise.resolve(result.deletedCount);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
