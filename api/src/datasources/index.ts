import { Context } from 'apollo-server-core';
import { AuthenticationContext } from '../middlewares/context';
import SportAPI from './sport';
import ClubAPI from './club';
import UserAPI from './user';
import SiteAPI from './site';
import TrainerAPI from './trainer';
import EventAPI from './event';
import SubscriptionAPI from './subscription';
import SubscriptionOptionAPI from './subscriptionOption';
import FileUploadAPI from './fileUpload';
import SiteChatRoomAPI from './siteChatRoom';
import SiteChatMessageAPI from './siteChatMessage';

export type DataSources = {
  userAPI: UserAPI;
  sportAPI: SportAPI;
  clubAPI: ClubAPI;
  siteAPI: SiteAPI;
  trainerAPI: TrainerAPI;
  eventAPI: EventAPI;
  subscriptionOptionAPI: SubscriptionOptionAPI;
  subscriptionAPI: SubscriptionAPI;
  fileUploadAPI: FileUploadAPI;
  siteChatRoomAPI: SiteChatRoomAPI;
  siteChatMessageAPI: SiteChatMessageAPI;
};

export type ContextWithDataSources = Context<AuthenticationContext> & {
  dataSources: DataSources;
};
