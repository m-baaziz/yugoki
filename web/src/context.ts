import React from 'react';
import { User } from './generated/graphql';
import { MessageHandler } from './hooks/ws';

export enum NotificationLevel {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  SUCCESS = 'success',
}

export type Notification = {
  level: NotificationLevel;
  message: string;
};

type AppContext = {
  user: User | undefined;
  notify: (notification: Notification) => void;
  setNewMessageHandler: (handler: MessageHandler) => void;
};

const appContext = React.createContext<AppContext>({
  user: undefined,
  notify: () => {
    return;
  },
  setNewMessageHandler: () => {
    return;
  },
});

export default appContext;
