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
  listClubSportLocations,
  listClubSportLocationsByClub,
  searchClubSportLocations,
  createClubSportLocation,
  deleteClubSportLocation,
} from './clubSportLocation';
import { getEvent, listClubSportLocationEvents } from './event';
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

const resolvers: Resolvers = {
  Query: {
    me,
    listSports,
    getClub,
    listClubs,
    listUserClubs,
    getClubSportLocation,
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
  },
};

export default resolvers;
