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

export type AdditionalEntityFields = {
  path?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
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
  images: Array<Scalars['String']>;
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
  title: Scalars['String'];
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
  AdditionalEntityFields: AdditionalEntityFields;
  String: ResolverTypeWrapper<Scalars['String']>;
  Activity: ResolverTypeWrapper<Activity>;
  CalendarSpan: ResolverTypeWrapper<CalendarSpan>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Club: ResolverTypeWrapper<Club>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  ClubPageInfo: ResolverTypeWrapper<ClubPageInfo>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  ClubSportLocation: ResolverTypeWrapper<ClubSportLocation>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ClubSportLocationPageInfo: ResolverTypeWrapper<ClubSportLocationPageInfo>;
  ClubSportLocationSearchQueryInput: ClubSportLocationSearchQueryInput;
  Event: ResolverTypeWrapper<Event>;
  EventPageInfo: ResolverTypeWrapper<EventPageInfo>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  SearchArea: SearchArea;
  Sport: ResolverTypeWrapper<Sport>;
  SportPageInfo: ResolverTypeWrapper<SportPageInfo>;
  Trainer: ResolverTypeWrapper<Trainer>;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AdditionalEntityFields: AdditionalEntityFields;
  String: Scalars['String'];
  Activity: Activity;
  CalendarSpan: CalendarSpan;
  Int: Scalars['Int'];
  Club: Club;
  ID: Scalars['ID'];
  ClubPageInfo: ClubPageInfo;
  Boolean: Scalars['Boolean'];
  ClubSportLocation: ClubSportLocation;
  Float: Scalars['Float'];
  ClubSportLocationPageInfo: ClubSportLocationPageInfo;
  ClubSportLocationSearchQueryInput: ClubSportLocationSearchQueryInput;
  Event: Event;
  EventPageInfo: EventPageInfo;
  Mutation: {};
  Query: {};
  SearchArea: SearchArea;
  Sport: Sport;
  SportPageInfo: SportPageInfo;
  Trainer: Trainer;
  User: User;
};

