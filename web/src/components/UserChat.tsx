import * as React from 'react';
import {
  Box,
  styled,
  BoxProps,
  Typography,
  Avatar,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { SiteChatRoom } from '../generated/graphql';

import Chat from './Chat';
import ContactInfos from './SitePage/ContactInfos';

const SiteInfosContainer = styled(Box)<BoxProps>(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: 20,
}));

const renderRoomListItem = (room: SiteChatRoom) => (
  <>
    {room.site.club.logo ? (
      <ListItemIcon>
        <Avatar alt={`${room.site.club.name}`} src={`${room.site.club.logo}`} />
      </ListItemIcon>
    ) : null}
    <ListItemText primary={`${room.site.club.name}`} />
  </>
);

const renderSiteInfos = (room: SiteChatRoom) => (
  <SiteInfosContainer>
    <Link
      to={`/sites/${room.site.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Typography variant="h5" sx={{ gridArea: 'clubName' }}>
        {room.site.club.name}
      </Typography>
    </Link>
    <ContactInfos
      address={room.site.address}
      phone={room.site.phone}
      web={room.site.website || undefined}
    />
  </SiteInfosContainer>
);

export default function UserChat() {
  return (
    <Chat
      renderInfos={renderSiteInfos}
      renderRoomListItem={renderRoomListItem}
    />
  );
}
