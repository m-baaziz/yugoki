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

export type CalendarSpan = {
  __typename?: 'CalendarSpan';
  fromDay: Scalars['Int'];
  fromTime: Scalars['String'];
  title: Scalars['String'];
  toDay: Scalars['Int'];
  toTime: Scalars['String'];
};

export type Club = {
  __typename?: 'Club';
  id?: Maybe<Scalars['ID']>;
  logo?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  subtitle: Scalars['String'];
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
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  phone: Scalars['String'];
  schedule: Array<CalendarSpan>;
  sport: Sport;
  trainers: Array<Trainer>;
  website?: Maybe<Scalars['String']>;
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
};

export type EventPageInfo = {
  __typename?: 'EventPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  events: Array<Event>;
  hasNextPage: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  signIn: Scalars['String'];
  signUp: Scalars['String'];
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
  listClubSportLocationEvents: EventPageInfo;
  listClubSportLocations: ClubSportLocationPageInfo;
  listClubs: ClubPageInfo;
  listSports: SportPageInfo;
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


export type QueryListClubSportLocationEventsArgs = {
  after?: InputMaybe<Scalars['String']>;
  cslId: Scalars['ID'];
  first: Scalars['Int'];
};


export type QueryListClubSportLocationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
};


export type QueryListClubsArgs = {
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
};


export type QueryListSportsArgs = {
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

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  id?: Maybe<Scalars['ID']>;
};
