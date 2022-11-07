import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  Card,
  Box,
  BoxProps,
  CardProps,
  Divider,
  SxProps,
  Theme,
} from '@mui/material';
import { gql, useMutation } from '@apollo/client';
import RoomList from './RoomList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import {
  MutationCreateSiteChatMessageArgs,
  SiteChatMessage,
  SiteChatRoom,
} from '../../generated/graphql';
import appContext, { NotificationLevel } from '../../context';

const CREATE_MESSAGE = gql`
  mutation createSiteChatMessage($roomId: ID!, $text: String!) {
    createSiteChatMessage(roomId: $roomId, text: $text) {
      id
      room
      from
      text
      dateRFC3339
    }
  }
`;

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
    '   rooms   vdevider1   infos          '  auto  \
    '   rooms   vdevider1   hdevider1      '  auto  \
    '   rooms   vdevider1      .           '  1fr   \
    '   rooms   vdevider1   messages       '  auto  \
    '   rooms   vdevider1   hdevider2      '  auto  \
    '   rooms   vdevider1   messageInput   '  auto  \
    /   auto     auto         1fr                   \
  ",
}));

export type ChatProps = {
  renderInfos: (room: SiteChatRoom) => React.ReactElement;
  renderRoomListItem: (room: SiteChatRoom) => React.ReactElement;
  siteId?: string;
  sx?: SxProps<Theme>;
};

export default function Chat(props: ChatProps) {
  const { sx, renderInfos, renderRoomListItem, siteId } = props;
  const { notify } = React.useContext(appContext);
  const [selectedRoom, setSelectedRoom] = React.useState<
    SiteChatRoom | undefined
  >(undefined);

  const [createSiteChatMessage] = useMutation<
    { createSiteChatMessage: SiteChatMessage },
    MutationCreateSiteChatMessageArgs
  >(CREATE_MESSAGE);

  const handleSelectRoom = (room: SiteChatRoom) => {
    setSelectedRoom({ ...room });
  };

  const handleMessageSubmit = async (text: string) => {
    try {
      if (!selectedRoom?.id) return;
      await createSiteChatMessage({
        variables: {
          roomId: selectedRoom.id,
          text,
        },
      });
    } catch (e) {
      notify({ level: NotificationLevel.ERROR, message: `${e}` });
    }
  };

  return (
    <Container sx={{ ...sx }}>
      <Box
        sx={{
          gridArea: 'card',
          placeSelf: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        <ChatCard>
          <RoomList
            sx={{ gridArea: 'rooms' }}
            onSelect={handleSelectRoom}
            renderItem={renderRoomListItem}
            siteId={siteId}
          />
          <Divider orientation="vertical" sx={{ gridArea: 'vdevider1' }} />
          <Box sx={{ gridArea: 'infos' }}>
            {selectedRoom ? renderInfos(selectedRoom) : null}
          </Box>
          <Divider orientation="horizontal" sx={{ gridArea: 'hdevider1' }} />
          <MessageList
            sx={{ gridArea: 'messages' }}
            roomId={selectedRoom?.id}
          />
          <Divider orientation="horizontal" sx={{ gridArea: 'hdevider2' }} />
          <MessageInput
            sx={{ gridArea: 'messageInput' }}
            onSubmit={handleMessageSubmit}
          />
        </ChatCard>
      </Box>
    </Container>
  );
}
