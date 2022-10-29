import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { User } from '../generated/graphql';

export type UserWithPasswordHash = User & {
  passwordHash: string;
};

export function userToRecord(
  user: User,
  passwordHash: string,
): Record<string, AttributeValue> {
  return {
    UserId: { S: user.id },
    UserEmail: { S: user.email },
    UserPasswordHash: { S: passwordHash },
  };
}

export function parseUser(item: Record<string, AttributeValue>): User {
  return {
    id: item.UserId.S,
    email: item.UserEmail.S,
  };
}

export function parseUserWithPasswordHard(
  item: Record<string, AttributeValue>,
): UserWithPasswordHash {
  return {
    id: item.UserId.S,
    email: item.UserEmail.S,
    passwordHash: item.UserPasswordHash.S,
  };
}
