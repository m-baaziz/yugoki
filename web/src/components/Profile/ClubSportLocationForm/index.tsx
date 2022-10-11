/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */

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
import LocationIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import { useQuery, gql, useMutation } from '@apollo/client';
import {
  Activity,
  ActivityInput,
  ClubSportLocation,
  ClubSportLocationInput,
  MutationCreateClubSportLocationArgs,
  QueryListSportsArgs,
  QueryListTrainersByClubArgs,
  Sport,
  SportPageInfo,
  Trainer,
  TrainerPageInfo,
} from '../../../generated/graphql';
import ScheduleForm, {
  CalendarEntry,
  calendarEntryToSpan,
} from './ScheduleForm';
import ImagesForm from './ImagesForm';
import Schedule from '../../CslPage/Schedule';
import PositionForm from './PositionForm';
import { Position } from '../../CslList/CslMap';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate, useParams } from 'react-router-dom';
import appContext, { NotificationLevel } from '../../../context';

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

const DEFAULT_CSL_INPUT: ClubSportLocationInput = {
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
  mutation createClubSportLocation(
    $clubId: ID!
    $input: ClubSportLocationInput!
  ) {
    createClubSportLocation(clubId: $clubId, input: $input) {
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
    '   .        .       .       .       .      '  2em  \
    '   .     cancel     .     submit    .      '  auto \
    '   .        .       .       .       .      '  1em  \
    /  10%      auto     1fr    auto    10%             \
  ",
}));

export default function ClubSportLocationForm() {
  const { notify } = React.useContext(appContext);
  const [cslInput, setCslInput] =
    React.useState<ClubSportLocationInput>(DEFAULT_CSL_INPUT);
  const { id: clubId } = useParams();
  const navigate = useNavigate();

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
  const [createClubSportLocation] = useMutation<
    { createClubSportLocation: ClubSportLocation },
    MutationCreateClubSportLocationArgs
  >(CREATE_CLUB_SPORT_LOCATION);

  const handleTextInputChange =
    (key: keyof ClubSportLocationInput) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCslInput({ ...cslInput, [key]: e.target.value });
    };
  const handleSportChange = (
    _event: React.SyntheticEvent<Element, Event>,
    sport: Sport | null,
  ) => {
    if (!sport || !sport.id) return;
    setCslInput({ ...cslInput, sportId: sport.id });
  };
  const handlePositionChange = (position: Position) => {
    setCslInput({ ...cslInput, lat: position.lat, lon: position.lon });
  };
  const handleImagesChange = (urls: string[]) => {
    setCslInput({ ...cslInput, images: urls });
  };
  const handleActivitiesChange = (
    _event: React.SyntheticEvent<Element, Event>,
    activities: ActivityInput[],
  ) => {
    setCslInput({ ...cslInput, activities });
  };
  const handleTrainersChange = (
    _event: React.SyntheticEvent<Element, Event>,
    trainers: Trainer[],
  ) => {
    setCslInput({
      ...cslInput,
      trainerIds: trainers.filter((t) => t.id).map((t) => t.id || ''),
    });
  };
  const handleScheduleChange = (calendarEntries: CalendarEntry[]) => {
    const newCalendarSpans = calendarEntries.map(calendarEntryToSpan);
    setCslInput({ ...cslInput, schedule: newCalendarSpans });
  };

  const handleBackClick = () => {
    navigate(`/profiel/clubs/${clubId}/locations`);
  };

  const handleSubmitClick = async () => {
    try {
      if (!clubId) return;
      const result = await createClubSportLocation({
        variables: {
          clubId,
          input: cslInput,
        },
      });
      notify({
        level: NotificationLevel.SUCCESS,
        message: `created ${result.data?.createClubSportLocation.name}`,
      });
      navigate(`/profile/clubs/${clubId}/locations`);
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
            value={cslInput.name}
            onChange={handleTextInputChange('name')}
            sx={{ flexGrow: 3 }}
          />
          <Autocomplete
            id="sport"
            options={sportsData?.listSports.sports || []}
            getOptionLabel={(option) => option.title}
            value={
              (sportsData?.listSports.sports || []).find(
                (s) => cslInput.sportId === s.id,
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
          value={cslInput.address}
          onChange={handleTextInputChange('address')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationIcon />
              </InputAdornment>
            ),
          }}
        />
        <PositionForm
          address={cslInput.address}
          position={{ lat: cslInput.lat, lon: cslInput.lon }}
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
            value={cslInput.phone}
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
            value={cslInput.website || ''}
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
          <ImagesForm onChange={handleImagesChange} />
        </Box>
        <TextField
          id="description"
          label="description"
          variant="outlined"
          value={cslInput.description}
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
          value={cslInput.activities}
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
            (t) => t.id && cslInput.trainerIds.includes(t.id),
          )}
          onChange={handleTrainersChange}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField {...params} label="trainers" placeholder="Trainers" />
          )}
        />
        <ScheduleForm onChange={handleScheduleChange} />
        <Box sx={{ width: '100%', display: 'flex' }}>
          <Schedule calendarSpans={cslInput.schedule} sx={{ margin: 'auto' }} />
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
