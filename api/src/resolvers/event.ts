import { ContextWithDataSources } from '../datasources';
import {
  Event,
  EventPageInfo,
  QueryListClubSportLocationEventsArgs,
  QueryGetEventArgs,
} from '../generated/graphql';
import { dbEventToEvent } from '../utils/event';
import { logger } from '../logger';

export async function listClubSportLocationEvents(
  _parent: unknown,
  { cslId, first, after }: QueryListClubSportLocationEventsArgs,
  { dataSources: { eventAPI } }: ContextWithDataSources,
): Promise<EventPageInfo> {
  try {
    const [events, hasNextPage] = await eventAPI.listEventsByCslId(
      cslId,
      first,
      after,
    );
    const endCursor =
      events.length > 0 ? events[events.length - 1]._id.toString() : undefined;
    return {
      events: events.map(dbEventToEvent),
      hasNextPage,
      endCursor,
    };
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function getEvent(
  _parent: unknown,
  { id }: QueryGetEventArgs,
  { dataSources: { eventAPI } }: ContextWithDataSources,
): Promise<Event> {
  try {
    const event = await eventAPI.findEventById(id);
    return Promise.resolve(dbEventToEvent(event));
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}
