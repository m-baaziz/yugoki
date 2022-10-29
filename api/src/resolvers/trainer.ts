import { ContextWithDataSources } from '../datasources';
import {
  Trainer,
  TrainerPageInfo,
  QueryListTrainersByClubArgs,
  MutationCreateTrainerArgs,
  MutationDeleteTrainerArgs,
} from '../generated/graphql';
import { logger } from '../logger';
import { isUserAuthorized } from '../utils/club';

export async function listTrainersByClub(
  _parent: unknown,
  { clubId, first, after }: QueryListTrainersByClubArgs,
  { dataSources: { trainerAPI } }: ContextWithDataSources,
): Promise<TrainerPageInfo> {
  try {
    return await trainerAPI.listTrainersByClub(clubId, first, after);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function createTrainer(
  _parent: unknown,
  { clubId, input }: MutationCreateTrainerArgs,
  { user, dataSources: { trainerAPI, clubAPI } }: ContextWithDataSources,
): Promise<Trainer> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    const club = await clubAPI.findClubById(clubId);
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }
    return await trainerAPI.createTrainer(clubId, input);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function deleteTrainer(
  _parent: unknown,
  { clubId, id }: MutationDeleteTrainerArgs,
  { user, dataSources: { trainerAPI, clubAPI } }: ContextWithDataSources,
): Promise<boolean> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    const club = await clubAPI.findClubById(clubId);
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }
    return await trainerAPI.deleteTrainer(clubId, id);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}
