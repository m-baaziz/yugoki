import {
  SubscriptionOption,
  SubscriptionOptionDbObject,
} from '../generated/graphql';

export function dbSubscriptionOptionToSubscriptionOption(
  subscriptionOption: SubscriptionOptionDbObject,
): SubscriptionOption {
  const { _id, clubSportLocation, title, features, price, enabled } =
    subscriptionOption;
  return {
    id: _id.toString(),
    clubSportLocation,
    title,
    features,
    price,
    enabled,
  };
}
