import { Resolvers } from '../generated/graphql';
import { listClubs, getClub } from './club';
import { listSports } from './sport';
import { signIn, signUp, me } from './user';

const resolvers: Resolvers = {
  Query: {
    listClubs,
    getClub,
    listSports,
    me,
  },
  Mutation: {
    signIn,
    signUp,
  },
};

export default resolvers;
