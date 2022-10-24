import { Resolvers } from '../generated/graphql';
import {
  listClubs,
  listUserClubs,
  getClub,
  createClub,
  deleteClub,
} from './club';
import {
  getSite,
  getSiteImages,
  listSites,
  listSitesByClub,
  searchSites,
  createSite,
  deleteSite,
} from './site';
import { getEvent, listSiteEvents, createEvent, deleteEvent } from './event';
import { listSports } from './sport';
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
    listClubs,
    listUserClubs,
    getSite,
    getSiteImages,
    listSites,
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
  },
};

export default resolvers;
