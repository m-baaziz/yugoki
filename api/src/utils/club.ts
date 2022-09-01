import { Club, ClubDbObject } from '../generated/graphql';

export function dbClubToClub(club: ClubDbObject): Club {
  const { _id, name, subtitle, logo } = club;
  return {
    id: _id.toString(),
    name,
    subtitle,
    logo,
  };
}
