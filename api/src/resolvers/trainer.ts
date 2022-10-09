import { ContextWithDataSources } from '../datasources';
import {
  Trainer,
  TrainerPageInfo,
  QueryListTrainersByClubArgs,
  MutationCreateTrainerArgs,
  MutationDeleteTrainerArgs,
} from '../generated/graphql';
import { dbTrainerToTrainer } from '../utils/trainer';
import { logger } from '../logger';
import { isUserAuthorized } from '../utils/club';

export async function listTrainersByClub(
  _parent: unknown,
  { clubId, first, after }: QueryListTrainersByClubArgs,
  { dataSources: { trainerAPI, clubAPI } }: ContextWithDataSources,
): Promise<TrainerPageInfo> {
  try {
    const club = await clubAPI.findClubById(clubId);
    const [trainers, hasNextPage] = await trainerAPI.listTrainersByClub(
      clubId,
      first,
      after,
    );
    const endCursor =
      trainers.length > 0
        ? trainers[trainers.length - 1]._id.toString()
        : undefined;
    return {
      trainers: trainers.map((t) => dbTrainerToTrainer(t, club)),
      hasNextPage,
      endCursor,
    };
  } catch (e) {
    logger.error(e);
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
    const trainer = await trainerAPI.createTrainer(clubId, input);
    return Promise.resolve(dbTrainerToTrainer(trainer, club));
  } catch (e) {
    logger.error(e);
    return Promise.reject(e);
  }
}

export async function deleteTrainer(
  _parent: unknown,
  { id }: MutationDeleteTrainerArgs,
  { user, dataSources: { trainerAPI, clubAPI } }: ContextWithDataSources,
): Promise<boolean> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    const trainer = await trainerAPI.findTrainerById(id);
    const club = await clubAPI.findClubById(trainer.club.toString());
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }
    const result = await trainerAPI.deleteTrainer(id);
    return Promise.resolve(result);
  } catch (e) {
    logger.error(e);
    return Promise.reject(e);
  }
}
