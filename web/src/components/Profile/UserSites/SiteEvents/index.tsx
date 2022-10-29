import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, Fab, Grid, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useQuery, gql, useMutation } from '@apollo/client';
import appContext, { NotificationLevel } from '../../../../context';
import {
  EventPageInfo,
  MutationDeleteEventArgs,
  QueryListSiteEventsArgs,
} from '../../../../generated/graphql';
import { useNavigate, useParams } from 'react-router-dom';
import EventCard from './EventCard';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const EVENT_PAGE_SIZE = 10000;

const LIST_EVENTS = gql`
  query listSiteEvents($siteId: ID!, $first: Int!, $after: String) {
    listSiteEvents(siteId: $siteId, first: $first, after: $after) {
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
  mutation deleteEvent($siteId: ID!, $id: ID!) {
    deleteEvent(siteId: $siteId, id: $id)
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

export default function SiteEvents() {
  const { notify } = React.useContext(appContext);
  const { clubId, siteId } = useParams();
  const navigate = useNavigate();

  const { data, refetch } = useQuery<
    { listSiteEvents: EventPageInfo },
    QueryListSiteEventsArgs
  >(LIST_EVENTS, {
    skip: !siteId,
    variables: {
      siteId: siteId || '',
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
    if (!siteId) return;
    try {
      await deleteEvent({
        variables: {
          siteId,
          id,
        },
      });
      await refetch();
    } catch (e) {
      notify({ level: NotificationLevel.ERROR, message: `${e}` });
    }
  };

  const handleBackClick = () => {
    navigate(`/profile/clubs/${clubId}/sites/${siteId}`);
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
        {data?.listSiteEvents.events.map((clubEvent, i) => (
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
