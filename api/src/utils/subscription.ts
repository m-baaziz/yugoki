import { AttributeValue } from '@aws-sdk/client-dynamodb';
import {
  Gender,
  SubscriberDetails,
  Subscription,
  SubscriptionDbObject,
  SubscriptionOptionDbObject,
} from '../generated/graphql';
import {
  parseSubscriptionOption,
  subscriptionOptionToRecord,
} from './subscriptionOption';

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

export function parseSubscriberDetails(
  details: Record<string, AttributeValue>,
): SubscriberDetails {
  return {
    firstname: details.Firstname.S,
    lastname: details.Lastname.S,
    gender: parseGender(details.Gender.S),
    email: details.Email.S,
    address: details.Address.S,
    phone: details.Phone.S,
    dateOfBirth: details.DateOfBirth.S,
  };
}

export function subscriberDetailsToRecord(
  subscriberDetails: SubscriberDetails,
): Record<string, AttributeValue> {
  return {
    Firstname: { S: subscriberDetails.firstname },
    Lastname: { S: subscriberDetails.lastname },
    Gender: { S: subscriberDetails.gender },
    Email: { S: subscriberDetails.email },
    Address: { S: subscriberDetails.address },
    Phone: { S: subscriberDetails.phone },
    DateOfBirth: { S: subscriberDetails.dateOfBirth },
  };
}

export function parseSubscription(
  item: Record<string, AttributeValue>,
): Subscription {
  return {
    id: item.SubscriptionId.S,
    site: item.SiteId.S,
    subscriptionOption: parseSubscriptionOption(item.SubscriptionOption.M),
    createdAtRFC3339: item.Date.S,
    subscriberDetails: parseSubscriberDetails(item.SubscriberDetails.M),
  };
}

export function subscriptionToRecord(
  subscription: Subscription,
): Record<string, AttributeValue> {
  return {
    SubscriptionOptionId: { S: subscription.subscriptionOption.id },
    SubscriptionId: { S: subscription.id },
    Date: { S: subscription.createdAtRFC3339 },
    SubscriberDetails: {
      M: subscriberDetailsToRecord(subscription.subscriberDetails),
    },
    SubscriptionOption: {
      M: subscriptionOptionToRecord(subscription.subscriptionOption),
    },
  };
}
