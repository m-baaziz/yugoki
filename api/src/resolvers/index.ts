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
import { signIn, signUp, verify, me } from './user';
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
import {
  listSiteChatRooms,
  listUserSiteChatRooms,
  createSiteChatRoom,
  deleteSiteChatRoom,
} from './siteChatRoom';
import {
  listSiteChatMessages,
  createSiteChatMessage,
  createSiteChatRoomAndMessage,
  deleteSiteChatMessage,
} from './siteChatMessage';

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
    listSiteChatRooms,
    listUserSiteChatRooms,
    listSiteChatMessages,
  },
  Mutation: {
    signIn,
    signUp,
    verify,
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
    createSiteChatRoom,
    deleteSiteChatRoom,
    createSiteChatMessage,
    createSiteChatRoomAndMessage,
    deleteSiteChatMessage,
  },
};

export default resolvers;
