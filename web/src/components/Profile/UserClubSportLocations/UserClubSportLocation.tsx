import * as React from 'react';
import { SxProps, Theme } from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';
import EditIcon from '@mui/icons-material/Edit';
import NavigationPanel from '../../NavigationPanel';

export type UserClubSportLocationProps = {
  sx?: SxProps<Theme>;
};

export default function UserClubSportLocation(
  props: UserClubSportLocationProps,
) {
  const { sx } = props;

  return (
    <NavigationPanel
      sx={{ width: '100%', height: '100%', ...sx }}
      links={[
        { to: 'subscriptions', label: 'Subscriptions', icon: <PaidIcon /> },
        { to: 'edit', label: 'Edit', icon: <EditIcon /> },
      ]}
    />
  );
}
