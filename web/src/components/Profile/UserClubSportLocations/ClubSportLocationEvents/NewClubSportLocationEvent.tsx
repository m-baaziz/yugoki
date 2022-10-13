import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, Button } from '@mui/material';
import { gql, useMutation } from '@apollo/client';
import {
  EventInput,
  Event as ClubEvent,
  MutationCreateEventArgs,
} from '../../../../generated/graphql';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate, useParams } from 'react-router-dom';
import appContext, { NotificationLevel } from '../../../../context';
import EventForm from './EventForm';

const DEFAULT_EVENT_INFO: EventInput = {
  dateRFC3339: '',
  title: '',
  description: '',
  image: undefined,
};

const CREATE_EVENT = gql`
  mutation createEvent($cslId: ID!, $input: EventInput!) {
    createEvent(cslId: $cslId, input: $input) {
      id
      title
    }
  }
`;

const Container = styled(Box)<BoxProps>(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplate:
    "  \
    '   .        .           .          .       .      '  3em  \
    '   .      form        form       form      .      '  auto \
    '   .        .           .          .       .      '  1fr  \
    '   .        .           .          .       .      '  2em  \
    '   .     cancel         .        submit    .      '  auto \
    '   .        .           .          .       .      '  2em  \
    /  10%      auto         1fr       auto    10%             \
  ",
}));

export default function NewClubSportLocationEvent() {
  const { notify } = React.useContext(appContext);
  const [eventInput, setEventInput] =
    React.useState<EventInput>(DEFAULT_EVENT_INFO);
  const { clubId, cslId } = useParams();
  const navigate = useNavigate();

  const [createEvent] = useMutation<
    { createEvent: ClubEvent },
    MutationCreateEventArgs
  >(CREATE_EVENT);

  const handleDetailsChange = (input: EventInput) => {
    setEventInput({ ...input });
  };

  const handleBackClick = () => {
    navigate(`/profile/clubs/${clubId}/locations/${cslId}/events`);
  };
  const handleSubmitClick = async () => {
    try {
      if (!cslId) return;
      const newEvent = await createEvent({
        variables: {
          cslId,
          input: eventInput,
        },
      });
      notify({
        level: NotificationLevel.SUCCESS,
        message: `created ${newEvent.data?.createEvent.title}`,
      });
      navigate(`/profile/clubs/${clubId}/locations/${cslId}/events`);
    } catch (e) {
      notify({ level: NotificationLevel.ERROR, message: `${e}` });
    }
  };

  return (
    <Container>
      <EventForm
        sx={{ gridArea: 'form' }}
        details={eventInput}
        onChange={handleDetailsChange}
      />
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
