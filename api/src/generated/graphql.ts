import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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
  TrainerPhoto = 'TrainerPhoto'
}

export type FileUploadResponse = {
  __typename?: 'FileUploadResponse';
  file: FileUpload;
  url?: Maybe<Scalars['String']>;
};

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
};


export type MutationCreateClubArgs = {
  name: Scalars['String'];
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

export type Query = {
  __typename?: 'Query';
  getClub: Club;
  getEvent: Event;
  getFileUpload: FileUploadResponse;
  getSite: Site;
  getSiteImages: Array<FileUploadResponse>;
  getSubscription: Subscription;
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
  site: Scalars['String'];
  userId: Scalars['String'];
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
  createdAtRFC3339: Scalars['String'];
  id: Scalars['ID'];
  site: Scalars['String'];
  subscriberDetails: SubscriberDetails;
  subscriptionOption: SubscriptionOption;
};

export type SubscriptionOption = {
  __typename?: 'SubscriptionOption';
  enabled: Scalars['Boolean'];
  features: Array<Scalars['String']>;
  id: Scalars['ID'];
  price: Scalars['Float'];
  site: Scalars['String'];
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
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Activity: ResolverTypeWrapper<Activity>;
  ActivityInput: ActivityInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CalendarSpan: ResolverTypeWrapper<CalendarSpan>;
  CalendarSpanInput: CalendarSpanInput;
  Club: ResolverTypeWrapper<Club>;
  ClubPageInfo: ResolverTypeWrapper<ClubPageInfo>;
  Event: ResolverTypeWrapper<Event>;
  EventInput: EventInput;
  EventPageInfo: ResolverTypeWrapper<EventPageInfo>;
  FileUpload: ResolverTypeWrapper<FileUpload>;
  FileUploadInput: FileUploadInput;
  FileUploadKind: FileUploadKind;
  FileUploadResponse: ResolverTypeWrapper<FileUploadResponse>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Gender: Gender;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  SearchArea: SearchArea;
  Site: ResolverTypeWrapper<Site>;
  SiteChatMessage: ResolverTypeWrapper<SiteChatMessage>;
  SiteChatMessagePageInfo: ResolverTypeWrapper<SiteChatMessagePageInfo>;
  SiteChatRoom: ResolverTypeWrapper<SiteChatRoom>;
  SiteChatRoomPageInfo: ResolverTypeWrapper<SiteChatRoomPageInfo>;
  SiteInput: SiteInput;
  SitePageInfo: ResolverTypeWrapper<SitePageInfo>;
  SiteSearchQueryInput: SiteSearchQueryInput;
  Sport: ResolverTypeWrapper<Sport>;
  SportInput: SportInput;
  SportPageInfo: ResolverTypeWrapper<SportPageInfo>;
  String: ResolverTypeWrapper<Scalars['String']>;
  SubscriberDetails: ResolverTypeWrapper<SubscriberDetails>;
  SubscriberDetailsInput: SubscriberDetailsInput;
  Subscription: ResolverTypeWrapper<{}>;
  SubscriptionOption: ResolverTypeWrapper<SubscriptionOption>;
  SubscriptionOptionInput: SubscriptionOptionInput;
  SubscriptionOptionPageInfo: ResolverTypeWrapper<SubscriptionOptionPageInfo>;
  SubscriptionPageInfo: ResolverTypeWrapper<SubscriptionPageInfo>;
  Trainer: ResolverTypeWrapper<Trainer>;
  TrainerInput: TrainerInput;
  TrainerPageInfo: ResolverTypeWrapper<TrainerPageInfo>;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Activity: Activity;
  ActivityInput: ActivityInput;
  Boolean: Scalars['Boolean'];
  CalendarSpan: CalendarSpan;
  CalendarSpanInput: CalendarSpanInput;
  Club: Club;
  ClubPageInfo: ClubPageInfo;
  Event: Event;
  EventInput: EventInput;
  EventPageInfo: EventPageInfo;
  FileUpload: FileUpload;
  FileUploadInput: FileUploadInput;
  FileUploadResponse: FileUploadResponse;
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Mutation: {};
  Query: {};
  SearchArea: SearchArea;
  Site: Site;
  SiteChatMessage: SiteChatMessage;
  SiteChatMessagePageInfo: SiteChatMessagePageInfo;
  SiteChatRoom: SiteChatRoom;
  SiteChatRoomPageInfo: SiteChatRoomPageInfo;
  SiteInput: SiteInput;
  SitePageInfo: SitePageInfo;
  SiteSearchQueryInput: SiteSearchQueryInput;
  Sport: Sport;
  SportInput: SportInput;
  SportPageInfo: SportPageInfo;
  String: Scalars['String'];
  SubscriberDetails: SubscriberDetails;
  SubscriberDetailsInput: SubscriberDetailsInput;
  Subscription: {};
  SubscriptionOption: SubscriptionOption;
  SubscriptionOptionInput: SubscriptionOptionInput;
  SubscriptionOptionPageInfo: SubscriptionOptionPageInfo;
  SubscriptionPageInfo: SubscriptionPageInfo;
  Trainer: Trainer;
  TrainerInput: TrainerInput;
  TrainerPageInfo: TrainerPageInfo;
  User: User;
};

export type ActivityResolvers<ContextType = any, ParentType extends ResolversParentTypes['Activity'] = ResolversParentTypes['Activity']> = {
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CalendarSpanResolvers<ContextType = any, ParentType extends ResolversParentTypes['CalendarSpan'] = ResolversParentTypes['CalendarSpan']> = {
  day?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  fromMinute?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  toMinute?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ClubResolvers<ContextType = any, ParentType extends ResolversParentTypes['Club'] = ResolversParentTypes['Club']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  logo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ClubPageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['ClubPageInfo'] = ResolversParentTypes['ClubPageInfo']> = {
  clubs?: Resolver<Array<ResolversTypes['Club']>, ParentType, ContextType>;
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EventResolvers<ContextType = any, ParentType extends ResolversParentTypes['Event'] = ResolversParentTypes['Event']> = {
  dateRFC3339?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  site?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EventPageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['EventPageInfo'] = ResolversParentTypes['EventPageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  events?: Resolver<Array<ResolversTypes['Event']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FileUploadResolvers<ContextType = any, ParentType extends ResolversParentTypes['FileUpload'] = ResolversParentTypes['FileUpload']> = {
  ext?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  kind?: Resolver<ResolversTypes['FileUploadKind'], ParentType, ContextType>;
  size?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FileUploadResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['FileUploadResponse'] = ResolversParentTypes['FileUploadResponse']> = {
  file?: Resolver<ResolversTypes['FileUpload'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createClub?: Resolver<ResolversTypes['Club'], ParentType, ContextType, RequireFields<MutationCreateClubArgs, 'name'>>;
  createEvent?: Resolver<ResolversTypes['Event'], ParentType, ContextType, RequireFields<MutationCreateEventArgs, 'input' | 'siteId'>>;
  createFileUpload?: Resolver<ResolversTypes['FileUploadResponse'], ParentType, ContextType, RequireFields<MutationCreateFileUploadArgs, 'input'>>;
  createSite?: Resolver<Maybe<ResolversTypes['Site']>, ParentType, ContextType, RequireFields<MutationCreateSiteArgs, 'clubId' | 'input'>>;
  createSiteChatMessage?: Resolver<ResolversTypes['SiteChatMessage'], ParentType, ContextType, RequireFields<MutationCreateSiteChatMessageArgs, 'roomId' | 'text'>>;
  createSiteChatRoom?: Resolver<ResolversTypes['SiteChatRoom'], ParentType, ContextType, RequireFields<MutationCreateSiteChatRoomArgs, 'siteId'>>;
  createSport?: Resolver<ResolversTypes['Sport'], ParentType, ContextType, RequireFields<MutationCreateSportArgs, 'input'>>;
  createSubscription?: Resolver<ResolversTypes['Subscription'], ParentType, ContextType, RequireFields<MutationCreateSubscriptionArgs, 'details' | 'siteId' | 'subscriptionOptionId'>>;
  createSubscriptionOption?: Resolver<ResolversTypes['SubscriptionOption'], ParentType, ContextType, RequireFields<MutationCreateSubscriptionOptionArgs, 'input' | 'siteId'>>;
  createTrainer?: Resolver<ResolversTypes['Trainer'], ParentType, ContextType, RequireFields<MutationCreateTrainerArgs, 'clubId' | 'input'>>;
  deleteClub?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteClubArgs, 'id'>>;
  deleteEvent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteEventArgs, 'id' | 'siteId'>>;
  deleteSite?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteSiteArgs, 'id'>>;
  deleteSiteChatMessage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteSiteChatMessageArgs, 'id' | 'roomId'>>;
  deleteSiteChatRoom?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteSiteChatRoomArgs, 'id'>>;
  deleteSport?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteSportArgs, 'id'>>;
  deleteTrainer?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteTrainerArgs, 'clubId' | 'id'>>;
  disableSubscriptionOption?: Resolver<ResolversTypes['SubscriptionOption'], ParentType, ContextType, RequireFields<MutationDisableSubscriptionOptionArgs, 'id' | 'siteId'>>;
  enableSubscriptionOption?: Resolver<ResolversTypes['SubscriptionOption'], ParentType, ContextType, RequireFields<MutationEnableSubscriptionOptionArgs, 'id' | 'siteId'>>;
  signIn?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationSignInArgs, 'email' | 'password'>>;
  signUp?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationSignUpArgs, 'email' | 'password'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getClub?: Resolver<ResolversTypes['Club'], ParentType, ContextType, RequireFields<QueryGetClubArgs, 'id'>>;
  getEvent?: Resolver<ResolversTypes['Event'], ParentType, ContextType, RequireFields<QueryGetEventArgs, 'id' | 'siteId'>>;
  getFileUpload?: Resolver<ResolversTypes['FileUploadResponse'], ParentType, ContextType, RequireFields<QueryGetFileUploadArgs, 'id'>>;
  getSite?: Resolver<ResolversTypes['Site'], ParentType, ContextType, RequireFields<QueryGetSiteArgs, 'id'>>;
  getSiteImages?: Resolver<Array<ResolversTypes['FileUploadResponse']>, ParentType, ContextType, RequireFields<QueryGetSiteImagesArgs, 'id'>>;
  getSubscription?: Resolver<ResolversTypes['Subscription'], ParentType, ContextType, RequireFields<QueryGetSubscriptionArgs, 'id' | 'siteId' | 'subscriptionOptionId'>>;
  getSubscriptionOption?: Resolver<ResolversTypes['SubscriptionOption'], ParentType, ContextType, RequireFields<QueryGetSubscriptionOptionArgs, 'id' | 'siteId'>>;
  listEnabledSubscriptionOptionsBySite?: Resolver<ResolversTypes['SubscriptionOptionPageInfo'], ParentType, ContextType, RequireFields<QueryListEnabledSubscriptionOptionsBySiteArgs, 'first' | 'siteId'>>;
  listSiteChatMessages?: Resolver<ResolversTypes['SiteChatMessagePageInfo'], ParentType, ContextType, RequireFields<QueryListSiteChatMessagesArgs, 'first' | 'roomId'>>;
  listSiteChatRooms?: Resolver<ResolversTypes['SiteChatRoomPageInfo'], ParentType, ContextType, RequireFields<QueryListSiteChatRoomsArgs, 'first' | 'siteId'>>;
  listSiteEvents?: Resolver<ResolversTypes['EventPageInfo'], ParentType, ContextType, RequireFields<QueryListSiteEventsArgs, 'first' | 'siteId'>>;
  listSitesByClub?: Resolver<ResolversTypes['SitePageInfo'], ParentType, ContextType, RequireFields<QueryListSitesByClubArgs, 'clubId' | 'first'>>;
  listSports?: Resolver<ResolversTypes['SportPageInfo'], ParentType, ContextType, RequireFields<QueryListSportsArgs, 'first'>>;
  listSubscriptionOptionsBySite?: Resolver<ResolversTypes['SubscriptionOptionPageInfo'], ParentType, ContextType, RequireFields<QueryListSubscriptionOptionsBySiteArgs, 'first' | 'siteId'>>;
  listSubscriptionsBySite?: Resolver<ResolversTypes['SubscriptionPageInfo'], ParentType, ContextType, RequireFields<QueryListSubscriptionsBySiteArgs, 'first' | 'siteId'>>;
  listSubscriptionsBySubscriptionOption?: Resolver<ResolversTypes['SubscriptionPageInfo'], ParentType, ContextType, RequireFields<QueryListSubscriptionsBySubscriptionOptionArgs, 'first' | 'siteId' | 'subscriptionOptionId'>>;
  listTrainersByClub?: Resolver<ResolversTypes['TrainerPageInfo'], ParentType, ContextType, RequireFields<QueryListTrainersByClubArgs, 'clubId' | 'first'>>;
  listUserClubs?: Resolver<ResolversTypes['ClubPageInfo'], ParentType, ContextType, RequireFields<QueryListUserClubsArgs, 'first'>>;
  listUserSiteChatRooms?: Resolver<ResolversTypes['SiteChatRoomPageInfo'], ParentType, ContextType, RequireFields<QueryListUserSiteChatRoomsArgs, 'first'>>;
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  searchSites?: Resolver<ResolversTypes['SitePageInfo'], ParentType, ContextType, RequireFields<QuerySearchSitesArgs, 'first' | 'query'>>;
};

export type SiteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Site'] = ResolversParentTypes['Site']> = {
  activities?: Resolver<Array<ResolversTypes['Activity']>, ParentType, ContextType>;
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  club?: Resolver<ResolversTypes['Club'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  images?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  lat?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  lon?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  schedule?: Resolver<Array<ResolversTypes['CalendarSpan']>, ParentType, ContextType>;
  sport?: Resolver<ResolversTypes['Sport'], ParentType, ContextType>;
  trainers?: Resolver<Array<ResolversTypes['Trainer']>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SiteChatMessageResolvers<ContextType = any, ParentType extends ResolversParentTypes['SiteChatMessage'] = ResolversParentTypes['SiteChatMessage']> = {
  dateRFC3339?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  from?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  room?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SiteChatMessagePageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['SiteChatMessagePageInfo'] = ResolversParentTypes['SiteChatMessagePageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  siteChatMessages?: Resolver<Array<ResolversTypes['SiteChatMessage']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SiteChatRoomResolvers<ContextType = any, ParentType extends ResolversParentTypes['SiteChatRoom'] = ResolversParentTypes['SiteChatRoom']> = {
  createdAtRFC3339?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  site?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SiteChatRoomPageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['SiteChatRoomPageInfo'] = ResolversParentTypes['SiteChatRoomPageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  siteChatRooms?: Resolver<Array<ResolversTypes['SiteChatRoom']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SitePageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['SitePageInfo'] = ResolversParentTypes['SitePageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  sites?: Resolver<Array<ResolversTypes['Site']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SportResolvers<ContextType = any, ParentType extends ResolversParentTypes['Sport'] = ResolversParentTypes['Sport']> = {
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SportPageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['SportPageInfo'] = ResolversParentTypes['SportPageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  sports?: Resolver<Array<ResolversTypes['Sport']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriberDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubscriberDetails'] = ResolversParentTypes['SubscriberDetails']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dateOfBirth?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gender?: Resolver<ResolversTypes['Gender'], ParentType, ContextType>;
  lastname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  createdAtRFC3339?: SubscriptionResolver<ResolversTypes['String'], "createdAtRFC3339", ParentType, ContextType>;
  id?: SubscriptionResolver<ResolversTypes['ID'], "id", ParentType, ContextType>;
  site?: SubscriptionResolver<ResolversTypes['String'], "site", ParentType, ContextType>;
  subscriberDetails?: SubscriptionResolver<ResolversTypes['SubscriberDetails'], "subscriberDetails", ParentType, ContextType>;
  subscriptionOption?: SubscriptionResolver<ResolversTypes['SubscriptionOption'], "subscriptionOption", ParentType, ContextType>;
};

export type SubscriptionOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubscriptionOption'] = ResolversParentTypes['SubscriptionOption']> = {
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  features?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  site?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionOptionPageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubscriptionOptionPageInfo'] = ResolversParentTypes['SubscriptionOptionPageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  subscriptionOptions?: Resolver<Array<ResolversTypes['SubscriptionOption']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionPageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubscriptionPageInfo'] = ResolversParentTypes['SubscriptionPageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  subscriptions?: Resolver<Array<ResolversTypes['Subscription']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TrainerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Trainer'] = ResolversParentTypes['Trainer']> = {
  club?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  displayname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  photo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TrainerPageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['TrainerPageInfo'] = ResolversParentTypes['TrainerPageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  trainers?: Resolver<Array<ResolversTypes['Trainer']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Activity?: ActivityResolvers<ContextType>;
  CalendarSpan?: CalendarSpanResolvers<ContextType>;
  Club?: ClubResolvers<ContextType>;
  ClubPageInfo?: ClubPageInfoResolvers<ContextType>;
  Event?: EventResolvers<ContextType>;
  EventPageInfo?: EventPageInfoResolvers<ContextType>;
  FileUpload?: FileUploadResolvers<ContextType>;
  FileUploadResponse?: FileUploadResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Site?: SiteResolvers<ContextType>;
  SiteChatMessage?: SiteChatMessageResolvers<ContextType>;
  SiteChatMessagePageInfo?: SiteChatMessagePageInfoResolvers<ContextType>;
  SiteChatRoom?: SiteChatRoomResolvers<ContextType>;
  SiteChatRoomPageInfo?: SiteChatRoomPageInfoResolvers<ContextType>;
  SitePageInfo?: SitePageInfoResolvers<ContextType>;
  Sport?: SportResolvers<ContextType>;
  SportPageInfo?: SportPageInfoResolvers<ContextType>;
  SubscriberDetails?: SubscriberDetailsResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  SubscriptionOption?: SubscriptionOptionResolvers<ContextType>;
  SubscriptionOptionPageInfo?: SubscriptionOptionPageInfoResolvers<ContextType>;
  SubscriptionPageInfo?: SubscriptionPageInfoResolvers<ContextType>;
  Trainer?: TrainerResolvers<ContextType>;
  TrainerPageInfo?: TrainerPageInfoResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

