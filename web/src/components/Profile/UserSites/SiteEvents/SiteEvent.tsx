import * as React from 'react';
import { Box, styled, BoxProps } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Event, QueryGetEventArgs } from '../../../../generated/graphql';
import EventForm from './EventForm';
import { useGetFile } from '../../../../hooks/fileUpload';
import { FileInfo } from '../../../ImagesForm';

const GET_EVENT = gql`
  query getEvent($siteId: ID!, $id: ID!) {
    getEvent(siteId: $siteId, id: $id) {
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

export default function SiteEvent() {
  const { siteId, id } = useParams();

  const { data: eventData } = useQuery<{ getEvent: Event }, QueryGetEventArgs>(
    GET_EVENT,
    {
      skip: !id || !siteId,
      variables: {
        siteId: siteId || '',
        id: id || '',
      },
      fetchPolicy: 'no-cache',
    },
  );
  const { data: eventImageData } = useGetFile(
    eventData?.getEvent.image || undefined,
  );

  const images = React.useMemo<FileInfo[]>(
    () =>
      eventImageData && eventImageData.getFileUpload.url
        ? [{ url: eventImageData.getFileUpload.url, isNew: false }]
        : [],
    [eventImageData],
  );

  return (
    <Container>
      {eventData?.getEvent ? (
        <EventForm
          details={eventData?.getEvent}
          images={images}
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
