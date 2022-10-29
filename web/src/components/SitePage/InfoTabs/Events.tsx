import * as React from 'react';
import {
  EventPageInfo,
  QueryListSiteEventsArgs,
} from '../../../generated/graphql';
import { SxProps, Theme, Box } from '@mui/material';
import { gql, useQuery } from '@apollo/client';
import EventAccordion from './EventAccordion';

const EVENT_PAGE_SIZE = 100;

const LIST_CLUB_SPORT_LOCATION_EVENTS = gql`
  query listSiteEvents($siteId: ID!, $first: Int!, $after: String) {
    listSiteEvents(siteId: $siteId, first: $first, after: $after) {
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
  siteId: string;
  sx?: SxProps<Theme>;
};

export default function Events(props: EventsProps) {
  const { siteId, sx } = props;
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const { data } = useQuery<
    { listSiteEvents: EventPageInfo },
    QueryListSiteEventsArgs
  >(LIST_CLUB_SPORT_LOCATION_EVENTS, {
    skip: !siteId,
    variables: {
      siteId,
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
      {data?.listSiteEvents.events
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
