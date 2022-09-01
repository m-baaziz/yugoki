import {
  ClubDbObject,
  ClubSportLocation,
  ClubSportLocationDbObject,
  SportDbObject,
} from '../generated/graphql';
import { dbClubToClub } from './club';
import { dbSportToSport } from './sport';

export function dbClubSportLocationToClubSportLocation(
  clubSportLocation: ClubSportLocationDbObject,
  sport: SportDbObject,
  club: ClubDbObject,
): ClubSportLocation {
  const { _id, address, lat, lon } = clubSportLocation;
  return {
    id: _id.toString(),
    club: dbClubToClub(club),
    sport: dbSportToSport(sport),
    address,
    lat,
    lon,
  };
}
