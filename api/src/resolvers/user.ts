import bcrypt from 'bcryptjs';
import {
  MutationSignUpArgs,
  MutationSignInArgs,
  User,
  MutationVerifyArgs,
} from '../generated/graphql';
import { logger } from '../logger';
import { ContextWithDataSources } from '../datasources';
import { validate as validateEmail } from 'email-validator';
import { generateVerificationEmail } from '../utils/user';

const PWD_SALT_ROUNDS = 5;

async function hashPassword(clear: string): Promise<string> {
  return bcrypt.hash(clear, PWD_SALT_ROUNDS);
}

export async function signIn(
  _parent: unknown,
  { email: emailInput, password }: MutationSignInArgs,
  { dataSources: { userAPI } }: ContextWithDataSources,
): Promise<string> {
  logger.info(`User ${emailInput} signing in ...`);
  try {
    // use cognito for sign in ...
    const user = await userAPI.findUserByEmail(emailInput);
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return Promise.reject('Invalid credentials');
    }
    return userAPI.generateToken(user);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject('Invalid credentials');
  }
}

export async function me(
  _parent: unknown,
  _args: never,
  { user: me }: ContextWithDataSources,
): Promise<User> {
  return Promise.resolve(me);
}

export async function signUp(
  _parent: unknown,
  { email, password }: MutationSignUpArgs,
  { dataSources: { userAPI, emailAPI } }: ContextWithDataSources,
): Promise<string> {
  try {
    if (!validateEmail(email)) {
      return Promise.reject('Invalid email');
    }

    logger.info(`Creating user with email ${email}`);
    const passwordHash = await hashPassword(password);
    const newUser = await userAPI.insertUser(email, passwordHash);
    logger.info(`New user successfully created (id = ${newUser.id})`);
    const userIdHash = await hashPassword(newUser.id);
    const verificationEmail = generateVerificationEmail(userIdHash);
    logger.info(`Sending verification email to ${email}`);
    const emailId = await emailAPI.sendEmail(email, verificationEmail);
    logger.info(`Email sent to user (message id = ${emailId})`);
    return await userAPI.generateToken(newUser);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function verify(
  _parent: unknown,
  { token }: MutationVerifyArgs,
  { user, dataSources: { userAPI } }: ContextWithDataSources,
): Promise<User> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    const match = await bcrypt.compare(user.id, token);
    if (!match) {
      logger.error(
        `Failed to verify account ${user.email} (invalid id hash [token])`,
      );
      return Promise.reject('Unauthorized');
    }
    if (user.isVerified) return user;
    const done = await userAPI.verifyUser(user.id);
    return {
      ...user,
      isVerified: done ? true : user.isVerified,
    };
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject('Invalid credentials');
  }
}
