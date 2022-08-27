import { Context } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express';
import UserAPI from '../datasources/user';
import { User } from '../generated/graphql';
import { dbUserToUser } from '../utils/user';

export type AuthenticationContext = {
  user?: User;
};

const UNPRIVILEGED_EDNPOINTS = [
  'IntrospectionQuery',
  'signUp',
  'signIn',
  'listSports',
  'listClubs',
];

const authenticationMiddleware =
  (userAPI: UserAPI) =>
  async ({ req }: ExpressContext): Promise<Context<AuthenticationContext>> => {
    try {
      const { operationName } = req.body;
      if (UNPRIVILEGED_EDNPOINTS.includes(operationName)) {
        return Promise.resolve({});
      }
      const authoriaztionSplit = req.headers.authorization?.split(' ');
      if (!authoriaztionSplit || authoriaztionSplit.length !== 2) {
        return Promise.reject({ message: 'Unauthorized' });
      }
      const token = authoriaztionSplit[1];
      const user = await userAPI.verifyToken(token);
      return Promise.resolve({ user: dbUserToUser(user) });
    } catch (e) {
      return Promise.reject({ message: 'Unauthorized' });
    }
  };

export default authenticationMiddleware;
