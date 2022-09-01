import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps } from '@mui/material';
import { useQuery, gql } from '@apollo/client';
import {
  QuerySearchClubSportLocationsArgs,
  ClubSportLocationPageInfo,
} from '../generated/graphql';
import { useLocation } from 'react-router-dom';
import { decodeQuery, QUERY_KEY, DEFAULT_QUERY } from '../utils/searchQuery';
import CslCard from './CslCard';

const CSL_PAGE_SIZE = 100;

const LIST_CLUB_SPORT_LOCATIONS = gql`
  query searchClubSportLocations(
    $query: ClubSportLocationSearchQueryInput!
    $first: Int!
    $after: String
  ) {
    searchClubSportLocations(query: $query, first: $first, after: $after) {
      clubSportLocations {
        id
        club {
          name
          subtitle
        }
        address
        lat
        lon
      }
      hasNextPage
      endCursor
    }
  }
`;

const Container = styled(Box)<BoxProps>(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplate:
    "  \
    '   .        .         .    '  1em  \
    '   .      lines       .    '  1fr  \
    '   .        .         .    '  1em  \
    /  10%      1fr       10%           \
  ",
}));

const ListContainer = styled(Box)<BoxProps>(() => ({
  gridArea: 'lines',
  display: 'flex',
  width: '100%',
  height: '100%',
}));

export default function ClubSportLocationList() {
  const { search } = useLocation();
  const query = React.useMemo(() => {
    const params = new window.URLSearchParams(search);
    const queryStr = params.get(QUERY_KEY);
    return queryStr ? decodeQuery(queryStr) : DEFAULT_QUERY;
  }, [search]);

  const { data } = useQuery<
    { searchClubSportLocations: ClubSportLocationPageInfo },
    QuerySearchClubSportLocationsArgs
  >(LIST_CLUB_SPORT_LOCATIONS, {
    variables: {
      query,
      first: CSL_PAGE_SIZE,
      after: '',
    },
    fetchPolicy: 'no-cache',
  });

  console.log('csl list = ', data);
  return (
    <Container>
      <ListContainer>
        {data?.searchClubSportLocations.clubSportLocations.map((csl, i) => (
          <CslCard
            key={csl.id || i}
            name={csl.club.name}
            subtitle={csl.club.subtitle}
            address={csl.address}
          />
        ))}
      </ListContainer>
    </Container>
  );
}
