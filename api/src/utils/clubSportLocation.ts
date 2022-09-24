import {
  ClubDbObject,
  ClubSportLocation,
  ClubSportLocationDbObject,
  SportDbObject,
  TrainerDbObject,
} from '../generated/graphql';
import { dbClubToClub } from './club';
import { dbSportToSport } from './sport';
import { dbTrainerToTrainer } from './trainer';

export function dbClubSportLocationToClubSportLocation(
  clubSportLocation: ClubSportLocationDbObject,
  sport: SportDbObject,
  club: ClubDbObject,
  trainers: TrainerDbObject[],
): ClubSportLocation {
  const {
    _id,
    address,
    lat,
    lon,
    phone,
    website,
    images,
    description,
    activities,
    schedule,
  } = clubSportLocation;
  return {
    id: _id.toString(),
    club: dbClubToClub(club),
    sport: dbSportToSport(sport),
    address,
    lat,
    lon,
    images,
    description,
    phone,
    website,
    trainers: trainers.map((trainer) => dbTrainerToTrainer(trainer, club)),
    activities,
    schedule,
  };
}
