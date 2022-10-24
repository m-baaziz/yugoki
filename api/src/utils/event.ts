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
