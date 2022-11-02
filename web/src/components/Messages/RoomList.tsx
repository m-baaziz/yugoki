import * as React from 'react';
import {
  Box,
  SxProps,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
} from '@mui/material';
import { useQuery, gql } from '@apollo/client';
import {
  QueryListUserSiteChatRoomsArgs,
  SiteChatRoom,
  SiteChatRoomPageInfo,
} from '../../generated/graphql';

const SITE_ROOMS_PAGE_SIZE = 100;

const LIST_SITE_ROOMS = gql`
  query listUserSiteChatRooms($first: Int!, $after: String) {
    listUserSiteChatRooms(first: $first, after: $after) {
      siteChatRooms {
        id
        createdAtRFC3339
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
  sx?: SxProps;
};

type RoomItemProps = {
  room: SiteChatRoom;
  onClick: (room: SiteChatRoom) => void;
};

function RoomItem({ room, onClick }: RoomItemProps) {
  const handleClick = () => {
    onClick(room);
  };

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={handleClick}>
        {room.site.club.logo ? (
          <ListItemIcon>
            <Avatar
              alt={`${room.site.club.name}`}
              src={`${room.site.club.logo}`}
            />
          </ListItemIcon>
        ) : null}
        <ListItemText primary={`${room.site.club.name}`} />
      </ListItemButton>
    </ListItem>
  );
}

export default function RoomList(props: RoomListProps) {
  const { sx, onSelect } = props;

  const { data } = useQuery<
    { listUserSiteChatRooms: SiteChatRoomPageInfo },
    QueryListUserSiteChatRoomsArgs
  >(LIST_SITE_ROOMS, {
    variables: {
      first: SITE_ROOMS_PAGE_SIZE,
      after: '',
    },
    fetchPolicy: 'no-cache',
  });

  console.log('rooms = ', data?.listUserSiteChatRooms.siteChatRooms);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', ...sx }}>
      <List
        sx={{ width: '100%', bgcolor: 'background.paper' }}
        aria-label="rooms"
      >
        {data?.listUserSiteChatRooms.siteChatRooms.map((room, i) => (
          <RoomItem key={room.id || i} room={room} onClick={onSelect} />
        ))}
      </List>
    </Box>
  );
}
