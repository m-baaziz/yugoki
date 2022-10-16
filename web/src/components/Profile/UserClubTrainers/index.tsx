import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, Fab, Grid, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useQuery, gql, useMutation } from '@apollo/client';
import appContext, { NotificationLevel } from '../../../context';
import {
  TrainerPageInfo,
  QueryListTrainersByClubArgs,
  MutationDeleteTrainerArgs,
} from '../../../generated/graphql';
import { useNavigate, useParams } from 'react-router-dom';
import UserClubTrainerCard from './UserClubTrainerCard';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const TRAINERS_PAGE_SIZE = 100;

const LIST_TRAINERS = gql`
  query listTrainersByClub($clubId: ID!, $first: Int!, $after: String) {
    listTrainersByClub(clubId: $clubId, first: $first, after: $after) {
      trainers {
        id
        firstname
        lastname
        displayname
        description
        photo
      }
      hasNextPage
      endCursor
    }
  }
`;

const DELETE_TRAINER = gql`
  mutation deleteTrainer($id: ID!) {
    deleteTrainer(id: $id)
  }
`;

const Container = styled(Box)<BoxProps>(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplate:
    "  \
    '   .        .         .       .       .    '  1em   \
    '   .    trainers  trainers  trainers  .    '  auto  \
    '   .        .         .       .       .    '  1fr   \
    '   .        .         .       .       .    '  2em   \
    '   .      back        .      add      .    '  auto  \
    '   .        .         .       .       .    '  2em   \
    /  10%     auto       1fr     auto     10%           \
  ",
}));

export default function UserClubTrainers() {
  const { notify } = React.useContext(appContext);
  const { id: clubId } = useParams();
  const navigate = useNavigate();

  const { data, refetch } = useQuery<
    { listTrainersByClub: TrainerPageInfo },
    QueryListTrainersByClubArgs
  >(LIST_TRAINERS, {
    skip: !clubId,
    variables: {
      clubId: clubId || '',
      first: TRAINERS_PAGE_SIZE,
      after: '',
    },
    fetchPolicy: 'no-cache',
  });
  const [deleteTrainer] = useMutation<
    { deleteTrainer: boolean },
    MutationDeleteTrainerArgs
  >(DELETE_TRAINER);

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await deleteTrainer({
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
          gridArea: 'trainers',
          placeSelf: 'center',
          width: '100%',
        }}
      >
        {data?.listTrainersByClub.trainers.map((trainer, i) => (
          <Grid key={trainer.id || i} item xs={4}>
            <UserClubTrainerCard trainer={trainer} onDelete={handleDelete} />
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
