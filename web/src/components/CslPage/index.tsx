import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, CircularProgress, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import {
  QueryGetClubSportLocationArgs,
  ClubSportLocation,
} from '../../generated/graphql';

import ContactInfos from './ContactInfos';
import IconTextCombo from '../IconTextCombo';
import InfoTabs from './InfoTabs';
import Images from './Images';

const ICON_SIZE = 20;

const GET_CLUB_SPORT_LOCATION = gql`
  query getClubSportLocation($id: ID!) {
    getClubSportLocation(id: $id) {
      id
      club {
        name
        logo
      }
      address
      phone
      website
      images
      description
      activities {
        name
        description
        icon
      }
      trainers {
        id
        firstname
        lastname
        displayname
        description
        photo
      }
      schedule {
        title
        fromDay
        toDay
        fromTime
        toTime
      }
    }
  }
`;

const Container = styled(Box)<BoxProps>(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplate: `  \
    '   .           .              .    '  2em   \
    '   .          name            .    '  ${ICON_SIZE}px  \
    '   .           .              .    '  1em   \
    '   .         contact          .    '  auto  \
    '   .           .              .    '  2em   \
    '   .         images           .    '  auto  \
    '   .           .              .    '  2em   \
    '   .       description        .    '  auto  \
    '   .           .              .    '  2em   \
    '   .          info            .    '  auto  \
    '   .        schedule          .    '  1fr   \
    '   .           .              .    '  1em   \
    /   5%         1fr             5%            \
  `,
}));

export default function CslPage() {
  const { id: cslId } = useParams();

  const { data } = useQuery<
    { getClubSportLocation: ClubSportLocation },
    QueryGetClubSportLocationArgs
  >(GET_CLUB_SPORT_LOCATION, {
    skip: !cslId,
    variables: {
      id: cslId || '',
    },
    fetchPolicy: 'no-cache',
  });

  console.log('data = ', data);

  return (
    <Container>
      {data?.getClubSportLocation ? (
        <>
          <Box
            sx={{
              gridArea: 'name',
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <IconTextCombo
              icon={data.getClubSportLocation.club.logo || undefined}
              size={20}
              text={
                <Typography
                  variant="h6"
                  sx={{
                    lineHeight: `${ICON_SIZE}px`,
                    alignContent: 'center',
                    marginLeft: 1,
                  }}
                >
                  {data.getClubSportLocation.club.name}
                </Typography>
              }
            />
          </Box>
          <Box
            sx={{
              gridArea: 'contact',
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <ContactInfos
              address={data.getClubSportLocation.address}
              phone={data.getClubSportLocation.phone}
              web={data.getClubSportLocation.website || undefined}
            />
          </Box>
          <Images
            images={data.getClubSportLocation.images}
            sx={{ gridArea: 'images', height: '100%', width: '100%' }}
          />
          <Box
            sx={{
              gridArea: 'description',
              height: '100%',
              width: '100%',
            }}
          >
            {data.getClubSportLocation.description}
          </Box>
          <InfoTabs
            sx={{
              gridArea: 'info',
              height: '100%',
              width: '100%',
            }}
            csl={data.getClubSportLocation}
          />
        </>
      ) : (
        <CircularProgress />
      )}
    </Container>
  );
}
