import * as React from 'react';
import { SxProps, Theme } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import HomeIcon from '@mui/icons-material/Home';
import NavigationPanel from '../../NavigationPanel';

export type UserClubProps = {
  sx?: SxProps<Theme>;
};

export default function UserClub(props: UserClubProps) {
  const { sx } = props;

  return (
    <NavigationPanel
      sx={{ width: '100%', height: '100%', ...sx }}
      links={[
        { to: 'trainers', label: 'Trainers', icon: <GroupsIcon /> },
        { to: 'locations', label: 'Sites', icon: <HomeIcon /> },
      ]}
    />
  );
}
