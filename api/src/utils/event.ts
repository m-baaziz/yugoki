import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { EventDbObject, Event as ClubEvent } from '../generated/graphql';

export function dbEventToEvent(event: EventDbObject): ClubEvent {
  const { _id, site, dateRFC3339, title, description, image } = event;
  return {
    id: _id.toString(),
    site,
    dateRFC3339,
    title,
    description,
    image,
  };
}

export function parseEvent(item: Record<string, AttributeValue>): ClubEvent {
  return {
    id: item.Id.S,
    site: item.Site.S,
    title: item.Title.S,
    description: item.Description.S,
    dateRFC3339: item.DateRFC3339.S,
    image: item.Image?.S,
  };
}
