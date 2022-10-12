import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, Fab, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useQuery, gql, useMutation } from '@apollo/client';
import appContext, { NotificationLevel } from '../../../context';
import {
  ClubSportLocationPageInfo,
  MutationDeleteClubArgs,
  QueryListClubSportLocationsByClubArgs,
} from '../../../generated/graphql';
import { useNavigate, useParams } from 'react-router-dom';
import UserClubSportLocationCard from './UserClubSportLocationCard';

const CSL_PAGE_SIZE = 100;

const LIST_USER_CLUB_SPORT_LOCATION = gql`
  query listClubSportLocationsByClub(
    $clubId: ID!
    $first: Int!
    $after: String
  ) {
    listClubSportLocationsByClub(
      clubId: $clubId
      first: $first
      after: $after
    ) {
      clubSportLocations {
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
  mutation deleteClubSportLocation($id: ID!) {
    deleteClubSportLocation(id: $id)
  }
`;

const Container = styled(Box)<BoxProps>(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplate:
    "  \
    '   .        .       .     .    '  1em   \
    '   .       csl     csl    .    '  auto  \
    '   .        .       .     .    '  1fr   \
    '   .        .      add    .    '  auto  \
    '   .        .       .     .    '  2em   \
    /  10%      1fr     auto   10%           \
  ",
}));

export default function UserClubSportLocations() {
  const { notify } = React.useContext(appContext);
  const { id: clubId } = useParams();
  const navigate = useNavigate();

  const { data, refetch } = useQuery<
    { listClubSportLocationsByClub: ClubSportLocationPageInfo },
    QueryListClubSportLocationsByClubArgs
  >(LIST_USER_CLUB_SPORT_LOCATION, {
    skip: !clubId,
    variables: {
      clubId: clubId || '',
      first: CSL_PAGE_SIZE,
      after: '',
    },
    fetchPolicy: 'no-cache',
  });
  const [deleteClubSportLocation] = useMutation<
    { deleteClubSportLocation: boolean },
    MutationDeleteClubArgs
  >(DELETE_CSL);

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await deleteClubSportLocation({
        variables: {
          id,
        },
      });
      await refetch();
    } catch (e) {
      notify({ level: NotificationLevel.ERROR, message: `${e}` });
    }
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
          gridArea: 'csl',
          placeSelf: 'center',
          width: '100%',
        }}
      >
        {data?.listClubSportLocationsByClub.clubSportLocations.map((csl, i) => (
          <Grid key={csl.id || i} item xs={6}>
            <UserClubSportLocationCard
              clubSportLocation={csl}
              onDelete={handleDelete}
            />
          </Grid>
        ))}
      </Grid>
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
