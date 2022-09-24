import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  EventPageInfo,
  QueryListClubSportLocationEventsArgs,
} from '../../../generated/graphql';
import { SxProps, Theme, Box } from '@mui/material';
import IconTextCombo from '../../IconTextCombo';
import { gql, useQuery } from '@apollo/client';

const IMG_SIZE = 80;
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

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box sx={{ ...sx }}>
      {data?.listClubSportLocationEvents.events
        .filter((e) => e.id)
        .map(({ id, title, description, image, dateRFC3339 }) => (
          <Accordion
            key={id}
            expanded={expanded === id}
            onChange={handleChange(id || '')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${id}-content`}
              id={`${id}-header`}
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>
                {dateRFC3339}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <IconTextCombo
                size={IMG_SIZE}
                icon={image || undefined}
                text={description}
              />
            </AccordionDetails>
          </Accordion>
        ))}
    </Box>
  );
}
