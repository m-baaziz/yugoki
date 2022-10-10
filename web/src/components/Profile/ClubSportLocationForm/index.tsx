import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  Autocomplete,
  Box,
  BoxProps,
  InputAdornment,
  InputLabel,
  TextField,
} from '@mui/material';
import LocationIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import { Activity } from '../../../generated/graphql';
import ScheduleForm, {
  CalendarEntry,
  calendarEntryToSpan,
} from './ScheduleForm';

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

const Container = styled(Box)<BoxProps>(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplate:
    "  \
    '   .        .         .    '  1em  \
    '   .      form        .    '  auto \
    '   .        .         .    '  1em  \
    /  10%      1fr       10%           \
  ",
}));

export default function ClubSportLocationForm() {
  const handleScheduleChange = (calendarEntries: CalendarEntry[]) => {
    const calendarSpans = calendarEntries.map(calendarEntryToSpan);
    console.log('calendar spans = ', calendarSpans);
  };

  return (
    <Container>
      <Box
        sx={{
          gridArea: 'form',
          placeSelf: 'center',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TextField id="name" label="name" variant="standard" required />
        <Box sx={{ display: 'grid', gridDirection: 'row' }}>
          <TextField
            id="address"
            label="address"
            variant="standard"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            id="phone"
            label="phone number"
            variant="standard"
            required
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
          <InputLabel variant="standard">Images</InputLabel>
        </Box>
        <TextField id="description" label="description" variant="outlined" />
        <Autocomplete
          multiple
          id="activities"
          options={ACTIVITIES}
          getOptionLabel={(option) => option.name}
          filterSelectedOptions
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
          options={ACTIVITIES}
          getOptionLabel={(option) => option.name}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField {...params} label="trainers" placeholder="Trainers" />
          )}
        />
        <ScheduleForm onChange={handleScheduleChange} />
      </Box>
    </Container>
  );
}
