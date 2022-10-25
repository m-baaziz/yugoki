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
import { dbSubscriptionOptionToSubscriptionOption } from '../utils/subscriptionOption';

export async function getSubscriptionOption(
  _parent: unknown,
  { id }: QueryGetSubscriptionOptionArgs,
  { dataSources: { subscriptionOptionAPI } }: ContextWithDataSources,
): Promise<SubscriptionOption> {
  try {
    const subscriptionOption =
      await subscriptionOptionAPI.findSubscriptionOptionById(id);
    return dbSubscriptionOptionToSubscriptionOption(subscriptionOption);
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
    const [subscriptionOptions, hasNextPage] =
      await subscriptionOptionAPI.listSubscriptionOptionsBySite(
        siteId,
        first,
        after,
      );
    const endCursor =
      subscriptionOptions.length > 0
        ? subscriptionOptions[subscriptionOptions.length - 1]._id.toString()
        : undefined;
    return {
      subscriptionOptions: subscriptionOptions.map(
        dbSubscriptionOptionToSubscriptionOption,
      ),
      hasNextPage,
      endCursor,
    };
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
    const [subscriptionOptions, hasNextPage] =
      await subscriptionOptionAPI.listEnabledSubscriptionOptionsBySite(
        siteId,
        first,
        after,
      );
    const endCursor =
      subscriptionOptions.length > 0
        ? subscriptionOptions[subscriptionOptions.length - 1]._id.toString()
        : undefined;
    return {
      subscriptionOptions: subscriptionOptions.map(
        dbSubscriptionOptionToSubscriptionOption,
      ),
      hasNextPage,
      endCursor,
    };
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
    const club = await clubAPI.findClubById(site.club.toString());
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }
    const subscriptionOption =
      await subscriptionOptionAPI.createSubscriptionOption(siteId, input);
    return dbSubscriptionOptionToSubscriptionOption(subscriptionOption);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function enableSubscriptionOption(
  _parent: unknown,
  { id }: MutationEnableSubscriptionOptionArgs,
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
      await subscriptionOptionAPI.findSubscriptionOptionById(id);
    const site = await siteAPI.findSiteById(subscriptionOption.site);
    const club = await clubAPI.findClubById(site.club.toString());
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }
    const newSubscriptionOption =
      await subscriptionOptionAPI.enableSubscriptionOption(id);
    return dbSubscriptionOptionToSubscriptionOption(newSubscriptionOption);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function disableSubscriptionOption(
  _parent: unknown,
  { id }: MutationEnableSubscriptionOptionArgs,
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
      await subscriptionOptionAPI.findSubscriptionOptionById(id);
    const site = await siteAPI.findSiteById(subscriptionOption.site);
    const club = await clubAPI.findClubById(site.club.toString());
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }
    const newSubscriptionOption =
      await subscriptionOptionAPI.disableSubscriptionOption(id);
    return dbSubscriptionOptionToSubscriptionOption(newSubscriptionOption);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}
