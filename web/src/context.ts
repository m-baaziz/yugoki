import React from 'react';
import { User } from './generated/graphql';

export const LOCAL_STORAGE_TOKEN_KEY = 'token';

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
};

const appContext = React.createContext<AppContext>({
  user: undefined,
  notify: () => {
    return;
  },
});

export default appContext;
