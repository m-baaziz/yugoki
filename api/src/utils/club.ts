import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { Club, ClubDbObject, User } from '../generated/graphql';

export function dbClubToClub(club: ClubDbObject): Club {
  const { _id, owner, name, logo } = club;
  return {
    id: _id.toString(),
    owner,
    name,
    logo,
  };
}

export function isUserAuthorized(club: ClubDbObject, user?: User): boolean {
  return user && user.id && club.owner === user.id;
}

export function parseClub(item: Record<string, AttributeValue>): Club {
  return {
    id: item.Id.S,
    name: item.Name?.S,
    owner: item.Owner?.S,
    logo: item.Logo?.S,
  };
}
