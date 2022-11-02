import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Card, Box, BoxProps, CardProps, Divider } from '@mui/material';
import RoomList from './RoomList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import SiteInfo from './SiteInfo';
import { SiteChatRoom } from '../../generated/graphql';

const Container = styled(Box)<BoxProps>(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplate:
    "  \
    '   .        .         .    '  1em  \
    '   .       card       .    '  1fr  \
    '   .        .         .    '  1em  \
    /  10%      1fr       10%           \
  ",
}));

const ChatCard = styled(Card)<CardProps>(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplate:
    "  \
    '   rooms   vdevider1   messages      vdevider2   site   '  1fr   \
    '   rooms   vdevider1   hdevider      vdevider2   site   '  auto  \
    '   rooms   vdevider1   messageInput  vdevider2   site   '  auto  \
    /   150px     auto         1fr          auto      150px           \
  ",
}));

export default function Messages() {
  const [selectedRoom, setSelectedRoom] = React.useState<
    SiteChatRoom | undefined
  >(undefined);

  console.log('selected room = ', selectedRoom);

  const handleSelectRoom = (room: SiteChatRoom) => {
    setSelectedRoom({ ...room });
  };

  return (
    <Container>
      <Box
        sx={{
          gridArea: 'card',
          placeSelf: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        <ChatCard>
          <RoomList sx={{ gridArea: 'rooms' }} onSelect={handleSelectRoom} />
          <Divider orientation="vertical" sx={{ gridArea: 'vdevider1' }} />
          <MessageList sx={{ gridArea: 'messages' }} />
          <Divider orientation="horizontal" sx={{ gridArea: 'hdevider' }} />
          <MessageInput sx={{ gridArea: 'messageInput' }} />
          <Divider orientation="vertical" sx={{ gridArea: 'vdevider2' }} />
          <SiteInfo sx={{ gridArea: 'site' }} />
        </ChatCard>
      </Box>
    </Container>
  );
}
