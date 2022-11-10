import { AttributeValue } from '@aws-sdk/client-dynamodb';
import QRCode from 'qrcode';
import { APP_DOMAIN, EmailContent } from '../datasources/email';
import { Gender, SubscriberDetails, Subscription } from '../generated/graphql';
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
    createdAtRFC3339: item.SubscriptionDate.S,
    subscriberDetails: parseSubscriberDetails(item.SubscriberDetails.M),
  };
}

export function subscriptionToRecord(
  subscription: Subscription,
): Record<string, AttributeValue> {
  return {
    SubscriptionOptionId: { S: subscription.subscriptionOption.id },
    SubscriptionId: { S: subscription.id },
    SubscriptionDate: { S: subscription.createdAtRFC3339 },
    SubscriberDetails: {
      M: subscriberDetailsToRecord(subscription.subscriberDetails),
    },
    SubscriptionOption: {
      M: subscriptionOptionToRecord(subscription.subscriptionOption),
    },
  };
}

export function generateOwnerSubscriptionEmail(
  subscription: Subscription,
  clubId: string,
): EmailContent {
  const { firstname, lastname } = subscription.subscriberDetails;
  const {
    title,
    price,
    id: subscriptionOptionId,
    site: siteId,
  } = subscription.subscriptionOption;
  const link = `https://www.${APP_DOMAIN}/profile/clubs/${clubId}/sites/${siteId}/subscriptions/options/${subscriptionOptionId}/${subscription.id}`;
  return {
    subject: `${firstname} ${lastname} signed up for ${title}`,
    html: `\
    <html>
      <body>
        <div style="margin-bottom: 20px">${firstname} ${lastname} has signed up for ${title} at $ ${price}.</div>
        <div>You can view the details <a href="${link}">here</a>.</div>
      </body>
    </html>`,
  };
}

export async function generateUserSubscriptionEmail(
  subscription: Subscription,
  clubId: string,
): Promise<EmailContent> {
  const {
    title,
    price,
    id: subscriptionOptionId,
    site: siteId,
  } = subscription.subscriptionOption;
  const link = `https://www.${APP_DOMAIN}/profile/clubs/${clubId}/sites/${siteId}/subscriptions/options/${subscriptionOptionId}/${subscription.id}`;
  const qrcodeData = await QRCode.toDataURL(link);
  return {
    subject: `You signed up for ${title}`,
    html: `\
    <html>
      <body>
        <div style="margin-bottom: 10px">Congratualtions on signing up for ${title} at $ ${price}.</div>
        <div style="margin-bottom: 20px">Show this QR code to the club manager to share you subscription details.</div>
        <div style="display: flex">
          <div style="margin:auto"><img src="${qrcodeData}" width="200" height="200"/></div>
        </div>
      </body>
    </html>`,
  };
}
