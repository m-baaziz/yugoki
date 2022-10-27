import { AttributeValue } from '@aws-sdk/client-dynamodb';
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

export function parseSport(item: Record<string, AttributeValue>): Sport {
  return {
    id: item.SportId.S,
    title: item.SportTitle.S,
    description: item.SportDescription.S,
    tags: item.SportTags.SS,
  };
}

export function sportToRecord(sport: Sport): Record<string, AttributeValue> {
  return {
    SportId: { S: sport.id },
    SportTitle: { S: sport.title },
    SportDescription: { S: sport.description },
    SportTags: { SS: sport.tags },
  };
}
