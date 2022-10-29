import { Context } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express';
import UserAPI from '../datasources/user';
import { User } from '../generated/graphql';

export type AuthenticationContext = {
  user?: User;
};

const authenticationMiddleware =
  (userAPI: UserAPI) =>
  async ({ req }: ExpressContext): Promise<Context<AuthenticationContext>> => {
    try {
      const authoriaztionSplit = req.headers.authorization?.split(' ');
      if (!authoriaztionSplit || authoriaztionSplit.length !== 2) {
        return Promise.resolve({ user: undefined });
      }
      const token = authoriaztionSplit[1];
      const user = await userAPI.verifyToken(token);
      return Promise.resolve({ user });
    } catch (e) {
      return Promise.resolve({ user: undefined });
    }
  };

export default authenticationMiddleware;
