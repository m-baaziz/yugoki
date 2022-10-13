import * as React from 'react';
import { Box, styled, BoxProps } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Event, QueryGetSubscriptionArgs } from '../../../../generated/graphql';
import EventForm from './EventForm';

const GET_EVENT = gql`
  query getEvent($id: ID!) {
    getEvent(id: $id) {
      id
      dateRFC3339
      title
      description
      image
    }
  }
`;

const Container = styled(Box)<BoxProps>(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplate:
    "  \
    '   .        .         .    '  4em  \
    '   .       info       .    '  1fr  \
    '   .        .         .    '  1em  \
    /  10%      1fr       10%           \
  ",
}));

export default function ClubSportLocationEvent() {
  const { id } = useParams();

  const { data: eventData } = useQuery<
    { getEvent: Event },
    QueryGetSubscriptionArgs
  >(GET_EVENT, {
    skip: !id,
    variables: {
      id: id || '',
    },
    fetchPolicy: 'no-cache',
  });

  return (
    <Container>
      {eventData?.getEvent ? (
        <EventForm
          details={eventData?.getEvent}
          readOnly
          sx={{
            gridArea: 'info',
            placeSelf: 'center',
            width: '100%',
            height: '100%',
          }}
        />
      ) : null}
    </Container>
  );
}
