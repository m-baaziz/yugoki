import { Resolvers } from '../generated/graphql';
import { listClubs, getClub } from './club';
import {
  getClubSportLocation,
  listClubSportLocations,
  searchClubSportLocations,
} from './clubSportLocation';
import { listSports } from './sport';
import { signIn, signUp, me } from './user';

const resolvers: Resolvers = {
  Query: {
    me,
    listSports,
    getClub,
    listClubs,
    getClubSportLocation,
    listClubSportLocations,
    searchClubSportLocations,
  },
  Mutation: {
    signIn,
    signUp,
  },
};

export default resolvers;
