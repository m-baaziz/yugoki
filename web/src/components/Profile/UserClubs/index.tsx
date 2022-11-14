import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, Fab, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useQuery, gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import appContext, { NotificationLevel } from '../../../context';
import {
  ClubPageInfo,
  MutationDeleteClubArgs,
  QueryListUserClubsArgs,
} from '../../../generated/graphql';
import UserClubCard from './UserClubCard';

const CLUBS_PAGE_SIZE = 100;

const LIST_USER_CLUBS = gql`
  query listUserClubs($first: Int!, $after: String) {
    listUserClubs(first: $first, after: $after) {
      clubs {
        id
        name
        logo
      }
      hasNextPage
      endCursor
    }
  }
`;

const DELETE_CLUB = gql`
  mutation deleteClub($id: ID!) {
    deleteClub(id: $id)
  }
`;

const Container = styled(Box)<BoxProps>(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplate:
    "  \
    '   .        .       .     .    '  1em   \
    '   .      clubs   clubs   .    '  auto  \
    '   .        .       .     .    '  1fr   \
    '   .        .      add    .    '  auto  \
    '   .        .       .     .    '  2em   \
    /  10%      1fr     auto   10%           \
  ",
}));

export default function UserClubs() {
  const { notify } = React.useContext(appContext);
  const navigate = useNavigate();

  const { data, refetch } = useQuery<
    { listUserClubs: ClubPageInfo },
    QueryListUserClubsArgs
  >(LIST_USER_CLUBS, {
    variables: {
      first: CLUBS_PAGE_SIZE,
      after: '',
    },
    fetchPolicy: 'no-cache',
  });

  const [deleteClub] = useMutation<
    { deleteClub: boolean },
    MutationDeleteClubArgs
  >(DELETE_CLUB);

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await deleteClub({
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
          gridArea: 'clubs',
          placeSelf: 'center',
          width: '100%',
        }}
      >
        {data?.listUserClubs.clubs.map((club, i) => (
          <Grid key={club.id || i} item xs={6}>
            <UserClubCard club={club} onDelete={handleDelete} />
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
