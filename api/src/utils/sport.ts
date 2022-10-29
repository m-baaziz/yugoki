import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { Sport } from '../generated/graphql';

export function parseSport(item: Record<string, AttributeValue>): Sport {
  return {
    id: item.SportId.S,
    title: item.SportTitle.S,
    description: item.SportDescription.S,
    tags: item.SportTags.L.map((tag) => tag.S),
  };
}

export function sportToRecord(sport: Sport): Record<string, AttributeValue> {
  return {
    SportId: { S: sport.id },
    SportTitle: { S: sport.title },
    SportDescription: { S: sport.description },
    SportTags: { L: sport.tags.map((tag) => ({ S: tag })) },
  };
}
