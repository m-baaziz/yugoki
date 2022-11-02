/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, Button, TextField } from '@mui/material';
import { useQuery, gql } from '@apollo/client';
import {
  QuerySearchSitesArgs,
  SitePageInfo,
  SearchArea,
  SiteSearchQueryInput,
  Site,
} from '../../generated/graphql';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  decodeQuery,
  QUERY_KEY,
  DEFAULT_QUERY,
  encodeQuery,
} from '../../utils/searchQuery';
import SiteCard from './SiteCard';
import SiteMap, { ControlPosition, MapQuery, Position } from './SiteMap';
import MyLocationIcon from '@mui/icons-material/MyLocation';

const CSL_PAGE_SIZE = 100;

const LIST_CLUB_SPORT_LOCATIONS = gql`
  query searchSites(
    $query: SiteSearchQueryInput!
    $first: Int!
    $after: String
  ) {
    searchSites(query: $query, first: $first, after: $after) {
      sites {
        id
        club {
          name
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

const siteToLatLng = (site: Site): Position => {
  return { lat: site.lat, lon: site.lon };
};

const Container = styled(Box)<BoxProps>(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplate:
    "  \
    '   .        .        .    '  1em  \
    '   .      search     .    '  auto  \
    '   .        .        .    '  2em  \
    '   .      results    .    '  1fr  \
    '   .        .        .    '  1em  \
    /  10%      1fr      10%           \
  ",
}));

export default function SiteList() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [searchArea, setSearchArea] = React.useState<SearchArea | undefined>(
    undefined,
  );
  const [searchInput, setSearchInput] = React.useState<string | undefined>(
    undefined,
  );
  const [mapQuery, setMapQuery] = React.useState<MapQuery>();
  const [mapCenter, setMapCenter] = React.useState<Position | undefined>(
    undefined,
  );

  const query = React.useMemo(() => {
    const params = new window.URLSearchParams(search);
    const queryStr = params.get(QUERY_KEY);
    return queryStr ? decodeQuery(queryStr) : DEFAULT_QUERY;
  }, [search]);

  const changeQuery = React.useMemo(
    () => (newQuery: SiteSearchQueryInput) => {
      const encodedQuery = encodeQuery(newQuery);
      const url = `/sites?${QUERY_KEY}=${encodedQuery}`;
      navigate(url);
    },
    [navigate],
  );

  const { data } = useQuery<
    { searchSites: SitePageInfo },
    QuerySearchSitesArgs
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

  React.useEffect(() => {
    if (searchInput === undefined && query.address) {
      setSearchInput(query.address || '');
    }
  }, [searchInput, setSearchInput, query]);

  React.useEffect(() => {
    if (!query) return;
    if (!mapQuery || mapQuery.address !== query.address) {
      setMapQuery({
        address: query.address || '',
        area: query.area || undefined,
      });
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
  const handleSiteClick = (siteId: string) => {
    navigate(`/sites/${siteId}`);
  };

  const handleMyLocationClick = () => {
    try {
      window.navigator.geolocation.getCurrentPosition((pos) => {
        changeQuery({
          ...query,
          address: '', // bug when empty address
          area: undefined,
        });
        setMapCenter({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container>
      <Box sx={{ gridArea: 'search' }}>
        <form onSubmit={handleSearchInputSubmit} style={{ width: '100%' }}>
          <TextField
            label="search"
            variant="outlined"
            value={searchInput || ''}
            onChange={handleSearchInputChange}
            autoComplete="off"
            fullWidth
          />
        </form>
      </Box>
      <Box
        sx={{
          gridArea: 'results',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap-reverse',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <Box>
          {data?.searchSites.sites
            .filter((site) => site.id)
            .map((site) => (
              <SiteCard
                key={site.id!}
                id={site.id!}
                name={site.club.name}
                address={site.address}
                onClick={handleSiteClick}
                sx={{ cursor: 'pointer' }}
              />
            ))}
        </Box>
        <Box>
          <SiteMap
            positions={data?.searchSites.sites.map(siteToLatLng) || []}
            onChange={onMapChange}
            query={mapQuery}
            centerPosition={mapCenter}
            controls={[
              {
                element: (
                  <Button
                    variant="contained"
                    aria-label="center"
                    onClick={handleMyLocationClick}
                  >
                    <MyLocationIcon />
                  </Button>
                ),
                position: ControlPosition.RIGHT_BOTTOM,
              },
            ]}
          />
        </Box>
      </Box>
    </Container>
  );
}
