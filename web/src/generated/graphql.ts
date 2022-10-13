export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Activity = {
  __typename?: 'Activity';
  description: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
  name: Scalars['String'];
};

export type ActivityInput = {
  description: Scalars['String'];
  icon?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type CalendarSpan = {
  __typename?: 'CalendarSpan';
  day: Scalars['Int'];
  fromMinute: Scalars['Int'];
  title: Scalars['String'];
  toMinute: Scalars['Int'];
};

export type CalendarSpanInput = {
  day: Scalars['Int'];
  fromMinute: Scalars['Int'];
  title: Scalars['String'];
  toMinute: Scalars['Int'];
};

export type Club = {
  __typename?: 'Club';
  id?: Maybe<Scalars['ID']>;
  logo?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  owner: Scalars['String'];
};

export type ClubPageInfo = {
  __typename?: 'ClubPageInfo';
  clubs: Array<Club>;
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
};

export type ClubSportLocation = {
  __typename?: 'ClubSportLocation';
  activities: Array<Activity>;
  address: Scalars['String'];
  club: Club;
  description: Scalars['String'];
  id?: Maybe<Scalars['ID']>;
  images: Array<Scalars['String']>;
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  name: Scalars['String'];
  phone: Scalars['String'];
  schedule: Array<CalendarSpan>;
  sport: Sport;
  trainers: Array<Trainer>;
  website?: Maybe<Scalars['String']>;
};

export type ClubSportLocationInput = {
  activities: Array<ActivityInput>;
  address: Scalars['String'];
  description: Scalars['String'];
  images: Array<Scalars['String']>;
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  name: Scalars['String'];
  phone: Scalars['String'];
  schedule: Array<CalendarSpanInput>;
  sportId: Scalars['ID'];
  trainerIds: Array<Scalars['ID']>;
  website?: InputMaybe<Scalars['String']>;
};

export type ClubSportLocationPageInfo = {
  __typename?: 'ClubSportLocationPageInfo';
  clubSportLocations: Array<ClubSportLocation>;
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
};

export type ClubSportLocationSearchQueryInput = {
  address?: InputMaybe<Scalars['String']>;
  area?: InputMaybe<SearchArea>;
  sport: Scalars['ID'];
};

export type Event = {
  __typename?: 'Event';
  clubSportLocation: Scalars['String'];
  dateRFC3339: Scalars['String'];
  description: Scalars['String'];
  id?: Maybe<Scalars['ID']>;
  image?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type EventInput = {
  dateRFC3339: Scalars['String'];
  description: Scalars['String'];
  image?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};

export type EventPageInfo = {
  __typename?: 'EventPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  events: Array<Event>;
  hasNextPage: Scalars['Boolean'];
};

export enum Gender {
  Female = 'Female',
  Male = 'Male',
  Other = 'Other'
}

export type Mutation = {
  __typename?: 'Mutation';
  createClub: Club;
  createClubSportLocation?: Maybe<ClubSportLocation>;
  createEvent: Event;
  createSubscription: Subscription;
  createSubscriptionOption: SubscriptionOption;
  createTrainer: Trainer;
  deleteClub: Scalars['Boolean'];
  deleteClubSportLocation: Scalars['Boolean'];
  deleteEvent: Scalars['Boolean'];
  deleteTrainer: Scalars['Boolean'];
  disableSubscriptionOption: SubscriptionOption;
  enableSubscriptionOption: SubscriptionOption;
  signIn: Scalars['String'];
  signUp: Scalars['String'];
};


export type MutationCreateClubArgs = {
  name: Scalars['String'];
};


export type MutationCreateClubSportLocationArgs = {
  clubId: Scalars['ID'];
  input: ClubSportLocationInput;
};


export type MutationCreateEventArgs = {
  cslId: Scalars['ID'];
  input: EventInput;
};


export type MutationCreateSubscriptionArgs = {
  details: SubscriberDetailsInput;
  subscriptionOptionId: Scalars['ID'];
};


export type MutationCreateSubscriptionOptionArgs = {
  cslId: Scalars['ID'];
  input: SubscriptionOptionInput;
};


export type MutationCreateTrainerArgs = {
  clubId: Scalars['ID'];
  input: TrainerInput;
};


export type MutationDeleteClubArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteClubSportLocationArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteEventArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteTrainerArgs = {
  id: Scalars['ID'];
};


export type MutationDisableSubscriptionOptionArgs = {
  id: Scalars['ID'];
};


export type MutationEnableSubscriptionOptionArgs = {
  id: Scalars['ID'];
};


export type MutationSignInArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSignUpArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getClub: Club;
  getClubSportLocation: ClubSportLocation;
  getEvent: Event;
  getSubscription: Subscription;
  getSubscriptionOption: SubscriptionOption;
  listClubSportLocationEvents: EventPageInfo;
  listClubSportLocations: ClubSportLocationPageInfo;
  listClubSportLocationsByClub: ClubSportLocationPageInfo;
  listClubs: ClubPageInfo;
  listEnabledSubscriptionOptionsByClubSportLocation: SubscriptionOptionPageInfo;
  listSports: SportPageInfo;
  listSubscriptionOptionsByClubSportLocation: SubscriptionOptionPageInfo;
  listSubscriptionsByClubSportLocation: SubscriptionPageInfo;
  listSubscriptionsBySubscriptionOption: SubscriptionPageInfo;
  listTrainersByClub: TrainerPageInfo;
  listUserClubs: ClubPageInfo;
  me: User;
  searchClubSportLocations: ClubSportLocationPageInfo;
};


export type QueryGetClubArgs = {
  id: Scalars['ID'];
};


export type QueryGetClubSportLocationArgs = {
  id: Scalars['ID'];
};


export type QueryGetEventArgs = {
  id: Scalars['ID'];
};


export type QueryGetSubscriptionArgs = {
  id: Scalars['ID'];
};


export type QueryGetSubscriptionOptionArgs = {
  id: Scalars['ID'];
};


export type QueryListClubSportLocationEventsArgs = {
  after?: InputMaybe<Scalars['String']>;
  cslId: Scalars['ID'];
  first: Scalars['Int'];
};


export type QueryListClubSportLocationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
};


