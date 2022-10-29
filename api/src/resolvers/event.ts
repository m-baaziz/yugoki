import { ContextWithDataSources } from '../datasources';
import {
  Event,
  EventPageInfo,
  QueryListSiteEventsArgs,
  QueryGetEventArgs,
  MutationDeleteEventArgs,
  MutationCreateEventArgs,
} from '../generated/graphql';
import { logger } from '../logger';
import { isUserAuthorized } from '../utils/club';

export async function listSiteEvents(
  _parent: unknown,
  { siteId, first, after }: QueryListSiteEventsArgs,
  { dataSources: { eventAPI } }: ContextWithDataSources,
): Promise<EventPageInfo> {
  try {
    return await eventAPI.listEventsBySiteId(siteId, first, after);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function getEvent(
  _parent: unknown,
  { siteId, id }: QueryGetEventArgs,
  { dataSources: { eventAPI } }: ContextWithDataSources,
): Promise<Event> {
  try {
    const event = await eventAPI.findEventById(siteId, id);
    return Promise.resolve(event);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function createEvent(
  _parent: unknown,
  { siteId, input }: MutationCreateEventArgs,
  { user, dataSources: { siteAPI, clubAPI, eventAPI } }: ContextWithDataSources,
): Promise<Event> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    const site = await siteAPI.findSiteById(siteId);
    const club = await clubAPI.findClubById(site.club.id);
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }
    return await eventAPI.createEvent(siteId, input);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function deleteEvent(
  _parent: unknown,
  { siteId, id }: MutationDeleteEventArgs,
  { dataSources: { eventAPI } }: ContextWithDataSources,
): Promise<boolean> {
  try {
    const result = await eventAPI.deleteEvent(siteId, id);
    return Promise.resolve(result);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}
