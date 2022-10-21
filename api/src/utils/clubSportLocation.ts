import { encode } from 'ngeohash';
import {
  ClubDbObject,
  ClubSportLocation,
  ClubSportLocationDbObject,
  SearchArea,
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
    name,
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
    name,
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

export function commonRadical(left: string, right: string): string {
  const minLength = Math.min(left.length, right.length);
  let radical = '';
  for (let i = 0; i < minLength; i++) {
    if (left[i] !== right[i]) return radical;
    else radical += left[i];
  }
  return radical;
}

export function computeAreaGeohash(area: SearchArea): string {
  const encodedTopLeft = encode(area.topLeftLat, area.topLeftLon, 9);
  const encodedBottomRight = encode(
    area.bottomRightLat,
    area.bottomRightLon,
    9,
  );
  console.log(encodedTopLeft, encodedBottomRight);
  return commonRadical(encodedTopLeft, encodedBottomRight);
}
