import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  Autocomplete,
  Box,
  BoxProps,
  Button,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import { useQuery, gql, useMutation } from '@apollo/client';
import {
  Activity,
  ActivityInput,
  Site,
  SiteInput,
  FileUploadKind,
  MutationCreateSiteArgs,
  QueryListSportsArgs,
  QueryListTrainersByClubArgs,
  Sport,
  SportPageInfo,
  Trainer,
  TrainerPageInfo,
} from '../../../../generated/graphql';
import ScheduleForm, {
  CalendarEntry,
  calendarEntryToSpan,
} from './ScheduleForm';
import ImagesForm, { FileInfo } from '../../../ImagesForm';
import Schedule from '../../../SitePage/Schedule';
import PositionForm from './PositionForm';
import { Position } from '../../../SiteList/SiteMap';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate, useParams } from 'react-router-dom';
import appContext, { NotificationLevel } from '../../../../context';
import { useUploadFile } from '../../../../hooks/fileUpload';

const SPORTS_PAGE_SIZE = 100;
const TRAINERS_PAGE_SIZE = 100;
const ACTIVITIES: Activity[] = [
  {
    name: 'Training',
    description: 'Basketball training',
    icon: '/muscle.png',
  },
  {
    name: 'Cardio',
    description: 'Running and cardio',
    icon: '/cardio.png',
  },
  {
    name: 'Competition',
    description: 'Tournaments and challenges',
    icon: '/trophey.png',
  },
];

const DEFAULT_CSL_INPUT: SiteInput = {
  name: '',
  sportId: '',
  address: '',
  lat: 0,
  lon: 0,
  phone: '',
  website: '',
  images: [],
  description: '',
  activities: [],
  trainerIds: [],
  schedule: [],
};

const CREATE_CLUB_SPORT_LOCATION = gql`
  mutation createSite($clubId: ID!, $input: SiteInput!) {
    createSite(clubId: $clubId, input: $input) {
      id
      name
    }
  }
`;

const LIST_SPORTS = gql`
  query listSports($first: Int!, $after: String) {
    listSports(first: $first, after: $after) {
      sports {
        id
        title
      }
      hasNextPage
      endCursor
    }
  }
`;

