import { v4 as uuidv4 } from 'uuid';
import { ContextWithDataSources } from '../datasources';
import {
  QueryListSubscriptionsBySubscriptionOptionArgs,
  SubscriptionPageInfo,
  MutationCreateSubscriptionArgs,
  Subscription,
  QueryListSubscriptionsBySiteArgs,
  QueryGetSubscriptionArgs,
  QueryGetSubscriptionFilesArgs,
  FormEntryKind,
  SubscriptionFile,
} from '../generated/graphql';
import { logger } from '../logger';
import { isUserAuthorized } from '../utils/club';
import {
  generateOwnerSubscriptionEmail,
  generateUserSubscriptionEmail,
} from '../utils/subscription';

export async function getSubscription(
  _parent: unknown,
  { siteId, subscriptionOptionId, id }: QueryGetSubscriptionArgs,
  {
    user,
    dataSources: { subscriptionAPI, subscriptionOptionAPI, siteAPI, clubAPI },
  }: ContextWithDataSources,
): Promise<Subscription> {
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
    const club = await clubAPI.findClubById(site.club.id);
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }
    return await subscriptionAPI.findSubscriptionById(
      siteId,
      subscriptionOptionId,
      id,
    );
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function getSubscriptionFiles(
  _parent: unknown,
  { siteId, subscriptionOptionId, id }: QueryGetSubscriptionFilesArgs,
  {
    user,
    dataSources: {
      subscriptionAPI,
      subscriptionOptionAPI,
      siteAPI,
      clubAPI,
      fileUploadAPI,
    },
  }: ContextWithDataSources,
): Promise<SubscriptionFile[]> {
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
    const club = await clubAPI.findClubById(site.club.id);
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }
    const subscription = await subscriptionAPI.findSubscriptionById(
      siteId,
      subscriptionOptionId,
      id,
    );
    const fileFormEntriesIndexes = subscriptionOption.formEntries.reduce(
      (acc, entry, i) =>
        entry.kind === FormEntryKind.File ? [...acc, i] : acc,
      [] as number[],
    );
    const fileUploadResponses = await Promise.all(
      fileFormEntriesIndexes.map(async (index) => {
        try {
          const fileId =
            subscription.subscriberDetails.formEntriesValues[index];
          return Promise.resolve({
            formEntryIndex: index,
            fileUpload: {
              file: await fileUploadAPI.findFileUploadById(fileId),
              url: await fileUploadAPI.generateFileUrlGet(fileId),
            },
          });
        } catch (e) {
          return Promise.reject(e);
        }
      }),
    );
    return Promise.resolve(fileUploadResponses);
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
    const club = await clubAPI.findClubById(site.club.id);
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
    const club = await clubAPI.findClubById(site.club.id);
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
      emailAPI,
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
    const club = await clubAPI.findClubById(site.club.id);
    const owner = await userAPI.findUserById(club.owner);
    logger.info(
      `Sending email to club owner ${owner.email} and customer ${details.email}`,
    );
    const ownerEmail = generateOwnerSubscriptionEmail(subscription, club.id);
    const qrCodeContentId = uuidv4();
    const [userEmail, qrCodeBase64] = await generateUserSubscriptionEmail(
      subscription,
      club.id,
      qrCodeContentId,
    );
    console.log(ownerEmail, userEmail);

    const ownerEmailId = await emailAPI.sendEmail(owner.email, ownerEmail);
    logger.info(`Email sent to club owner (message id = ${ownerEmailId})`);
    const userEmailId = await emailAPI.sendEmailWithPng(
      details.email,
      userEmail,
      {
        name: `subscription_${site.id}`,
        contentId: qrCodeContentId,
        base64: qrCodeBase64,
      },
    );
    logger.info(`Email sent to user (message id = ${userEmailId})`);
    return subscription;
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}
