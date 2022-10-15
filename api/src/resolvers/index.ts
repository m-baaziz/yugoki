import { Resolvers } from '../generated/graphql';
import {
  listClubs,
  listUserClubs,
  getClub,
  createClub,
  deleteClub,
} from './club';
import {
  getClubSportLocation,
  getClubSportLocationImages,
  listClubSportLocations,
  listClubSportLocationsByClub,
  searchClubSportLocations,
  createClubSportLocation,
  deleteClubSportLocation,
} from './clubSportLocation';
import {
  getEvent,
  listClubSportLocationEvents,
  createEvent,
  deleteEvent,
} from './event';
import { listSports } from './sport';
import { signIn, signUp, me } from './user';
import {
  getSubscriptionOption,
  listSubscriptionOptionsByClubSportLocation,
  listEnabledSubscriptionOptionsByClubSportLocation,
  createSubscriptionOption,
  enableSubscriptionOption,
  disableSubscriptionOption,
} from './subscriptionOption';
import {
  getSubscription,
  listSubscriptionsBySubscriptionOption,
  listSubscriptionsByClubSportLocation,
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
    getClubSportLocation,
    getClubSportLocationImages,
    listClubSportLocations,
    listClubSportLocationsByClub,
    searchClubSportLocations,
    getEvent,
    listClubSportLocationEvents,
    getSubscriptionOption,
    listSubscriptionOptionsByClubSportLocation,
    listEnabledSubscriptionOptionsByClubSportLocation,
    listSubscriptionsBySubscriptionOption,
    listSubscriptionsByClubSportLocation,
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
    createClubSportLocation,
    deleteClubSportLocation,
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
