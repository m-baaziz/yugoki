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
  listSubscriptionOptionsByClubSportLocation,
  createSubscriptionOption,
} from './subscriptionOption';
import {
  listSubscriptionsBySubscriptionOption,
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
    listSubscriptionOptionsByClubSportLocation,
    listSubscriptionsBySubscriptionOption,
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
    createSubscription,
  },
};

export default resolvers;
