import { ContextWithDataSources } from '../datasources';
import {
  MutationCreateSubscriptionOptionArgs,
  QueryListSubscriptionOptionsByClubSportLocationArgs,
  SubscriptionOptionPageInfo,
  SubscriptionOption,
} from '../generated/graphql';
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
    return Promise.reject(e);
  }
}

export async function createSubscriptionOption(
  _parent: unknown,
  { cslId, input }: MutationCreateSubscriptionOptionArgs,
  { dataSources: { subscriptionOptionAPI } }: ContextWithDataSources,
): Promise<SubscriptionOption> {
  try {
    const subscriptionOption =
      await subscriptionOptionAPI.createSubscriptionOption(cslId, input);
    return dbSubscriptionOptionToSubscriptionOption(subscriptionOption);
  } catch (e) {
    return Promise.reject(e);
  }
}