const LIST_TRAINERS = gql`
  query listTrainersByClub($clubId: ID!, $first: Int!, $after: String) {
    listTrainersByClub(clubId: $clubId, first: $first, after: $after) {
      trainers {
        id
        firstname
        lastname
      }
      hasNextPage
      endCursor
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

export default function SiteForm() {
  const { notify } = React.useContext(appContext);
  const { id: clubId } = useParams();
  const navigate = useNavigate();
  const [siteInput, setSiteInput] =
    React.useState<SiteInput>(DEFAULT_CSL_INPUT);
  const [siteImages, setSiteImages] = React.useState<FileInfo[]>([]);

  const { data: sportsData } = useQuery<
    { listSports: SportPageInfo },
    QueryListSportsArgs
  >(LIST_SPORTS, {
    variables: {
      first: SPORTS_PAGE_SIZE,
      after: '',
    },
    fetchPolicy: 'no-cache',
  });
  const { data: trainersData } = useQuery<
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
  const [createSite] = useMutation<
    { createSite: Site },
    MutationCreateSiteArgs
  >(CREATE_CLUB_SPORT_LOCATION);
  const { uploadFile } = useUploadFile();

  const handleTextInputChange =
    (key: keyof SiteInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setSiteInput({ ...siteInput, [key]: e.target.value });
    };
  const handleSportChange = (
    _event: React.SyntheticEvent<Element, Event>,
    sport: Sport | null,
  ) => {
    if (!sport || !sport.id) return;
    setSiteInput({ ...siteInput, sportId: sport.id });
  };
  const handlePositionChange = (position: Position) => {
    setSiteInput({ ...siteInput, lat: position.lat, lon: position.lon });
  };
  const handleImagesChange = (files: FileInfo[]) => {
    setSiteImages(files);
  };
  const handleActivitiesChange = (
    _event: React.SyntheticEvent<Element, Event>,
    activities: ActivityInput[],
  ) => {
    setSiteInput({ ...siteInput, activities });
  };
  const handleTrainersChange = (
    _event: React.SyntheticEvent<Element, Event>,
    trainers: Trainer[],
  ) => {
    setSiteInput({
      ...siteInput,
      trainerIds: trainers.filter((t) => t.id).map((t) => t.id || ''),
    });
  };
  const handleScheduleChange = (calendarEntries: CalendarEntry[]) => {
    const newCalendarSpans = calendarEntries.map(calendarEntryToSpan);
    setSiteInput({ ...siteInput, schedule: newCalendarSpans });
  };

  const handleBackClick = () => {
    navigate(`/profile/clubs/${clubId}/sites`);
  };

  const handleSubmitClick = async () => {
    try {
      if (!clubId) return;
      const newSiteInput = { ...siteInput };
      const newSiteImages = siteImages.filter((t) => t.isNew && t.file);
      if (newSiteImages.length > 0) {
        notify({
          level: NotificationLevel.INFO,
          message: `uploading ${newSiteImages.length} images ...`,
        });
        await Promise.all(
          newSiteImages.map((imageFileInfo) =>
            uploadFile(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              imageFileInfo.file!,
              FileUploadKind.SiteImage,
            ).then((fileUpload) => {
              newSiteInput.images.push(fileUpload.id || '');
            }),
          ),
        );
      }
      const result = await createSite({
        variables: {
          clubId,
          input: newSiteInput,
        },
      });
      notify({
        level: NotificationLevel.SUCCESS,
        message: `created ${result.data?.createSite.name}`,
      });
      navigate(`/profile/clubs/${clubId}/sites`);
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
            id="name"
            label="name"
            variant="standard"
            required
            value={siteInput.name}
            onChange={handleTextInputChange('name')}
            sx={{ flexGrow: 3 }}
          />
          <Autocomplete
            id="sport"
            options={sportsData?.listSports.sports || []}
            getOptionLabel={(option) => option.title}
            value={
              (sportsData?.listSports.sports || []).find(
                (s) => siteInput.sportId === s.id,
              ) || null
            }
            onChange={handleSportChange}
            sx={{ flexGrow: 2 }}
            renderInput={(params) => (
              <TextField {...params} label="sport" placeholder="Sport" />
            )}
          />
        </Box>
        <TextField
          id="address"
          label="address"
          variant="standard"
          required
          value={siteInput.address}
          onChange={handleTextInputChange('address')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon />
              </InputAdornment>
            ),
          }}
        />
        <PositionForm
          address={siteInput.address}
          position={{ lat: siteInput.lat, lon: siteInput.lon }}
          onChange={handlePositionChange}
        />
        <Box
          sx={{
            display: 'flex',
            flexdDirection: 'row',
            gap: '20px',
          }}
        >
          <TextField
            id="phone"
            label="phone number"
            variant="standard"
            required
            value={siteInput.phone}
            onChange={handleTextInputChange('phone')}
            sx={{ flexGrow: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            id="website"
            label="website"
            variant="standard"
            value={siteInput.website || ''}
            onChange={handleTextInputChange('website')}
            sx={{ flexGrow: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LanguageIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box>
          <ImagesForm
            multiple
            files={siteImages}
            onChange={handleImagesChange}
          />
        </Box>
        <TextField
          id="description"
          label="description"
          variant="outlined"
          value={siteInput.description}
          onChange={handleTextInputChange('description')}
          rows={3}
          multiline
        />
        <Autocomplete
          multiple
          id="activities"
          options={ACTIVITIES}
          getOptionLabel={(option) => option.name}
          filterSelectedOptions
          value={siteInput.activities}
          onChange={handleActivitiesChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="activities"
              placeholder="Activities"
            />
          )}
        />
        <Autocomplete
          multiple
          id="trainers"
          options={trainersData?.listTrainersByClub.trainers || []}
          getOptionLabel={(option) => `${option.firstname} ${option.lastname}`}
          value={(trainersData?.listTrainersByClub.trainers || []).filter(
            (t) => t.id && siteInput.trainerIds.includes(t.id),
          )}
          onChange={handleTrainersChange}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField {...params} label="trainers" placeholder="Trainers" />
          )}
        />
        <ScheduleForm onChange={handleScheduleChange} />
        <Box sx={{ width: '100%', display: 'flex' }}>
          <Schedule
            calendarSpans={siteInput.schedule}
            sx={{ margin: 'auto' }}
          />
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
