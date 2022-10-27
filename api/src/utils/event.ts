import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { EventDbObject, Event } from '../generated/graphql';

export function dbEventToEvent(event: EventDbObject): Event {
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

export function parseEvent(item: Record<string, AttributeValue>): Event {
  return {
    id: item.EventId.S,
    site: item.SiteId.S,
    title: item.EventTitle.S,
    description: item.EventDescription.S,
    dateRFC3339: item.EventDateRFC3339.S,
    image: item.EventImage?.S,
  };
}

export function eventToRecord(event: Event): Record<string, AttributeValue> {
  return {
    EventId: { S: event.id },
    SiteId: { S: event.site },
    EventTitle: { S: event.title },
    EventDescription: { S: event.description },
    EventDateRFC3339: { S: event.dateRFC3339 },
    EventImage: event.image ? { S: event.image } : undefined,
  };
}
