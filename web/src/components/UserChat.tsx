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

const SiteInfosContainer = styled(Box)<BoxProps>(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplate:
    "  \
    '   .        .         .       .    '  1em  \
    '   .     clubName  clubName   .    '  1fr  \
    '   .        .         .       .    '  2em  \
    '   .     address   address    .    '  1fr  \
    '   .        .         .       .    '  1em  \
    '   .     phone     website    .    '  1fr  \
    '   .        .         .       .    '  1em  \
    /  1em      1fr       1fr     1em           \
  ",
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
    <Typography variant="body2" sx={{ gridArea: 'address' }}>
      {room.site.address}
    </Typography>
    <Typography variant="body2" sx={{ gridArea: 'phone' }}>
      {room.site.phone}
    </Typography>
    <Typography variant="body2" sx={{ gridArea: 'website' }}>
      {room.site.website}
    </Typography>
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
