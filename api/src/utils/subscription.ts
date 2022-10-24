import {
  Gender,
  Subscription,
  SubscriptionDbObject,
  SubscriptionOptionDbObject,
} from '../generated/graphql';

export function parseGender(gender: string): Gender | null {
  if (gender === 'Male') return Gender.Male;
  if (gender === 'Female') return Gender.Female;
  if (gender === 'Other') return Gender.Other;
  return null;
}

export function dbSubscriptionToSubscription(
  subscription: SubscriptionDbObject,
  subscriptionOption: SubscriptionOptionDbObject,
): Promise<Subscription> {
  const { _id, site, subscriberDetails, createdAtRFC3339 } = subscription;
  const gender = parseGender(subscriberDetails.gender);
  if (gender === null) return Promise.reject('Invalid gender');
  return Promise.resolve({
    id: _id.toString(),
    subscriptionOption,
    site,
    subscriberDetails: { ...subscriberDetails, gender },
    createdAtRFC3339,
  });
}
