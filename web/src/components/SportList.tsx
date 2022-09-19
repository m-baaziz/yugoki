import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, Button, TextField, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import {
  ClubSportLocationSearchQueryInput,
  QueryListSportsArgs,
  Sport,
  SportPageInfo,
} from '../generated/graphql';
import { DEFAULT_QUERY, encodeQuery, QUERY_KEY } from '../utils/searchQuery';

const SEARCH_DELAY_MS = 500;
const SPORTS_PAGE_SIZE = 100;

const Container = styled(Box)<BoxProps>(() => ({
  width: '100%',
  height: '100%',
  display: 'grid',
  gridTemplate:
    "  \
    '   .        .         .    '  1em  \
    '   .      search      .    '  auto \
    '   .        .         .    '  4em  \
    '   .      list        .    '  auto  \
    '   .        .         .    '  3em  \
    '   .      title       .    '  auto \
    '   .        .         .    '  1em  \
    '   .   description    .    '  auto \
    '   .        .         .    '  1fr  \
    '   .     select       .    '  auto \
    '   .        .         .    '  3em  \
    /  1em      1fr       1em           \
  ",
}));

const LIST_SPORTS = gql`
  query listSports($first: Int!, $after: String) {
    listSports(first: $first, after: $after) {
      sports {
        id
        title
        description
        tags
      }
      hasNextPage
      endCursor
    }
  }
`;

const SearchContainer = styled(Box)<BoxProps>(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'flex-end',
  gridArea: 'search',
}));

const filterSport: (search: string) => (sport: Sport) => boolean =
  (search: string) => (sport: Sport) => {
    const lowercaseSearch = search.toLowerCase();
    return (
      search.length === 0 ||
      sport.title.toLowerCase().includes(lowercaseSearch) ||
      sport.tags.some((tag) => tag.toLowerCase().includes(lowercaseSearch))
    );
  };

const sportIconPath: (sport: Sport) => string = (sport: Sport) => {
  const titleKebabCase = sport.title.toLocaleLowerCase().replaceAll(' ', '-');
  return `/icons/80/${titleKebabCase}.png`;
};

export default function SportList() {
  const navigate = useNavigate();
  const { data } = useQuery<{ listSports: SportPageInfo }, QueryListSportsArgs>(
    LIST_SPORTS,
    {
      variables: {
        first: SPORTS_PAGE_SIZE,
        after: '',
      },
      fetchPolicy: 'no-cache',
    },
  );
  const [selectedSport, setSelectedSport] = React.useState<Sport | undefined>(
    undefined,
  );
  const [search, setSearch] = React.useState<string>('');
  const [searchInputValue, setSearchInputValue] = React.useState<string>('');
  const [searchTimeout, setSearchTimeout] = React.useState<
    NodeJS.Timeout | undefined
  >(undefined);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setSearchInputValue(value);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    const timeout = setTimeout(() => {
      setSearch(value);
    }, SEARCH_DELAY_MS);
    setSearchTimeout(timeout);
  };

  const filteredSports = React.useMemo(
    () => data?.listSports.sports.filter(filterSport(search)) || [],
    [data, search],
  );

  const handleSelectClick = () => {
    if (!selectedSport?.id) return;
    const query: ClubSportLocationSearchQueryInput = {
      sport: selectedSport?.id || '',
      address: DEFAULT_QUERY.address,
    };
    const encodedQuery = encodeQuery(query);
    const url = `/clubs?${QUERY_KEY}=${encodedQuery}`;
    navigate(url);
  };

  return (
    <Container>
      <SearchContainer>
        <Search sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
        <TextField
          id="input-with-sx"
          variant="standard"
          fullWidth
          value={searchInputValue}
          onChange={handleSearchChange}
        />
      </SearchContainer>
      <Box
        sx={{
          gridArea: 'list',
          display: 'grid',
          width: '100%',
          gridTemplateColumns: 'repeat(auto-fill, 100px)',
          placeContent: 'space-between',
          gridGap: '10px 10px',
        }}
      >
        {filteredSports.map((sport, i) => (
          <Button
            key={sport.id || i}
            onClick={() => {
              setSelectedSport(sport);
            }}
            aria-label={sport.title}
            variant="outlined"
            sx={{
              borderColor:
                selectedSport?.id === sport.id ? 'default' : grey['300'],
            }}
          >
            <img
              src={sportIconPath(sport)}
              alt={sport.title}
              width={80}
              height={80}
            />
          </Button>
        ))}
      </Box>
      <Typography
        variant="h2"
        sx={{ gridArea: 'title', placeSelf: 'center' }}
        component="div"
      >
        {selectedSport?.title}
      </Typography>
      <Typography sx={{ gridArea: 'description' }} component="div">
        {selectedSport?.description}
      </Typography>
      {selectedSport ? (
        <Box sx={{ gridArea: 'select', placeSelf: 'center' }}>
          <Button variant="contained" onClick={handleSelectClick}>
            Select
          </Button>
        </Box>
      ) : null}
    </Container>
  );
}
