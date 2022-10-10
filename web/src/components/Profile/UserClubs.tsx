import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  BoxProps,
  Button,
  Card,
  CardActions,
  CardContent,
  Fab,
  Grid,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useQuery, gql, useMutation } from '@apollo/client';
import appContext, { NotificationLevel } from '../../context';
import {
  Club,
  ClubPageInfo,
  MutationCreateClubArgs,
  MutationDeleteClubArgs,
  QueryListUserClubsArgs,
} from '../../generated/graphql';
import UserClubCard from './UserClubCard';
import LabelInputCombo from '../LabelInputCombo';

const CLUBS_PAGE_SIZE = 100;
const NEW_CLUB_DEFAULT_NAME = 'New Club';

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

const CREATE_CLUB = gql`
  mutation createClub($name: String!) {
    createClub(name: $name) {
      id
      name
      logo
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
  const [addMode, setAddMode] = React.useState(false);
  const [newClubName, setNewClubName] = React.useState(NEW_CLUB_DEFAULT_NAME);

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
  const [createClub] = useMutation<
    { createClub: Club },
    MutationCreateClubArgs
  >(CREATE_CLUB);
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
    setAddMode(true);
  };

  const handleNewClubNameInputChange = (name: string) => {
    setNewClubName(name);
  };

  const handleValidateNewClub = async () => {
    setAddMode(false);
    try {
      await createClub({
        variables: {
          name: newClubName,
        },
      });
      await refetch();
      setNewClubName(NEW_CLUB_DEFAULT_NAME);
    } catch (e) {
      notify({ level: NotificationLevel.ERROR, message: `${e}` });
    }
  };

  const handleCancelNewClub = () => {
    setAddMode(false);
    setNewClubName(NEW_CLUB_DEFAULT_NAME);
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
        {addMode ? (
          <Grid item xs={6}>
            <Card>
              <CardContent sx={{ display: 'flex' }}>
                <LabelInputCombo
                  value={newClubName}
                  inputLabel="name"
                  onChange={handleNewClubNameInputChange}
                  sx={{ margin: 'auto' }}
                >
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{ margin: 'auto' }}
                  >
                    {newClubName}
                  </Typography>
                </LabelInputCombo>
              </CardContent>
              <CardActions
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}
              >
                <Button
                  size="small"
                  onClick={handleValidateNewClub}
                  color="success"
                  disabled={newClubName.length === 0}
                >
                  Validate
                </Button>
                <Button
                  size="small"
                  onClick={handleCancelNewClub}
                  color="inherit"
                >
                  Cancel
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ) : null}
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
