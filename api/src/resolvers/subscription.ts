import { ContextWithDataSources } from '../datasources';
import {
  QueryListSubscriptionsBySubscriptionOptionArgs,
  SubscriptionPageInfo,
  MutationCreateSubscriptionArgs,
  Subscription,
} from '../generated/graphql';
import { logger } from '../logger';
import { dbSubscriptionToSubscription } from '../utils/subscription';

export async function listSubscriptionsBySubscriptionOption(
  _parent: unknown,
  {
    subscriptionOptionId,
    first,
    after,
  }: QueryListSubscriptionsBySubscriptionOptionArgs,
  {
    dataSources: { subscriptionAPI, subscriptionOptionAPI },
  }: ContextWithDataSources,
): Promise<SubscriptionPageInfo> {
  try {
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
      subscriptions.map(async (subscription) => {
        const subscriptionOption =
          await subscriptionOptionAPI.findSubscriptionOptionById(
            subscription.subscriptionOption.toString(),
          );
        return await dbSubscriptionToSubscription(
          subscription,
          subscriptionOption,
        );
      }),
    );
    return {
      subscriptions: fullSubscriptions,
      hasNextPage,
      endCursor,
    };
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function createSubscription(
  _parent: unknown,
  { subcriptionOption, details }: MutationCreateSubscriptionArgs,
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
    const subscription = await subscriptionAPI.createSubscription(
      subcriptionOption,
      details,
    );
    const subscriptionOption =
      await subscriptionOptionAPI.findSubscriptionOptionById(
        subscription.subscriptionOption.toString(),
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
    return Promise.reject(e);
  }
}
