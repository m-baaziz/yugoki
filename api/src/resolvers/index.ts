import { Resolvers } from '../generated/graphql';
import { listUserClubs, getClub, createClub, deleteClub } from './club';
import {
  getSite,
  getSiteImages,
  listSitesByClub,
  searchSites,
  createSite,
  deleteSite,
} from './site';
import { getEvent, listSiteEvents, createEvent, deleteEvent } from './event';
import { listSports, createSport, deleteSport } from './sport';
import { signIn, signUp, me } from './user';
import {
  getSubscriptionOption,
  listSubscriptionOptionsBySite,
  listEnabledSubscriptionOptionsBySite,
  createSubscriptionOption,
  enableSubscriptionOption,
  disableSubscriptionOption,
} from './subscriptionOption';
import {
  getSubscription,
  listSubscriptionsBySubscriptionOption,
  listSubscriptionsBySite,
  createSubscription,
} from './subscription';
import { listTrainersByClub, createTrainer, deleteTrainer } from './trainer';
import { getFileUpload, createFileUpload } from './fileUpload';

const resolvers: Resolvers = {
  Query: {
    me,
    listSports,
    getClub,
    listUserClubs,
    getSite,
    getSiteImages,
    listSitesByClub,
    searchSites,
    getEvent,
    listSiteEvents,
    getSubscriptionOption,
    listSubscriptionOptionsBySite,
    listEnabledSubscriptionOptionsBySite,
    listSubscriptionsBySubscriptionOption,
    listSubscriptionsBySite,
    getSubscription,
    listTrainersByClub,
    getFileUpload,
  },
  Mutation: {
    signIn,
    signUp,
    createClub,
    deleteClub,
    createTrainer,
    deleteTrainer,
    createSite,
    deleteSite,
    createSubscriptionOption,
    enableSubscriptionOption,
    disableSubscriptionOption,
    createSubscription,
    createEvent,
    deleteEvent,
    createFileUpload,
    createSport,
    deleteSport,
  },
};

export default resolvers;
