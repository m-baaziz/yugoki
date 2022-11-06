import * as React from 'react';
import {
  Box,
  BoxProps,
  List,
  ListItem,
  styled,
  SxProps,
  Typography,
} from '@mui/material';
import { cyan, grey } from '@mui/material/colors';
import { useQuery, gql } from '@apollo/client';
import {
  QueryListSiteChatMessagesArgs,
  SiteChatMessage,
  SiteChatMessagePageInfo,
} from '../../generated/graphql';
import appContext from '../../context';

const MESSAGE_PAGE_SIZE = 1000;

const LIST_SITE_ROOMS = gql`
  query listSiteChatMessages($roomId: ID!, $first: Int!, $after: String) {
    listSiteChatMessages(roomId: $roomId, first: $first, after: $after) {
      siteChatMessages {
        id
        room
        from
        text
        dateRFC3339
      }
      hasNextPage
      endCursor
    }
  }
`;

const MessageBox = styled(Box)<BoxProps>(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplate:
    "  \
    '   text   text  '  1fr   \
    '     .      .   '  1em   \
    '     .    date  '  auto  \
    /   1fr    auto           \
  ",
}));

export type MessageListProps = {
  roomId?: string;
  sx?: SxProps;
};

type MessageItemProps = {
  userId: string;
  message: SiteChatMessage;
};

function MessageItem({ message, userId }: MessageItemProps) {
  const isMe = userId === message.from;
  return (
    <ListItem
      sx={{
        display: 'flex',
        flexDirection: isMe ? 'row-reverse' : 'row',
      }}
    >
      <MessageBox
        sx={{ backgroundColor: isMe ? cyan[300] : grey[100], maxWidth: '70%' }}
      >
        <Typography sx={{ gridArea: 'text' }} variant="body2">
          {message.text}
        </Typography>
        <Typography sx={{ gridArea: 'date' }} variant="body2">
          {message.dateRFC3339}
        </Typography>
      </MessageBox>
    </ListItem>
  );
}

export default function MessageList(props: MessageListProps) {
  const { sx, roomId } = props;
  const { user, setNewMessageHandler } = React.useContext(appContext);

  const { data, refetch } = useQuery<
    { listSiteChatMessages: SiteChatMessagePageInfo },
    QueryListSiteChatMessagesArgs
  >(LIST_SITE_ROOMS, {
    skip: !roomId,
    variables: {
      roomId: roomId || '',
      first: MESSAGE_PAGE_SIZE,
      after: '',
    },
    fetchPolicy: 'no-cache',
  });

  React.useEffect(() => {
    setNewMessageHandler({
      handler() {
        refetch();
      },
    });
  }, [setNewMessageHandler]);

  return (
    <Box sx={{ ...sx }}>
      <List
        sx={{ width: '100%', bgcolor: 'background.paper' }}
        aria-label="messages"
      >
        {data?.listSiteChatMessages.siteChatMessages.map((message, i) => (
          <MessageItem
            key={message.id || i}
            message={message}
            userId={user?.id || ''}
          />
        ))}
      </List>
    </Box>
  );
}
