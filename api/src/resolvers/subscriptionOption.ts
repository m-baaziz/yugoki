import { ContextWithDataSources } from '../datasources';
import {
  MutationCreateSubscriptionOptionArgs,
  QueryListSubscriptionOptionsByClubSportLocationArgs,
  SubscriptionOptionPageInfo,
  SubscriptionOption,
  MutationEnableSubscriptionOptionArgs,
} from '../generated/graphql';
import { logger } from '../logger';
import { isUserAuthorized } from '../utils/club';
import { dbSubscriptionOptionToSubscriptionOption } from '../utils/subscriptionOption';

export async function listSubscriptionOptionsByClubSportLocation(
  _parent: unknown,
  { cslId, first, after }: QueryListSubscriptionOptionsByClubSportLocationArgs,
  { dataSources: { subscriptionOptionAPI } }: ContextWithDataSources,
): Promise<SubscriptionOptionPageInfo> {
  try {
    const [subscriptionOptions, hasNextPage] =
      await subscriptionOptionAPI.listSubscriptionOptionsByClubSportLocation(
        cslId,
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
  { cslId, input }: MutationCreateSubscriptionOptionArgs,
  {
    user,
    dataSources: { subscriptionOptionAPI, clubSportLocationAPI, clubAPI },
  }: ContextWithDataSources,
): Promise<SubscriptionOption> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    const csl = await clubSportLocationAPI.findClubSportLocationById(cslId);
    const club = await clubAPI.findClubById(csl.club.toString());
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }
    const subscriptionOption =
      await subscriptionOptionAPI.createSubscriptionOption(cslId, input);
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
    dataSources: { subscriptionOptionAPI, clubSportLocationAPI, clubAPI },
  }: ContextWithDataSources,
): Promise<SubscriptionOption> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    const subscriptionOption =
      await subscriptionOptionAPI.findSubscriptionOptionById(id);
    const csl = await clubSportLocationAPI.findClubSportLocationById(
      subscriptionOption.clubSportLocation,
    );
    const club = await clubAPI.findClubById(csl.club.toString());
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
    dataSources: { subscriptionOptionAPI, clubSportLocationAPI, clubAPI },
  }: ContextWithDataSources,
): Promise<SubscriptionOption> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    const subscriptionOption =
      await subscriptionOptionAPI.findSubscriptionOptionById(id);
    const csl = await clubSportLocationAPI.findClubSportLocationById(
      subscriptionOption.clubSportLocation,
    );
    const club = await clubAPI.findClubById(csl.club.toString());
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
