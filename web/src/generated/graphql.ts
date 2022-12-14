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
  id: Scalars['ID'];
  logo?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  owner: Scalars['String'];
};

export type ClubInput = {
  logo?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type ClubPageInfo = {
  __typename?: 'ClubPageInfo';
  clubs: Array<Club>;
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
};

export type Event = {
  __typename?: 'Event';
  dateRFC3339: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['ID'];
  image?: Maybe<Scalars['String']>;
  site: Scalars['String'];
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

export type FileUpload = {
  __typename?: 'FileUpload';
  ext: Scalars['String'];
  id: Scalars['ID'];
  kind: FileUploadKind;
  size: Scalars['Int'];
};

export type FileUploadInput = {
  ext: Scalars['String'];
  kind: FileUploadKind;
  size: Scalars['Int'];
};

export enum FileUploadKind {
  ClubLogo = 'ClubLogo',
  EventImage = 'EventImage',
  SiteImage = 'SiteImage',
  SubscriptionFile = 'SubscriptionFile',
  TrainerPhoto = 'TrainerPhoto'
}

export type FileUploadResponse = {
  __typename?: 'FileUploadResponse';
  file: FileUpload;
  url?: Maybe<Scalars['String']>;
};

export type FormEntry = {
  __typename?: 'FormEntry';
  kind: FormEntryKind;
  label: Scalars['String'];
};

export type FormEntryInput = {
  kind: FormEntryKind;
  label: Scalars['String'];
};

export enum FormEntryKind {
  File = 'File',
  Text = 'Text'
}

export enum Gender {
  Female = 'Female',
  Male = 'Male',
  Other = 'Other'
}

export type Mutation = {
  __typename?: 'Mutation';
  createClub: Club;
  createEvent: Event;
  createFileUpload: FileUploadResponse;
  createSite?: Maybe<Site>;
  createSiteChatMessage: SiteChatMessage;
  createSiteChatRoom: SiteChatRoom;
  createSiteChatRoomAndMessage: SiteChatRoom;
  createSport: Sport;
  createSubscription: Subscription;
  createSubscriptionOption: SubscriptionOption;
  createTrainer: Trainer;
  deleteClub: Scalars['Boolean'];
  deleteEvent: Scalars['Boolean'];
  deleteSite: Scalars['Boolean'];
  deleteSiteChatMessage: Scalars['Boolean'];
  deleteSiteChatRoom: Scalars['Boolean'];
  deleteSport: Scalars['Boolean'];
  deleteTrainer: Scalars['Boolean'];
  disableSubscriptionOption: SubscriptionOption;
  enableSubscriptionOption: SubscriptionOption;
  signIn: Scalars['String'];
  signUp: Scalars['String'];
  verify: User;
};


export type MutationCreateClubArgs = {
  input: ClubInput;
};


export type MutationCreateEventArgs = {
  input: EventInput;
  siteId: Scalars['ID'];
};


export type MutationCreateFileUploadArgs = {
  input: FileUploadInput;
};


export type MutationCreateSiteArgs = {
  clubId: Scalars['ID'];
  input: SiteInput;
};


export type MutationCreateSiteChatMessageArgs = {
  roomId: Scalars['ID'];
  text: Scalars['String'];
};


export type MutationCreateSiteChatRoomArgs = {
  siteId: Scalars['ID'];
};


export type MutationCreateSiteChatRoomAndMessageArgs = {
  siteId: Scalars['ID'];
  text: Scalars['String'];
};


export type MutationCreateSportArgs = {
  input: SportInput;
};


export type MutationCreateSubscriptionArgs = {
  details: SubscriberDetailsInput;
  siteId: Scalars['ID'];
  subscriptionOptionId: Scalars['ID'];
};


export type MutationCreateSubscriptionOptionArgs = {
  input: SubscriptionOptionInput;
  siteId: Scalars['ID'];
};


export type MutationCreateTrainerArgs = {
  clubId: Scalars['ID'];
  input: TrainerInput;
};


export type MutationDeleteClubArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteEventArgs = {
  id: Scalars['ID'];
  siteId: Scalars['ID'];
};


export type MutationDeleteSiteArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteSiteChatMessageArgs = {
  id: Scalars['ID'];
  roomId: Scalars['ID'];
};


export type MutationDeleteSiteChatRoomArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteSportArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteTrainerArgs = {
  clubId: Scalars['ID'];
  id: Scalars['ID'];
};


export type MutationDisableSubscriptionOptionArgs = {
  id: Scalars['ID'];
  siteId: Scalars['ID'];
};


export type MutationEnableSubscriptionOptionArgs = {
  id: Scalars['ID'];
  siteId: Scalars['ID'];
};


export type MutationSignInArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSignUpArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationVerifyArgs = {
  token: Scalars['String'];
};

export type ProUserProfile = {
  __typename?: 'ProUserProfile';
  address: Scalars['String'];
  birthdate: Scalars['String'];
  firstname: Scalars['String'];
  iban: Scalars['String'];
  lastname: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getClub: Club;
  getEvent: Event;
  getFileUpload: FileUploadResponse;
  getSite: Site;
  getSiteImages: Array<FileUploadResponse>;
  getSubscription: Subscription;
  getSubscriptionFiles: Array<SubscriptionFile>;
  getSubscriptionOption: SubscriptionOption;
  listEnabledSubscriptionOptionsBySite: SubscriptionOptionPageInfo;
  listSiteChatMessages: SiteChatMessagePageInfo;
  listSiteChatRooms: SiteChatRoomPageInfo;
  listSiteEvents: EventPageInfo;
  listSitesByClub: SitePageInfo;
  listSports: SportPageInfo;
  listSubscriptionOptionsBySite: SubscriptionOptionPageInfo;
  listSubscriptionsBySite: SubscriptionPageInfo;
  listSubscriptionsBySubscriptionOption: SubscriptionPageInfo;
  listTrainersByClub: TrainerPageInfo;
  listUserClubs: ClubPageInfo;
  listUserSiteChatRooms: SiteChatRoomPageInfo;
  me: User;
  searchSites: SitePageInfo;
};


export type QueryGetClubArgs = {
  id: Scalars['ID'];
};


export type QueryGetEventArgs = {
  id: Scalars['ID'];
  siteId: Scalars['ID'];
};


export type QueryGetFileUploadArgs = {
  id: Scalars['ID'];
};


export type QueryGetSiteArgs = {
  id: Scalars['ID'];
};


export type QueryGetSiteImagesArgs = {
  id: Scalars['ID'];
};


export type QueryGetSubscriptionArgs = {
  id: Scalars['ID'];
  siteId: Scalars['ID'];
  subscriptionOptionId: Scalars['ID'];
};


export type QueryGetSubscriptionFilesArgs = {
  id: Scalars['ID'];
  siteId: Scalars['ID'];
  subscriptionOptionId: Scalars['ID'];
};


export type QueryGetSubscriptionOptionArgs = {
  id: Scalars['ID'];
  siteId: Scalars['ID'];
};


export type QueryListEnabledSubscriptionOptionsBySiteArgs = {
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
  siteId: Scalars['ID'];
};


export type QueryListSiteChatMessagesArgs = {
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
  roomId: Scalars['ID'];
};


export type QueryListSiteChatRoomsArgs = {
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
  siteId: Scalars['ID'];
};


export type QueryListSiteEventsArgs = {
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
  siteId: Scalars['ID'];
};


export type QueryListSitesByClubArgs = {
  after?: InputMaybe<Scalars['String']>;
  clubId: Scalars['ID'];
  first: Scalars['Int'];
};


export type QueryListSportsArgs = {
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
};


export type QueryListSubscriptionOptionsBySiteArgs = {
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
  siteId: Scalars['ID'];
};


export type QueryListSubscriptionsBySiteArgs = {
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
  siteId: Scalars['ID'];
};


export type QueryListSubscriptionsBySubscriptionOptionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
  siteId: Scalars['ID'];
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


export type QueryListUserSiteChatRoomsArgs = {
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
};


export type QuerySearchSitesArgs = {
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
  query: SiteSearchQueryInput;
};

export type SearchArea = {
  bottomRightLat: Scalars['Float'];
  bottomRightLon: Scalars['Float'];
  topLeftLat: Scalars['Float'];
  topLeftLon: Scalars['Float'];
};

export type Site = {
  __typename?: 'Site';
  activities: Array<Activity>;
  address: Scalars['String'];
  club: Club;
  description: Scalars['String'];
  id: Scalars['ID'];
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

export type SiteChatMessage = {
  __typename?: 'SiteChatMessage';
  dateRFC3339: Scalars['String'];
  from: Scalars['String'];
  id: Scalars['ID'];
  room: Scalars['String'];
  text: Scalars['String'];
};

export type SiteChatMessagePageInfo = {
  __typename?: 'SiteChatMessagePageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  siteChatMessages: Array<SiteChatMessage>;
};

export type SiteChatRoom = {
  __typename?: 'SiteChatRoom';
  createdAtRFC3339: Scalars['String'];
  id: Scalars['ID'];
  site: Site;
  user: User;
};

export type SiteChatRoomPageInfo = {
  __typename?: 'SiteChatRoomPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  siteChatRooms: Array<SiteChatRoom>;
};

export type SiteInput = {
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

export type SitePageInfo = {
  __typename?: 'SitePageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  sites: Array<Site>;
};

export type SiteSearchQueryInput = {
  address?: InputMaybe<Scalars['String']>;
  area?: InputMaybe<SearchArea>;
  sport: Scalars['ID'];
};

export type Sport = {
  __typename?: 'Sport';
  description: Scalars['String'];
  id: Scalars['ID'];
  tags: Array<Scalars['String']>;
  title: Scalars['String'];
};

export type SportInput = {
  description: Scalars['String'];
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
  formEntriesValues: Array<Scalars['String']>;
  gender: Gender;
  lastname: Scalars['String'];
  phone: Scalars['String'];
};

export type SubscriberDetailsInput = {
  address: Scalars['String'];
  dateOfBirth: Scalars['String'];
  email: Scalars['String'];
  firstname: Scalars['String'];
  formEntriesValues: Array<Scalars['String']>;
  gender: Gender;
  lastname: Scalars['String'];
  phone: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  createdAtRFC3339: Scalars['String'];
  id: Scalars['ID'];
  site: Scalars['String'];
  subscriberDetails: SubscriberDetails;
  subscriptionOption: SubscriptionOption;
};

export type SubscriptionFile = {
  __typename?: 'SubscriptionFile';
  fileUpload: FileUploadResponse;
  formEntryIndex: Scalars['Int'];
};

export type SubscriptionOption = {
  __typename?: 'SubscriptionOption';
  enabled: Scalars['Boolean'];
  features: Array<Scalars['String']>;
  formEntries: Array<FormEntry>;
  id: Scalars['ID'];
  price: Scalars['Float'];
  site: Scalars['String'];
  title: Scalars['String'];
};

export type SubscriptionOptionInput = {
  features: Array<Scalars['String']>;
  formEntries: Array<FormEntryInput>;
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
  club: Scalars['String'];
  description: Scalars['String'];
  displayname: Scalars['String'];
  firstname: Scalars['String'];
  id: Scalars['ID'];
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
  id: Scalars['ID'];
  isPro: Scalars['Boolean'];
  isVerified: Scalars['Boolean'];
};

export type UserProfile = {
  __typename?: 'UserProfile';
  address: Scalars['String'];
  birthdate: Scalars['String'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
};