export type UnionDirectiveArgs = {
  discriminatorField?: Maybe<Scalars['String']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type UnionDirectiveResolver<Result, Parent, ContextType = any, Args = UnionDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AbstractEntityDirectiveArgs = {
  discriminatorField: Scalars['String'];
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type AbstractEntityDirectiveResolver<Result, Parent, ContextType = any, Args = AbstractEntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EntityDirectiveArgs = {
  embedded?: Maybe<Scalars['Boolean']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type EntityDirectiveResolver<Result, Parent, ContextType = any, Args = EntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ColumnDirectiveArgs = {
  overrideType?: Maybe<Scalars['String']>;
};

export type ColumnDirectiveResolver<Result, Parent, ContextType = any, Args = ColumnDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type IdDirectiveArgs = { };

export type IdDirectiveResolver<Result, Parent, ContextType = any, Args = IdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type LinkDirectiveArgs = {
  overrideType?: Maybe<Scalars['String']>;
};

export type LinkDirectiveResolver<Result, Parent, ContextType = any, Args = LinkDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EmbeddedDirectiveArgs = { };

export type EmbeddedDirectiveResolver<Result, Parent, ContextType = any, Args = EmbeddedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type MapDirectiveArgs = {
  path: Scalars['String'];
};

export type MapDirectiveResolver<Result, Parent, ContextType = any, Args = MapDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ActivityResolvers<ContextType = any, ParentType extends ResolversParentTypes['Activity'] = ResolversParentTypes['Activity']> = {
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CalendarSpanResolvers<ContextType = any, ParentType extends ResolversParentTypes['CalendarSpan'] = ResolversParentTypes['CalendarSpan']> = {
  fromDay?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  fromTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  toDay?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  toTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ClubResolvers<ContextType = any, ParentType extends ResolversParentTypes['Club'] = ResolversParentTypes['Club']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  logo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subtitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ClubPageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['ClubPageInfo'] = ResolversParentTypes['ClubPageInfo']> = {
  clubs?: Resolver<Array<ResolversTypes['Club']>, ParentType, ContextType>;
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ClubSportLocationResolvers<ContextType = any, ParentType extends ResolversParentTypes['ClubSportLocation'] = ResolversParentTypes['ClubSportLocation']> = {
  activities?: Resolver<Array<ResolversTypes['Activity']>, ParentType, ContextType>;
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  club?: Resolver<ResolversTypes['Club'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  images?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  lat?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  lon?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  phone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  schedule?: Resolver<Array<ResolversTypes['CalendarSpan']>, ParentType, ContextType>;
  sport?: Resolver<ResolversTypes['Sport'], ParentType, ContextType>;
  trainers?: Resolver<Array<ResolversTypes['Trainer']>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ClubSportLocationPageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['ClubSportLocationPageInfo'] = ResolversParentTypes['ClubSportLocationPageInfo']> = {
  clubSportLocations?: Resolver<Array<ResolversTypes['ClubSportLocation']>, ParentType, ContextType>;
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EventResolvers<ContextType = any, ParentType extends ResolversParentTypes['Event'] = ResolversParentTypes['Event']> = {
  clubSportLocation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dateRFC3339?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EventPageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['EventPageInfo'] = ResolversParentTypes['EventPageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  events?: Resolver<Array<ResolversTypes['Event']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  signIn?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationSignInArgs, 'email' | 'password'>>;
  signUp?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationSignUpArgs, 'email' | 'password'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getClub?: Resolver<ResolversTypes['Club'], ParentType, ContextType, RequireFields<QueryGetClubArgs, 'id'>>;
  getClubSportLocation?: Resolver<ResolversTypes['ClubSportLocation'], ParentType, ContextType, RequireFields<QueryGetClubSportLocationArgs, 'id'>>;
  getEvent?: Resolver<ResolversTypes['Event'], ParentType, ContextType, RequireFields<QueryGetEventArgs, 'id'>>;
  listClubSportLocationEvents?: Resolver<ResolversTypes['EventPageInfo'], ParentType, ContextType, RequireFields<QueryListClubSportLocationEventsArgs, 'cslId' | 'first'>>;
  listClubSportLocations?: Resolver<ResolversTypes['ClubSportLocationPageInfo'], ParentType, ContextType, RequireFields<QueryListClubSportLocationsArgs, 'first'>>;
  listClubs?: Resolver<ResolversTypes['ClubPageInfo'], ParentType, ContextType, RequireFields<QueryListClubsArgs, 'first'>>;
  listSports?: Resolver<ResolversTypes['SportPageInfo'], ParentType, ContextType, RequireFields<QueryListSportsArgs, 'first'>>;
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  searchClubSportLocations?: Resolver<ResolversTypes['ClubSportLocationPageInfo'], ParentType, ContextType, RequireFields<QuerySearchClubSportLocationsArgs, 'first' | 'query'>>;
};

export type SportResolvers<ContextType = any, ParentType extends ResolversParentTypes['Sport'] = ResolversParentTypes['Sport']> = {
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
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

export type TrainerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Trainer'] = ResolversParentTypes['Trainer']> = {
  club?: Resolver<Maybe<ResolversTypes['Club']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  displayname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  lastname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  photo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Activity?: ActivityResolvers<ContextType>;
  CalendarSpan?: CalendarSpanResolvers<ContextType>;
  Club?: ClubResolvers<ContextType>;
  ClubPageInfo?: ClubPageInfoResolvers<ContextType>;
  ClubSportLocation?: ClubSportLocationResolvers<ContextType>;
  ClubSportLocationPageInfo?: ClubSportLocationPageInfoResolvers<ContextType>;
  Event?: EventResolvers<ContextType>;
  EventPageInfo?: EventPageInfoResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Sport?: SportResolvers<ContextType>;
  SportPageInfo?: SportPageInfoResolvers<ContextType>;
  Trainer?: TrainerResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  union?: UnionDirectiveResolver<any, any, ContextType>;
  abstractEntity?: AbstractEntityDirectiveResolver<any, any, ContextType>;
  entity?: EntityDirectiveResolver<any, any, ContextType>;
  column?: ColumnDirectiveResolver<any, any, ContextType>;
  id?: IdDirectiveResolver<any, any, ContextType>;
  link?: LinkDirectiveResolver<any, any, ContextType>;
  embedded?: EmbeddedDirectiveResolver<any, any, ContextType>;
  map?: MapDirectiveResolver<any, any, ContextType>;
};

import { ObjectId } from 'mongodb';
export type ActivityDbObject = {
  description: string,
  icon?: Maybe<string>,
  name: string,
};

export type CalendarSpanDbObject = {
  fromDay: number,
  fromTime: string,
  title: string,
  toDay: number,
  toTime: string,
};

export type ClubDbObject = {
  _id?: Maybe<ObjectId>,
  logo?: Maybe<string>,
  name: string,
  subtitle: string,
};

export type ClubSportLocationDbObject = {
  activities: Array<ActivityDbObject>,
  address: string,
  club: ClubDbObject['_id'],
  description: string,
  _id?: Maybe<ObjectId>,
  images: Array<string>,
  lat: number,
  lon: number,
  phone: string,
  schedule: Array<CalendarSpanDbObject>,
  sport: SportDbObject['_id'],
  trainers: Array<TrainerDbObject['_id']>,
  website?: Maybe<string>,
};

export type EventDbObject = {
  clubSportLocation: string,
  dateRFC3339: string,
  description: string,
  _id?: Maybe<ObjectId>,
  image?: Maybe<string>,
  title: string,
};

export type SportDbObject = {
  description: string,
  _id?: Maybe<ObjectId>,
  tags: Array<string>,
  title: string,
};

export type TrainerDbObject = {
  club?: Maybe<ClubDbObject['_id']>,
  description: string,
  displayname: string,
  firstname: string,
  _id?: Maybe<ObjectId>,
  lastname: string,
  photo?: Maybe<string>,
};

export type UserDbObject = {
  email: string,
  _id?: Maybe<ObjectId>,
  passwordHash: string,
};
