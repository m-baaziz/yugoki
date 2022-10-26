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
    id: item.Id.S,
    title: item.Title.S,
    description: item.Description.S,
    tags: item.Tags.SS,
  };
}
