/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Collection, Db, ObjectId, WithId } from 'mongodb';

import { _Collection } from '.';
import { SiteDbObject, SiteInput } from '../generated/graphql';
import { logger } from '../logger';
import EventAPI from './event';
import FileUploadAPI from './fileUpload';
import { listByFilter } from './helpers';
import SubscriptionOptionAPI from './subscriptionOption';

export default class SiteAPI extends DataSource {
  collection: Collection<SiteDbObject>;
  context: any;
  subscriptionOptionAPI: SubscriptionOptionAPI;
  eventAPI: EventAPI;
  fileUploadAPI: FileUploadAPI;

  constructor(
    db: Db,
    subscriptionOptionAPI: SubscriptionOptionAPI,
    eventAPI: EventAPI,
    fileUploadAPI: FileUploadAPI,
  ) {
    super();
    this.collection = db.collection<SiteDbObject>(_Collection.Site);
    this.subscriptionOptionAPI = subscriptionOptionAPI;
    this.eventAPI = eventAPI;
    this.fileUploadAPI = fileUploadAPI;
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

  async findSiteById(id: string): Promise<WithId<SiteDbObject>> {
    try {
      const club = await this.collection.findOne({
        _id: new ObjectId(id),
      });
      if (!club) {
        return Promise.reject(`Site with id ${id} not found`);
      }
      return Promise.resolve(club);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  listSites(
    first: number,
    after?: string,
  ): Promise<[WithId<SiteDbObject>[], boolean]> {
    return listByFilter(this.collection, {}, first, after);
  }

  listSitesByClub(
    clubId: string,
    first: number,
    after?: string,
  ): Promise<[WithId<SiteDbObject>[], boolean]> {
    return listByFilter(
      this.collection,
      { club: new ObjectId(clubId) },
      first,
      after,
    );
  }

  listSitesBySportAndArea(
    sport: string,
    topLeftLat: number,
    topLeftLon: number,
    bottomRightLat: number,
    bottomRightLon: number,
    first: number,
    after?: string,
  ): Promise<[WithId<SiteDbObject>[], boolean]> {
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

  listSitesBySportAndAddress(
    sport: string,
    address: string,
    first: number,
    after?: string,
  ): Promise<[WithId<SiteDbObject>[], boolean]> {
    const filter = {
      sport: new ObjectId(sport),
      address: { $regex: address },
    };
    return listByFilter(this.collection, filter, first, after);
  }

  async createSite(
    clubId: string,
    sportId: string,
    input: SiteInput,
  ): Promise<SiteDbObject> {
    try {
      const site: SiteDbObject = {
        club: new ObjectId(clubId),
        sport: new ObjectId(sportId),
        ...input,
        trainers: input.trainerIds.map((id) => new ObjectId(id)),
      };

      const result = await this.collection.insertOne(site);

      return {
        ...site,
        _id: result.insertedId,
      };
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async deleteSite(id: string): Promise<boolean> {
    try {
      // make mongodb transaction
      const site = await this.findSiteById(id);

      const subscriptionOptionsDeleteCount =
        await this.subscriptionOptionAPI.disableSubscriptionOptionsBySite(id);
      const eventsDeleteCount = await this.eventAPI.deleteEventsBySite(id);

      logger.info(
        `Deleted ${subscriptionOptionsDeleteCount} subscription options`,
      );
      logger.info(`Deleted ${eventsDeleteCount} events`);

      const result = await this.collection.deleteOne({
        _id: site._id,
      });
      Promise.all(
        site.images.map((imageId) =>
          this.fileUploadAPI.deleteFileUpload(imageId),
        ),
      )
        .then((successes) => {
          const count = successes.filter((s) => s).length;
          logger.info(`Successfully deleted ${count} images`);
        })
        .catch((errors) => {
          logger.error(errors.map((e) => e.toString()));
        });
      return Promise.resolve(result.deletedCount === 1);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async deleteSitesByClub(clubId: string): Promise<number> {
    try {
      const cursor = await this.collection.find({
        club: new ObjectId(clubId),
      });
      let cslDeleteCount = 0;
      while (await cursor.hasNext()) {
        const cslId = (await cursor.next())._id.toString();
        if (await this.deleteSite(cslId)) {
          cslDeleteCount += 1;
        }
      }
      return Promise.resolve(cslDeleteCount);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
