/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Collection, Db, ObjectId, WithId } from 'mongodb';

import { _Collection } from '.';
import { ClubDbObject } from '../generated/graphql';
import { logger } from '../logger';
import ClubSportLocationAPI from './clubSportLocation';
import { listByFilter } from './helpers';
import TrainerAPI from './trainer';

export default class ClubAPI extends DataSource {
  collection: Collection<ClubDbObject>;
  context: any;
  trainerAPI: TrainerAPI;
  clubSportLocationAPI: ClubSportLocationAPI;

  constructor(
    db: Db,
    trainerAPI: TrainerAPI,
    clubSportLocationAPI: ClubSportLocationAPI,
  ) {
    super();
    this.collection = db.collection<ClubDbObject>(_Collection.Club);
    this.trainerAPI = trainerAPI;
    this.clubSportLocationAPI = clubSportLocationAPI;
  }

  initialize(config: DataSourceConfig<any>): void | Promise<void> {
    this.context = config.context;
  }

  async createIndexes(): Promise<void> {
    try {
      await this.collection.createIndex({ name: 1 }, { unique: false });
      await this.collection.createIndex({ owner: 1 }, { unique: false });
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
    return listByFilter(this.collection, {}, first, after);
  }

  async listUserClubs(
    userId: string,
    first: number,
    after?: string,
  ): Promise<[WithId<ClubDbObject>[], boolean]> {
    return listByFilter(this.collection, { owner: userId }, first, after);
  }

  async createClub(ownerId: string, name: string): Promise<ClubDbObject> {
    try {
      const club: ClubDbObject = {
        owner: ownerId,
        name,
      };

      const result = await this.collection.insertOne(club);

      return {
        ...club,
        _id: result.insertedId,
      };
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async deleteClub(id: string): Promise<boolean> {
    try {
      const club = await this.findClubById(id);
      const trainersDeleteCount = await this.trainerAPI.deleteTrainersByClub(
        id,
      );
      logger.info(`Deleted ${trainersDeleteCount} trainers`);
      const cslDeleteCount =
        await this.clubSportLocationAPI.deleteClubSportLocationsByClub(id);
      logger.info(`Deleted ${cslDeleteCount} club sport locations`);

      const result = await this.collection.deleteOne({ _id: club._id });
      logger.info(`Deleted ${result.deletedCount} club`);
      return Promise.resolve(result.deletedCount === 1);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
