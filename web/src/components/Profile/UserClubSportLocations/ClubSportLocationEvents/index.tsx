import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, Fab, Grid, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useQuery, gql, useMutation } from '@apollo/client';
import appContext, { NotificationLevel } from '../../../../context';
import {
  EventPageInfo,
  MutationDeleteEventArgs,
  QueryListClubSportLocationEventsArgs,
} from '../../../../generated/graphql';
import { useNavigate, useParams } from 'react-router-dom';
import EventCard from './EventCard';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const EVENT_PAGE_SIZE = 10000;

const LIST_EVENTS = gql`
  query listClubSportLocationEvents($cslId: ID!, $first: Int!, $after: String) {
    listClubSportLocationEvents(cslId: $cslId, first: $first, after: $after) {
      events {
        id
        dateRFC3339
        title
        description
        image
      }
      hasNextPage
      endCursor
    }
  }
`;

const DELETE_EVENT = gql`
  mutation deleteEvent($id: ID!) {
    deleteEvent(id: $id)
  }
`;

const Container = styled(Box)<BoxProps>(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplate:
    "  \
    '   .        .        .       .     .    '  1em   \
    '   .     events   events   events  .    '  auto  \
    '   .        .        .       .     .    '  1fr   \
    '   .       back      .      add    .    '  auto  \
    '   .        .        .       .     .    '  2em   \
    /  10%     auto      1fr     auto   10%           \
  ",
}));

export default function ClubSportLocationEvents() {
  const { notify } = React.useContext(appContext);
  const { clubId, cslId } = useParams();
  const navigate = useNavigate();

  const { data, refetch } = useQuery<
    { listClubSportLocationEvents: EventPageInfo },
    QueryListClubSportLocationEventsArgs
  >(LIST_EVENTS, {
    skip: !cslId,
    variables: {
      cslId: cslId || '',
      first: EVENT_PAGE_SIZE,
      after: '',
    },
    fetchPolicy: 'no-cache',
  });
  const [deleteEvent] = useMutation<
    { deleteEvent: boolean },
    MutationDeleteEventArgs
  >(DELETE_EVENT);

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await deleteEvent({
        variables: {
          id,
        },
      });
      await refetch();
    } catch (e) {
      notify({ level: NotificationLevel.ERROR, message: `${e}` });
    }
  };

  const handleBackClick = () => {
    navigate(`/profile/clubs/${clubId}/locations/${cslId}`);
  };
  const handleAddClick = () => {
    navigate('new');
  };

  return (
    <Container>
      <Grid
        container
        spacing={2}
        sx={{
          gridArea: 'events',
          placeSelf: 'center',
          width: '100%',
        }}
      >
        {data?.listClubSportLocationEvents.events.map((clubEvent, i) => (
          <Grid key={clubEvent.id || i} item xs={6}>
            <EventCard clubEvent={clubEvent} onDelete={handleDelete} />
          </Grid>
        ))}
      </Grid>
      <Button
        sx={{ gridArea: 'back' }}
        variant="outlined"
        color="inherit"
        startIcon={<ChevronLeftIcon />}
        onClick={handleBackClick}
      >
        Back
      </Button>
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddClick}
        sx={{ gridArea: 'add', margin: 'auto' }}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
}
