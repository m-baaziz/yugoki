/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Collection, Db, Filter, ObjectId, WithId } from 'mongodb';

import { _Collection } from '.';
import { ClubSportLocationDbObject } from '../generated/graphql';

export default class ClubSportLocationAPI extends DataSource {
  collection: Collection<ClubSportLocationDbObject>;
  context: any;

  constructor(db: Db) {
    super();
    this.collection = db.collection<ClubSportLocationDbObject>(
      _Collection.ClubSportLocation,
    );
  }

  initialize(config: DataSourceConfig<any>): void | Promise<void> {
    this.context = config.context;
  }

  async createIndexes(): Promise<void> {
    try {
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
    return this._listClubSportLocationsByFilter({}, first, after);
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
    return this._listClubSportLocationsByFilter(filter, first, after);
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
    return this._listClubSportLocationsByFilter(filter, first, after);
  }

  async _listClubSportLocationsByFilter(
    filter: Filter<ClubSportLocationDbObject>,
    first: number,
    after?: string,
  ): Promise<[WithId<ClubSportLocationDbObject>[], boolean]> {
    try {
      const newFilter = {
        ...filter,
        ...(after
          ? {
              _id: {
                $gt: new ObjectId(after),
              },
            }
          : {}),
      };
      const cursor = this.collection
        .find(newFilter)
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
