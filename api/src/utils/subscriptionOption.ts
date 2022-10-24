import {
  SubscriptionOption,
  SubscriptionOptionDbObject,
} from '../generated/graphql';

export function dbSubscriptionOptionToSubscriptionOption(
  subscriptionOption: SubscriptionOptionDbObject,
): SubscriptionOption {
  const { _id, site, title, features, price, enabled } = subscriptionOption;
  return {
    id: _id.toString(),
    site,
    title,
    features,
    price,
    enabled,
  };
}
