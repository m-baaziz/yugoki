import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, Button } from '@mui/material';
import { gql, useMutation } from '@apollo/client';
import {
  EventInput,
  Event as ClubEvent,
  MutationCreateEventArgs,
  FileUploadKind,
} from '../../../../generated/graphql';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate, useParams } from 'react-router-dom';
import appContext, { NotificationLevel } from '../../../../context';
import EventForm from './EventForm';
import { FileInfo } from '../../../FilesForm';
import { useUploadFile } from '../../../../hooks/fileUpload';

const DEFAULT_EVENT_INFO: EventInput = {
  dateRFC3339: new Date().toISOString(),
  title: '',
  description: '',
  image: undefined,
};

const CREATE_EVENT = gql`
  mutation createEvent($siteId: ID!, $input: EventInput!) {
    createEvent(siteId: $siteId, input: $input) {
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

export default function NewSiteEvent() {
  const { notify } = React.useContext(appContext);
  const { clubId, siteId } = useParams();
  const navigate = useNavigate();
  const [eventInput, setEventInput] =
    React.useState<EventInput>(DEFAULT_EVENT_INFO);
  const [eventImages, setEventImages] = React.useState<FileInfo[]>([]);

  const [createEvent] = useMutation<
    { createEvent: ClubEvent },
    MutationCreateEventArgs
  >(CREATE_EVENT);
  const { uploadFile } = useUploadFile();

  const handleDetailsChange = (input: EventInput) => {
    setEventInput({ ...input });
  };
  const handleImagesChange = (files: FileInfo[]) => {
    setEventImages(files);
  };

  const handleBackClick = () => {
    navigate(`/profile/clubs/${clubId}/sites/${siteId}/events`);
  };
  const handleSubmitClick = async () => {
    try {
      if (!siteId) return;
      const newEventInput = { ...eventInput };
      const newEventImages = eventImages.filter((t) => t.isNew && t.file);
      if (newEventImages.length > 0) {
        const imageFile = newEventImages[0];
        notify({
          level: NotificationLevel.INFO,
          message: `uploading ${imageFile.file?.name} ...`,
        });
        const fileUpload = await uploadFile(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          imageFile.file!,
          FileUploadKind.EventImage,
        );
        newEventInput.image = fileUpload.id;
      }
      const newEvent = await createEvent({
        variables: {
          siteId,
          input: newEventInput,
        },
      });
      notify({
        level: NotificationLevel.SUCCESS,
        message: `created ${newEvent.data?.createEvent.title}`,
      });
      navigate(`/profile/clubs/${clubId}/sites/${siteId}/events`);
    } catch (e) {
      notify({ level: NotificationLevel.ERROR, message: `${e}` });
    }
  };

  return (
    <Container>
      <EventForm
        sx={{ gridArea: 'form' }}
        details={eventInput}
        images={eventImages}
        onChange={handleDetailsChange}
        onImagesChange={handleImagesChange}
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
