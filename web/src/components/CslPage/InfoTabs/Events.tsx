import * as React from 'react';
import {
  EventPageInfo,
  QueryListClubSportLocationEventsArgs,
} from '../../../generated/graphql';
import { SxProps, Theme, Box } from '@mui/material';
import { gql, useQuery } from '@apollo/client';
import EventAccordion from './EventAccordion';

const EVENT_PAGE_SIZE = 100;

const LIST_CLUB_SPORT_LOCATION_EVENTS = gql`
  query listClubSportLocationEvents($cslId: ID!, $first: Int!, $after: String) {
    listClubSportLocationEvents(cslId: $cslId, first: $first, after: $after) {
      events {
        id
        title
        description
        dateRFC3339
        image
      }
      endCursor
      hasNextPage
    }
  }
`;

export type EventsProps = {
  cslId: string;
  sx?: SxProps<Theme>;
};

export default function Events(props: EventsProps) {
  const { cslId, sx } = props;
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const { data } = useQuery<
    { listClubSportLocationEvents: EventPageInfo },
    QueryListClubSportLocationEventsArgs
  >(LIST_CLUB_SPORT_LOCATION_EVENTS, {
    skip: !cslId,
    variables: {
      cslId,
      first: EVENT_PAGE_SIZE,
      after: '',
    },
    fetchPolicy: 'no-cache',
  });

  const handleChange = (id: string, isExpanded: boolean) => {
    setExpanded(isExpanded ? id : false);
  };

  return (
    <Box sx={{ ...sx }}>
      {data?.listClubSportLocationEvents.events
        .filter((e) => e.id)
        .map((clubEvent, i) => (
          <EventAccordion
            key={clubEvent.id || i}
            event={clubEvent}
            expanded={expanded === clubEvent.id}
            onExpandedChange={handleChange}
          />
        ))}
    </Box>
  );
}
