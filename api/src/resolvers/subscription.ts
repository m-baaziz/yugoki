import { ContextWithDataSources } from '../datasources';
import {
  QueryListSubscriptionsBySubscriptionOptionArgs,
  SubscriptionPageInfo,
  MutationCreateSubscriptionArgs,
  Subscription,
  QueryListSubscriptionsBySiteArgs,
  QueryGetSubscriptionArgs,
} from '../generated/graphql';
import { logger } from '../logger';
import { isUserAuthorized } from '../utils/club';

export async function getSubscription(
  _parent: unknown,
  { siteId, id }: QueryGetSubscriptionArgs,
  { user, dataSources: { subscriptionAPI } }: ContextWithDataSources,
): Promise<Subscription> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    return await subscriptionAPI.findSubscriptionById(siteId, id);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function listSubscriptionsBySubscriptionOption(
  _parent: unknown,
  {
    siteId,
    subscriptionOptionId,
    first,
    after,
  }: QueryListSubscriptionsBySubscriptionOptionArgs,
  {
    user,
    dataSources: { subscriptionAPI, subscriptionOptionAPI, siteAPI, clubAPI },
  }: ContextWithDataSources,
): Promise<SubscriptionPageInfo> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    const subscriptionOption =
      await subscriptionOptionAPI.findSubscriptionOptionById(
        siteId,
        subscriptionOptionId,
      );
    const site = await siteAPI.findSiteById(subscriptionOption.site);
    const club = await clubAPI.findClubById(site.club.toString());
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }
    return await subscriptionAPI.listSubscriptionsBySubscriptionOption(
      siteId,
      subscriptionOptionId,
      first,
      after,
    );
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function listSubscriptionsBySite(
  _parent: unknown,
  { siteId, first, after }: QueryListSubscriptionsBySiteArgs,
  {
    user,
    dataSources: { subscriptionAPI, siteAPI, clubAPI },
  }: ContextWithDataSources,
): Promise<SubscriptionPageInfo> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    const site = await siteAPI.findSiteById(siteId);
    const club = await clubAPI.findClubById(site.club.toString());
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }
    return await subscriptionAPI.listSubscriptionsBySite(siteId, first, after);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function createSubscription(
  _parent: unknown,
  { siteId, subscriptionOptionId, details }: MutationCreateSubscriptionArgs,
  {
    dataSources: {
      subscriptionAPI,
      subscriptionOptionAPI,
      siteAPI,
      clubAPI,
      userAPI,
    },
  }: ContextWithDataSources,
): Promise<Subscription> {
  try {
    const subscriptionOption =
      await subscriptionOptionAPI.findSubscriptionOptionById(
        siteId,
        subscriptionOptionId,
      );
    if (!subscriptionOption.enabled) {
      return Promise.reject(
        'Cannot subscribe to a disabled subscription option.',
      );
    }
    const subscription = await subscriptionAPI.createSubscription(
      siteId,
      subscriptionOptionId,
      details,
    );
    const site = await siteAPI.findSiteById(subscriptionOption.site);
    const club = await clubAPI.findClubById(site.club.toString());
    const owner = await userAPI.findUserById(club.owner);
    logger.info(
      `Sending email to club owner ${owner.email} and customer ${details.email}`,
    );
    // send emails
    return subscription;
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}
