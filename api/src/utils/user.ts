import { User, UserDbObject } from '../generated/graphql';

export function dbUserToUser(user: UserDbObject): User {
  const { _id, email } = user;
  return {
    id: _id.toString(),
    email,
  };
}
