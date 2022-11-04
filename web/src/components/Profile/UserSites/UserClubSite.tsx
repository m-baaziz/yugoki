import * as React from 'react';
import { SxProps, Theme } from '@mui/material';
import NavigationPanel from '../../NavigationPanel';
import PaidIcon from '@mui/icons-material/Paid';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ChatIcon from '@mui/icons-material/Chat';

export type UserSiteProps = {
  sx?: SxProps<Theme>;
};

export default function UserSite(props: UserSiteProps) {
  const { sx } = props;

  return (
    <NavigationPanel
      sx={{ width: '100%', height: '100%', ...sx }}
      links={[
        { to: 'subscriptions', label: 'Subscriptions', icon: <PaidIcon /> },
        { to: 'events', label: 'Events', icon: <EmojiEventsIcon /> },
        { to: 'messages', label: 'Messages', icon: <ChatIcon /> },
      ]}
    />
  );
}
