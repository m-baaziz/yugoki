import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { User, UserDbObject } from '../generated/graphql';

export type UserWithPasswordHash = User & {
  passwordHash: string;
};

export function dbUserToUser(user: UserDbObject): User {
  const { _id, email } = user;
  return {
    id: _id.toString(),
    email,
  };
}

export function userToRecord(user: User): Record<string, AttributeValue> {
  return {
    UserId: { S: user.id },
    UserEmail: { S: user.email },
  };
}

export function parseUser(item: Record<string, AttributeValue>): User {
  return {
    id: item.UserId.S,
    email: item.UserEmail.S,
  };
}
