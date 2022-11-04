import * as React from 'react';
import { Box, SxProps, List, ListItem, ListItemButton } from '@mui/material';
import { useQuery, gql } from '@apollo/client';
import {
  QueryListSiteChatRoomsArgs,
  QueryListUserSiteChatRoomsArgs,
  SiteChatRoom,
  SiteChatRoomPageInfo,
} from '../../generated/graphql';

const ROOMS_PAGE_SIZE = 1000;

const LIST_USER_ROOMS = gql`
  query listUserSiteChatRooms($first: Int!, $after: String) {
    listUserSiteChatRooms(first: $first, after: $after) {
      siteChatRooms {
        id
        createdAtRFC3339
        user {
          id
          email
        }
        site {
          id
          name
          address
          phone
          website
          sport {
            title
          }
          club {
            name
            logo
          }
        }
      }
      hasNextPage
      endCursor
    }
  }
`;

const LIST_SITE_ROOMS = gql`
  query listSiteChatRooms($siteId: ID!, $first: Int!, $after: String) {
    listSiteChatRooms(siteId: $siteId, first: $first, after: $after) {
      siteChatRooms {
        id
        createdAtRFC3339
        user {
          id
          email
        }
        site {
          id
          name
          address
          phone
          website
          sport {
            title
          }
          club {
            name
            logo
          }
        }
      }
      hasNextPage
      endCursor
    }
  }
`;

export type RoomListProps = {
  onSelect: (room: SiteChatRoom) => void;
  renderItem: (room: SiteChatRoom) => React.ReactElement;
  siteId?: string;
  sx?: SxProps;
};

type RoomItemProps = {
  room: SiteChatRoom;
  renderItem: (room: SiteChatRoom) => React.ReactElement;
  onClick: (room: SiteChatRoom) => void;
};

function RoomItem({ room, onClick, renderItem }: RoomItemProps) {
  const handleClick = () => {
    onClick(room);
  };

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={handleClick}>{renderItem(room)}</ListItemButton>
    </ListItem>
  );
}

export default function RoomList(props: RoomListProps) {
  const { sx, siteId, onSelect, renderItem } = props;

  const { data: userChatRooms } = useQuery<
    { listUserSiteChatRooms: SiteChatRoomPageInfo },
    QueryListUserSiteChatRoomsArgs
  >(LIST_USER_ROOMS, {
    skip: !!siteId,
    variables: {
      first: ROOMS_PAGE_SIZE,
      after: '',
    },
    fetchPolicy: 'no-cache',
  });
  const { data: siteChatRooms } = useQuery<
    { listSiteChatRooms: SiteChatRoomPageInfo },
    QueryListSiteChatRoomsArgs
  >(LIST_SITE_ROOMS, {
    skip: !siteId,
    variables: {
      siteId: siteId || '',
      first: ROOMS_PAGE_SIZE,
      after: '',
    },
    fetchPolicy: 'no-cache',
  });

  const rooms = React.useMemo(
    () =>
      siteId
        ? siteChatRooms?.listSiteChatRooms.siteChatRooms || []
        : userChatRooms?.listUserSiteChatRooms.siteChatRooms || [],
    [siteId, siteChatRooms, userChatRooms],
  );

  console.log('rooms = ', rooms);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', ...sx }}>
      <List
        sx={{ width: '100%', bgcolor: 'background.paper' }}
        aria-label="rooms"
      >
        {rooms.map((room, i) => (
          <RoomItem
            key={room.id || i}
            room={room}
            onClick={onSelect}
            renderItem={renderItem}
          />
        ))}
      </List>
    </Box>
  );
}
