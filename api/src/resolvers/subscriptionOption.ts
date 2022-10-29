import { ContextWithDataSources } from '../datasources';
import {
  MutationCreateSubscriptionOptionArgs,
  QueryListSubscriptionOptionsBySiteArgs,
  SubscriptionOptionPageInfo,
  SubscriptionOption,
  MutationEnableSubscriptionOptionArgs,
  QueryListEnabledSubscriptionOptionsBySiteArgs,
  QueryGetSubscriptionOptionArgs,
} from '../generated/graphql';
import { logger } from '../logger';
import { isUserAuthorized } from '../utils/club';

export async function getSubscriptionOption(
  _parent: unknown,
  { siteId, id }: QueryGetSubscriptionOptionArgs,
  { dataSources: { subscriptionOptionAPI } }: ContextWithDataSources,
): Promise<SubscriptionOption> {
  try {
    return await subscriptionOptionAPI.findSubscriptionOptionById(siteId, id);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function listSubscriptionOptionsBySite(
  _parent: unknown,
  { siteId, first, after }: QueryListSubscriptionOptionsBySiteArgs,
  { dataSources: { subscriptionOptionAPI } }: ContextWithDataSources,
): Promise<SubscriptionOptionPageInfo> {
  try {
    return await subscriptionOptionAPI.listSubscriptionOptionsBySite(
      siteId,
      first,
      after,
    );
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function listEnabledSubscriptionOptionsBySite(
  _parent: unknown,
  { siteId, first, after }: QueryListEnabledSubscriptionOptionsBySiteArgs,
  { dataSources: { subscriptionOptionAPI } }: ContextWithDataSources,
): Promise<SubscriptionOptionPageInfo> {
  try {
    return await subscriptionOptionAPI.listEnabledSubscriptionOptionsBySite(
      siteId,
      first,
      after,
    );
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function createSubscriptionOption(
  _parent: unknown,
  { siteId, input }: MutationCreateSubscriptionOptionArgs,
  {
    user,
    dataSources: { subscriptionOptionAPI, siteAPI, clubAPI },
  }: ContextWithDataSources,
): Promise<SubscriptionOption> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    const site = await siteAPI.findSiteById(siteId);
    const club = await clubAPI.findClubById(site.club.id);
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }
    return await subscriptionOptionAPI.createSubscriptionOption(siteId, input);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function enableSubscriptionOption(
  _parent: unknown,
  { siteId, id }: MutationEnableSubscriptionOptionArgs,
  {
    user,
    dataSources: { subscriptionOptionAPI, siteAPI, clubAPI },
  }: ContextWithDataSources,
): Promise<SubscriptionOption> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    const subscriptionOption =
      await subscriptionOptionAPI.findSubscriptionOptionById(siteId, id);
    const site = await siteAPI.findSiteById(subscriptionOption.site);
    const club = await clubAPI.findClubById(site.club.id);
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }
    const done = await subscriptionOptionAPI.enableSubscriptionOption(
      siteId,
      id,
    );
    return {
      ...subscriptionOption,
      enabled: done ? true : subscriptionOption.enabled,
    };
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function disableSubscriptionOption(
  _parent: unknown,
  { siteId, id }: MutationEnableSubscriptionOptionArgs,
  {
    user,
    dataSources: { subscriptionOptionAPI, siteAPI, clubAPI },
  }: ContextWithDataSources,
): Promise<SubscriptionOption> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    const subscriptionOption =
      await subscriptionOptionAPI.findSubscriptionOptionById(siteId, id);
    const site = await siteAPI.findSiteById(subscriptionOption.site);
    const club = await clubAPI.findClubById(site.club.id);
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }
    const done = await subscriptionOptionAPI.disableSubscriptionOption(
      siteId,
      id,
    );
    return {
      ...subscriptionOption,
      enabled: done ? false : subscriptionOption.enabled,
    };
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}
