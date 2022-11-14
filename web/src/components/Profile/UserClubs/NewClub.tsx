import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, Button } from '@mui/material';
import { gql, useMutation } from '@apollo/client';
import {
  ClubInput,
  FileUploadKind,
  Club,
  MutationCreateClubArgs,
} from '../../../generated/graphql';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import appContext, { NotificationLevel } from '../../../context';
import { FileInfo } from '../../FilesForm';
import { useUploadFile } from '../../../hooks/fileUpload';
import ClubForm from './ClubForm';

const DEFAULT_CLUB_INFO: ClubInput = {
  name: '',
  logo: undefined,
};

const CREATE_CLUB = gql`
  mutation createClub($input: ClubInput!) {
    createClub(input: $input) {
      id
      name
      logo
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

export default function NewClub() {
  const { notify } = React.useContext(appContext);
  const navigate = useNavigate();
  const [clubInput, setClubInput] =
    React.useState<ClubInput>(DEFAULT_CLUB_INFO);
  const [clubImages, setClubImages] = React.useState<FileInfo[]>([]);

  const [createClub] = useMutation<
    { createClub: Club },
    MutationCreateClubArgs
  >(CREATE_CLUB);
  const { uploadFile } = useUploadFile();

  const handleDetailsChange = (input: ClubInput) => {
    setClubInput({ ...input });
  };
  const handleImagesChange = (files: FileInfo[]) => {
    setClubImages(files);
  };

  const handleBackClick = () => {
    navigate('/profile/clubs');
  };
  const handleSubmitClick = async () => {
    try {
      const newClubInput = { ...clubInput };
      const newClubImages = clubImages.filter((t) => t.isNew && t.file);
      if (newClubImages.length > 0) {
        const imageFile = newClubImages[0];
        notify({
          level: NotificationLevel.INFO,
          message: `uploading ${imageFile.file?.name} ...`,
        });
        const fileUpload = await uploadFile(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          imageFile.file!,
          FileUploadKind.EventImage,
        );
        newClubInput.logo = fileUpload.id;
      }
      const newEvent = await createClub({
        variables: {
          input: newClubInput,
        },
      });
      notify({
        level: NotificationLevel.SUCCESS,
        message: `created ${newEvent.data?.createClub.name}`,
      });
      navigate('/profile/clubs');
    } catch (e) {
      notify({ level: NotificationLevel.ERROR, message: `${e}` });
    }
  };

  return (
    <Container>
      <ClubForm
        sx={{ gridArea: 'form' }}
        details={clubInput}
        images={clubImages}
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
