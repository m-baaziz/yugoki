import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, TextField } from '@mui/material';
import { useQuery, gql } from '@apollo/client';
import {
  QuerySearchClubSportLocationsArgs,
  ClubSportLocationPageInfo,
  SearchArea,
  ClubSportLocationSearchQueryInput,
} from '../generated/graphql';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  decodeQuery,
  QUERY_KEY,
  DEFAULT_QUERY,
  encodeQuery,
} from '../utils/searchQuery';
import CslCard from './CslCard';
import CslMap from './CslMap';

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
    '   .        .      .      .     .    '  1em  \
    '   .      search search search  .    '  auto  \
    '   .        .      .      .     .    '  1em  \
    '   .      lines    .     map    .    '  1fr  \
    '   .        .      .      .     .    '  1em  \
    /  10%      1fr    4em   auto   10%           \
  ",
}));

const SearchContainer = styled(Box)<BoxProps>(() => ({
  gridArea: 'search',
  display: 'flex',
  width: '100%',
  height: '100%',
}));

const ListContainer = styled(Box)<BoxProps>(() => ({
  gridArea: 'lines',
  display: 'flex',
  width: '100%',
  height: '100%',
}));

const MapContainer = styled(Box)<BoxProps>(() => ({
  gridArea: 'map',
  display: 'flex',
  width: '100%',
  height: '100%',
}));

export default function CslList() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [searchArea, setSearchArea] = React.useState<SearchArea | undefined>(
    undefined,
  );
  const [searchInput, setSearchInput] = React.useState('');
  const [mapQuery, setMapQuery] =
    React.useState<ClubSportLocationSearchQueryInput>();

  const query = React.useMemo(() => {
    const params = new window.URLSearchParams(search);
    const queryStr = params.get(QUERY_KEY);
    return queryStr ? decodeQuery(queryStr) : DEFAULT_QUERY;
  }, [search]);

  const changeQuery = React.useMemo(
    () => (newQuery: ClubSportLocationSearchQueryInput) => {
      const encodedQuery = encodeQuery(newQuery);
      const url = `/clubs?${QUERY_KEY}=${encodedQuery}`;
      navigate(url);
    },
    [navigate],
  );

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

  React.useEffect(() => {
    if (!searchArea) return;
    changeQuery({
      ...query,
      area: searchArea,
    });
  }, [searchArea]);

  // initial search query => map computes center from query.address => boundaries are changes
  // => query is changed =>

  React.useEffect(() => {
    if (!searchInput && query.address) {
      setSearchInput(query.address || '');
    }
  }, [query]);

  React.useEffect(() => {
    if (!query) return;
    if (!mapQuery || mapQuery.address !== query.address) {
      setMapQuery(query);
    }
  }, [query, mapQuery]);

  const onMapChange = (
    topLeftLat: number,
    topLeftLon: number,
    bottomRightLat: number,
    bottomRightLon: number,
  ) => {
    setSearchArea({
      topLeftLat,
      topLeftLon,
      bottomRightLat,
      bottomRightLon,
    });
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
  const handleSearchInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    changeQuery({
      ...query,
      address: searchInput,
      area: undefined,
    });
  };

  return (
    <Container>
      <SearchContainer>
        <form onSubmit={handleSearchInputSubmit} style={{ width: '100%' }}>
          <TextField
            label="search"
            variant="outlined"
            value={searchInput}
            onChange={handleSearchInputChange}
            autoComplete="off"
            fullWidth
          />
        </form>
      </SearchContainer>
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
      <MapContainer>
        <CslMap
          locations={data?.searchClubSportLocations.clubSportLocations || []}
          onChange={onMapChange}
          query={mapQuery}
        />
      </MapContainer>
    </Container>
  );
}
