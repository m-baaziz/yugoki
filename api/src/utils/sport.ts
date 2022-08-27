import { Sport, SportDbObject } from '../generated/graphql';

export function dbSportToSport(sport: SportDbObject): Sport {
  const { _id, title, description, tags } = sport;
  return {
    id: _id.toString(),
    title,
    description,
    tags,
  };
}
