/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */

import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, Button, Stack, TextField } from '@mui/material';
import { gql, useMutation } from '@apollo/client';
import {
  MutationCreateTrainerArgs,
  Trainer,
  TrainerInput,
} from '../../../generated/graphql';
import ImagesForm from '../ImagesForm';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate, useParams } from 'react-router-dom';
import appContext, { NotificationLevel } from '../../../context';

const DEFAULT_TRAINER: TrainerInput = {
  firstname: '',
  lastname: '',
  displayname: '',
  description: '',
  photo: undefined,
};

const CREATE_TRAINER = gql`
  mutation createTrainer($clubId: ID!, $input: TrainerInput!) {
    createTrainer(clubId: $clubId, input: $input) {
      id
      displayname
    }
  }
`;

const Container = styled(Box)<BoxProps>(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplate:
    "  \
    '   .        .       .       .       .      '  1em  \
    '   .      form    form    form      .      '  auto \
    '   .        .       .       .       .      '  1fr  \
    '   .        .       .       .       .      '  2em  \
    '   .     cancel     .     submit    .      '  auto \
    '   .        .       .       .       .      '  1em  \
    /  10%      auto     1fr    auto    10%             \
  ",
}));

export default function ClubTrainerForm() {
  const { notify } = React.useContext(appContext);
  const [trainerInput, setTrainerInput] =
    React.useState<TrainerInput>(DEFAULT_TRAINER);
  const { id: clubId } = useParams();
  const navigate = useNavigate();

  const [createTrainer] = useMutation<
    { createTrainer: Trainer },
    MutationCreateTrainerArgs
  >(CREATE_TRAINER);

  const handleTextInputChange =
    (key: keyof TrainerInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setTrainerInput({ ...trainerInput, [key]: e.target.value });
    };
  const handleImagesChange = (urls: string[]) => {
    setTrainerInput({
      ...trainerInput,
      photo: urls.length === 0 ? undefined : urls[0],
    });
  };

  const handleBackClick = () => {
    navigate(`/profile/clubs/${clubId}/trainers`);
  };

  const handleSubmitClick = async () => {
    try {
      if (!clubId) return;
      const result = await createTrainer({
        variables: {
          clubId,
          input: trainerInput,
        },
      });
      notify({
        level: NotificationLevel.SUCCESS,
        message: `created ${result.data?.createTrainer.displayname}`,
      });
      navigate(`/profile/clubs/${clubId}/trainers`);
    } catch (e) {
      notify({ level: NotificationLevel.ERROR, message: `${e}` });
    }
  };

  return (
    <Container>
      <Stack
        spacing={5}
        sx={{
          gridArea: 'form',
          placeSelf: 'center',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
          <TextField
            id="firstname"
            label="first name"
            variant="standard"
            required
            value={trainerInput.firstname}
            onChange={handleTextInputChange('firstname')}
            sx={{ flexGrow: 3 }}
          />
          <TextField
            id="lastname"
            label="last name"
            variant="standard"
            required
            value={trainerInput.lastname}
            onChange={handleTextInputChange('lastname')}
            sx={{ flexGrow: 3 }}
          />
        </Box>
        <TextField
          id="displayname"
          label="display name"
          variant="standard"
          required
          value={trainerInput.displayname}
          onChange={handleTextInputChange('displayname')}
          sx={{ flexGrow: 3 }}
        />
        <TextField
          id="description"
          label="description"
          variant="outlined"
          value={trainerInput.description}
          onChange={handleTextInputChange('description')}
          rows={3}
          multiline
        />
        <Box>
          <ImagesForm onChange={handleImagesChange} />
        </Box>
      </Stack>
      <Button
        sx={{ gridArea: 'cancel' }}
        variant="outlined"
        color="inherit"
        startIcon={<ChevronLeftIcon />}
        onClick={handleBackClick}
      >
        Back
      </Button>
      <Button
        sx={{ gridArea: 'submit' }}
        variant="contained"
        color="success"
        startIcon={<CheckCircleIcon />}
        onClick={handleSubmitClick}
      >
        Submit
      </Button>
    </Container>
  );
}
