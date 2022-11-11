import { AttributeValue } from '@aws-sdk/client-dynamodb';
import capitalize from 'lodash/capitalize';
import { User } from '../generated/graphql';
import { APP_DOMAIN, EmailContent } from './email';

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
    IsPro: { BOOL: user.isPro },
    IsVerified: { BOOL: user.isVerified },
    UserPasswordHash: { S: passwordHash },
  };
}

export function parseUser(item: Record<string, AttributeValue>): User {
  return {
    id: item.UserId.S,
    email: item.UserEmail.S,
    isPro: item.IsPro.BOOL,
    isVerified: item.IsVerified.BOOL,
  };
}

export function parseUserWithPasswordHard(
  item: Record<string, AttributeValue>,
): UserWithPasswordHash {
  return {
    id: item.UserId.S,
    email: item.UserEmail.S,
    isPro: item.IsPro.BOOL,
    isVerified: item.IsVerified.BOOL,
    passwordHash: item.UserPasswordHash.S,
  };
}

export function generateVerificationEmail(userIdHash: string): EmailContent {
  const link = `https://www.${APP_DOMAIN}/verify?token=${userIdHash}`;
  return {
    subject: `Verify your email on ${APP_DOMAIN}`,
    html: `\
    <html>
      <body>
        <div style="margin-bottom: 20px">
          <h3>Welcome to ${capitalize(APP_DOMAIN)} !</h5>
        </div>
        <div>Click <a href="${link}">here</a> to verify your account.</div>
      </body>
    </html>`,
  };
}
