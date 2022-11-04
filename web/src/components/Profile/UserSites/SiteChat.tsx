import * as React from 'react';
import { Box, styled, BoxProps, Typography, ListItemText } from '@mui/material';
import { useParams } from 'react-router-dom';
import { SiteChatRoom } from '../../../generated/graphql';

import Chat from '../../Chat';

const SiteInfosContainer = styled(Box)<BoxProps>(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplate:
    "  \
    '   .     .     .    '  1em  \
    '   .   email   .    '  1fr  \
    '   .     .     .    '  2em  \
    '   .    id     .    '  1fr  \
    '   .     .     .    '  1em  \
    /  1em   1fr   1em           \
  ",
}));

const renderRoomListItem = (room: SiteChatRoom) => (
  <ListItemText primary={`${room.user.email}`} />
);

const renderSiteInfos = (room: SiteChatRoom) => (
  <SiteInfosContainer>
    <Typography variant="h5" sx={{ gridArea: 'email' }}>
      {room.user.email}
    </Typography>
    <Typography variant="body2" sx={{ gridArea: 'id' }}>
      {room.user.id}
    </Typography>
  </SiteInfosContainer>
);

export default function SiteChat() {
  const { siteId } = useParams();

  return (
    <Chat
      renderInfos={renderSiteInfos}
      renderRoomListItem={renderRoomListItem}
      siteId={siteId}
    />
  );
}
