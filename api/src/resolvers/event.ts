import { ContextWithDataSources } from '../datasources';
import {
  Event,
  EventPageInfo,
  QueryListClubSportLocationEventsArgs,
  QueryGetEventArgs,
  MutationDeleteEventArgs,
  MutationCreateEventArgs,
} from '../generated/graphql';
import { dbEventToEvent } from '../utils/event';
import { logger } from '../logger';
import { isUserAuthorized } from '../utils/club';

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

export async function createEvent(
  _parent: unknown,
  { cslId, input }: MutationCreateEventArgs,
  {
    user,
    dataSources: { clubSportLocationAPI, clubAPI, eventAPI },
  }: ContextWithDataSources,
): Promise<Event> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    const clubSportLocation =
      await clubSportLocationAPI.findClubSportLocationById(cslId);
    const club = await clubAPI.findClubById(clubSportLocation.club.toString());
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }
    const clubEvent = await eventAPI.createEvent(cslId, input);
    return dbEventToEvent(clubEvent);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function deleteEvent(
  _parent: unknown,
  { id }: MutationDeleteEventArgs,
  { dataSources: { eventAPI } }: ContextWithDataSources,
): Promise<boolean> {
  try {
    const result = await eventAPI.deleteEvent(id);
    return Promise.resolve(result);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}