export type QueryListClubSportLocationsByClubArgs = {
  after?: InputMaybe<Scalars['String']>;
  clubId: Scalars['ID'];
  first: Scalars['Int'];
};


export type QueryListClubsArgs = {
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
};


export type QueryListEnabledSubscriptionOptionsByClubSportLocationArgs = {
  after?: InputMaybe<Scalars['String']>;
  cslId: Scalars['ID'];
  first: Scalars['Int'];
};


export type QueryListSportsArgs = {
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
};


export type QueryListSubscriptionOptionsByClubSportLocationArgs = {
  after?: InputMaybe<Scalars['String']>;
  cslId: Scalars['ID'];
  first: Scalars['Int'];
};


export type QueryListSubscriptionsByClubSportLocationArgs = {
  after?: InputMaybe<Scalars['String']>;
  cslId: Scalars['ID'];
  first: Scalars['Int'];
};


export type QueryListSubscriptionsBySubscriptionOptionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
  subscriptionOptionId: Scalars['ID'];
};


export type QueryListTrainersByClubArgs = {
  after?: InputMaybe<Scalars['String']>;
  clubId: Scalars['ID'];
  first: Scalars['Int'];
};


export type QueryListUserClubsArgs = {
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
};


export type QuerySearchClubSportLocationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
  query: ClubSportLocationSearchQueryInput;
};

export type SearchArea = {
  bottomRightLat: Scalars['Float'];
  bottomRightLon: Scalars['Float'];
  topLeftLat: Scalars['Float'];
  topLeftLon: Scalars['Float'];
};

export type Sport = {
  __typename?: 'Sport';
  description: Scalars['String'];
  id?: Maybe<Scalars['ID']>;
  tags: Array<Scalars['String']>;
  title: Scalars['String'];
};

export type SportPageInfo = {
  __typename?: 'SportPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  sports: Array<Sport>;
};

export type SubscriberDetails = {
  __typename?: 'SubscriberDetails';
  address: Scalars['String'];
  dateOfBirth: Scalars['String'];
  email: Scalars['String'];
  firstname: Scalars['String'];
  gender: Gender;
  lastname: Scalars['String'];
  phone: Scalars['String'];
};

export type SubscriberDetailsInput = {
  address: Scalars['String'];
  dateOfBirth: Scalars['String'];
  email: Scalars['String'];
  firstname: Scalars['String'];
  gender: Gender;
  lastname: Scalars['String'];
  phone: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  clubSportLocation: Scalars['String'];
  createdAtRFC3339: Scalars['String'];
  id?: Maybe<Scalars['ID']>;
  subscriberDetails: SubscriberDetails;
  subscriptionOption: SubscriptionOption;
};

export type SubscriptionOption = {
  __typename?: 'SubscriptionOption';
  clubSportLocation: Scalars['String'];
  enabled: Scalars['Boolean'];
  features: Array<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  price: Scalars['Float'];
  title: Scalars['String'];
};

export type SubscriptionOptionInput = {
  features: Array<Scalars['String']>;
  price: Scalars['Float'];
  title: Scalars['String'];
};

export type SubscriptionOptionPageInfo = {
  __typename?: 'SubscriptionOptionPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  subscriptionOptions: Array<SubscriptionOption>;
};

export type SubscriptionPageInfo = {
  __typename?: 'SubscriptionPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  subscriptions: Array<Subscription>;
};

export type Trainer = {
  __typename?: 'Trainer';
  club?: Maybe<Club>;
  description: Scalars['String'];
  displayname: Scalars['String'];
  firstname: Scalars['String'];
  id?: Maybe<Scalars['ID']>;
  lastname: Scalars['String'];
  photo?: Maybe<Scalars['String']>;
};

export type TrainerInput = {
  description: Scalars['String'];
  displayname: Scalars['String'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  photo?: InputMaybe<Scalars['String']>;
};

export type TrainerPageInfo = {
  __typename?: 'TrainerPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  trainers: Array<Trainer>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  id?: Maybe<Scalars['ID']>;
};
