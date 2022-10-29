import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, Fab, Grid, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useQuery, gql, useMutation } from '@apollo/client';
import appContext, { NotificationLevel } from '../../../context';
import {
  SitePageInfo,
  MutationDeleteClubArgs,
  QueryListSitesByClubArgs,
} from '../../../generated/graphql';
import { useNavigate, useParams } from 'react-router-dom';
import UserSiteCard from './UserClubSiteCard';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const CSL_PAGE_SIZE = 100;

const LIST_USER_CLUB_SPORT_LOCATION = gql`
  query listSitesByClub($clubId: ID!, $first: Int!, $after: String) {
    listSitesByClub(clubId: $clubId, first: $first, after: $after) {
      sites {
        id
        name
        sport {
          title
        }
        address
        phone
      }
      hasNextPage
      endCursor
    }
  }
`;

const DELETE_CSL = gql`
  mutation deleteSite($id: ID!) {
    deleteSite(id: $id)
  }
`;

const Container = styled(Box)<BoxProps>(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplate:
    "  \
    '   .     .      .       .     .    '  1em   \
    '   .    site    site     site    .    '  auto  \
    '   .     .      .       .     .    '  1fr   \
    '   .   back     .      add    .    '  auto  \
    '   .     .      .       .     .    '  2em   \
    /  10%  auto    1fr     auto   10%           \
  ",
}));

export default function UserSites() {
  const { notify } = React.useContext(appContext);
  const { id: clubId } = useParams();
  const navigate = useNavigate();

  const { data, refetch } = useQuery<
    { listSitesByClub: SitePageInfo },
    QueryListSitesByClubArgs
  >(LIST_USER_CLUB_SPORT_LOCATION, {
    skip: !clubId,
    variables: {
      clubId: clubId || '',
      first: CSL_PAGE_SIZE,
      after: '',
    },
    fetchPolicy: 'no-cache',
  });
  const [deleteSite] = useMutation<
    { deleteSite: boolean },
    MutationDeleteClubArgs
  >(DELETE_CSL);

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await deleteSite({
        variables: {
          id,
        },
      });
      await refetch();
    } catch (e) {
      notify({ level: NotificationLevel.ERROR, message: `${e}` });
    }
  };

  const handleBackClick = () => {
    navigate(`/profile/clubs/${clubId}`);
  };
  const handleAddClick = () => {
    navigate('new');
  };

  return (
    <Container>
      <Grid
        container
        spacing={2}
        sx={{
          gridArea: 'site',
          placeSelf: 'center',
          width: '100%',
        }}
      >
        {data?.listSitesByClub.sites.map((site, i) => (
          <Grid key={site.id || i} item xs={6}>
            <UserSiteCard site={site} onDelete={handleDelete} />
          </Grid>
        ))}
      </Grid>
      <Button
        sx={{ gridArea: 'back' }}
        variant="outlined"
        color="inherit"
        startIcon={<ChevronLeftIcon />}
        onClick={handleBackClick}
      >
        Back
      </Button>
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddClick}
        sx={{ gridArea: 'add', margin: 'auto' }}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
}
