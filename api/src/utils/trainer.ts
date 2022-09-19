import { ClubDbObject, Trainer, TrainerDbObject } from '../generated/graphql';
import { dbClubToClub } from './club';

export function dbTrainerToTrainer(
  trainer: TrainerDbObject,
  club: ClubDbObject,
): Trainer {
  const { _id, firstname, lastname, displayname, description, photo } = trainer;
  return {
    id: _id.toString(),
    firstname,
    lastname,
    displayname,
    description,
    photo,
    club: dbClubToClub(club),
  };
}
