import { ContextWithDataSources } from '../datasources';
import {
  QueryListSubscriptionsBySubscriptionOptionArgs,
  SubscriptionPageInfo,
  MutationCreateSubscriptionArgs,
  Subscription,
  QueryListSubscriptionsByClubSportLocationArgs,
  QueryGetSubscriptionArgs,
} from '../generated/graphql';
import { logger } from '../logger';
import { isUserAuthorized } from '../utils/club';
import { dbSubscriptionToSubscription } from '../utils/subscription';

export async function getSubscription(
  _parent: unknown,
  { id }: QueryGetSubscriptionArgs,
  {
    user,
    dataSources: {
      subscriptionAPI,
      subscriptionOptionAPI,
      clubSportLocationAPI,
      clubAPI,
    },
  }: ContextWithDataSources,
): Promise<Subscription> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    const subscription = await subscriptionAPI.findSubscriptionById(id);
    const subscriptionOption =
      await subscriptionOptionAPI.findSubscriptionOptionById(
        subscription.subscriptionOption.toString(),
      );
    const csl = await clubSportLocationAPI.findClubSportLocationById(
      subscriptionOption.clubSportLocation,
    );
    const club = await clubAPI.findClubById(csl.club.toString());
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }

    return await dbSubscriptionToSubscription(subscription, subscriptionOption);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function listSubscriptionsBySubscriptionOption(
  _parent: unknown,
  {
    subscriptionOptionId,
    first,
    after,
  }: QueryListSubscriptionsBySubscriptionOptionArgs,
  {
    user,
    dataSources: {
      subscriptionAPI,
      subscriptionOptionAPI,
      clubSportLocationAPI,
      clubAPI,
    },
  }: ContextWithDataSources,
): Promise<SubscriptionPageInfo> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    const subscriptionOption =
      await subscriptionOptionAPI.findSubscriptionOptionById(
        subscriptionOptionId,
      );
    const csl = await clubSportLocationAPI.findClubSportLocationById(
      subscriptionOption.clubSportLocation,
    );
    const club = await clubAPI.findClubById(csl.club.toString());
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }
    const [subscriptions, hasNextPage] =
      await subscriptionAPI.listSubscriptionsBySubscriptionOption(
        subscriptionOptionId,
        first,
        after,
      );
    const endCursor =
      subscriptions.length > 0
        ? subscriptions[subscriptions.length - 1]._id.toString()
        : undefined;

    const fullSubscriptions = await Promise.all(
      subscriptions.map((subscription) =>
        dbSubscriptionToSubscription(subscription, subscriptionOption),
      ),
    );
    return {
      subscriptions: fullSubscriptions,
      hasNextPage,
      endCursor,
    };
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function listSubscriptionsByClubSportLocation(
  _parent: unknown,
  { cslId, first, after }: QueryListSubscriptionsByClubSportLocationArgs,
  {
    user,
    dataSources: {
      subscriptionAPI,
      subscriptionOptionAPI,
      clubSportLocationAPI,
      clubAPI,
    },
  }: ContextWithDataSources,
): Promise<SubscriptionPageInfo> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    const csl = await clubSportLocationAPI.findClubSportLocationById(cslId);
    const club = await clubAPI.findClubById(csl.club.toString());
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }
    const [subscriptions, hasNextPage] =
      await subscriptionAPI.listSubscriptionsByClubSportLocation(
        cslId,
        first,
        after,
      );
    const endCursor =
      subscriptions.length > 0
        ? subscriptions[subscriptions.length - 1]._id.toString()
        : undefined;

    const fullSubscriptions = await Promise.all(
      subscriptions.map(async (subscription) => {
        try {
          const subscriptionOption =
            await subscriptionOptionAPI.findSubscriptionOptionById(
              subscription.subscriptionOption.toString(),
            );
          return await dbSubscriptionToSubscription(
            subscription,
            subscriptionOption,
          );
        } catch (e) {
          return Promise.reject(e);
        }
      }),
    );
    return {
      subscriptions: fullSubscriptions,
      hasNextPage,
      endCursor,
    };
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function createSubscription(
  _parent: unknown,
  { subscriptionOptionId, details }: MutationCreateSubscriptionArgs,
  {
    dataSources: {
      subscriptionAPI,
      subscriptionOptionAPI,
      clubSportLocationAPI,
      clubAPI,
      userAPI,
    },
  }: ContextWithDataSources,
): Promise<Subscription> {
  try {
    const subscriptionOption =
      await subscriptionOptionAPI.findSubscriptionOptionById(
        subscriptionOptionId,
      );
    if (!subscriptionOption.enabled) {
      return Promise.reject(
        'Cannot subscribe to a disabled subscription option.',
      );
    }
    const subscription = await subscriptionAPI.createSubscription(
      subscriptionOptionId,
      details,
    );
    const clubSportLocation =
      await clubSportLocationAPI.findClubSportLocationById(
        subscriptionOption.clubSportLocation,
      );
    const club = await clubAPI.findClubById(clubSportLocation.club.toString());
    const owner = await userAPI.findUserById(club.owner);
    logger.info(
      `Sending email to club owner ${owner.email} and customer ${details.email}`,
    );
    // send emails
    return await dbSubscriptionToSubscription(subscription, subscriptionOption);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}
