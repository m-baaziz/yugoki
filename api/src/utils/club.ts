import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { Club, User } from '../generated/graphql';

export function isUserAuthorized(club: Club, user?: User): boolean {
  return user && user.id && club.owner === user.id;
}

export function parseClub(item: Record<string, AttributeValue>): Club {
  return {
    id: item.ClubId.S,
    name: item.ClubName.S,
    owner: item.ClubOwner.S,
    logo: item.ClubLogo?.S,
  };
}

export function clubToRecord(club: Club): Record<string, AttributeValue> {
  return {
    ClubId: { S: club.id },
    ClubOwner: { S: club.owner },
    ClubName: { S: club.name },
    ClubLogo: club.logo ? { S: club.logo } : { S: '' },
  };
}
