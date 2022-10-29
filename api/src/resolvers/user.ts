import bcrypt from 'bcrypt';
import {
  MutationSignUpArgs,
  MutationSignInArgs,
  User,
} from '../generated/graphql';
import { logger } from '../logger';
import { ContextWithDataSources } from '../datasources';
import { validate as validateEmail } from 'email-validator';

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
  { dataSources: { userAPI } }: ContextWithDataSources,
): Promise<string> {
  try {
    if (!validateEmail(email)) {
      return Promise.reject('Invalid email');
    }

    logger.info(`Creating user with email ${email}`);
    const passwordHash = await hashPassword(password);
    // use cognito for sign up ...
    const newUser = await userAPI.insertUser(email, passwordHash);
    logger.info(`New user successfully created (id = ${newUser.id})`);
    return userAPI.generateToken(newUser);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}
