import * as React from 'react';
import {
  SxProps,
  Theme,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  SelectChangeEvent,
  IconButton,
  InputLabel,
  FormControl,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { CalendarSpan } from '../../../../generated/graphql';
import { dayIndex, DAYS } from '../../../CslPage/Schedule';
import DeleteIcon from '@mui/icons-material/Delete';
import TodayIcon from '@mui/icons-material/Today';
import pullAt from 'lodash/pullAt';
import { useTimeout } from '../../../../hooks/timeout';

const UPDATE_DELAY_MS = 500;

export type CalendarEntry = {
  from: Dayjs;
  to: Dayjs;
  day: number;
  title: string;
};

export type ScheduleFormProps = {
  onChange: (entries: CalendarEntry[]) => void;
  sx?: SxProps<Theme>;
};

const DEFAULT_CALENDAR_ENTRY = {
  from: dayjs('08:00:00'),
  to: dayjs('09:00:00'),
  day: 0,
  title: 'New Entry',
};

export function calendarEntryToSpan(entry: CalendarEntry): CalendarSpan {
  return {
    day: dayIndex(entry.day),
    fromMinute: entry.from.hour() * 60 + entry.from.minute(),
    toMinute: entry.to.hour() * 60 + entry.to.minute(),
    title: entry.title,
  };
}

export default function ScheduleForm(props: ScheduleFormProps) {
  const { sx, onChange } = props;
  const [calendarEntries, setCalendarEntries] = React.useState<CalendarEntry[]>(
    [],
  );
  const timeoutWrapper = useTimeout();

  React.useEffect(() => {
    if (timeoutWrapper.timeout) {
      clearTimeout(timeoutWrapper.timeout);
    }
    const timeout = setTimeout(() => {
      onChange(calendarEntries);
    }, UPDATE_DELAY_MS);
    timeoutWrapper.timeout = timeout;
  }, [calendarEntries]);

  const handleNewEntryClick = () => {
    setCalendarEntries([...calendarEntries, { ...DEFAULT_CALENDAR_ENTRY }]);
  };
  const handleChangeFrom = (index: number) => (newValue: Dayjs | null) => {
    const newEntries = [...calendarEntries];
    newEntries[index].from = newValue || DEFAULT_CALENDAR_ENTRY.from;
    setCalendarEntries(newEntries);
  };
  const handleChangeTo = (index: number) => (newValue: Dayjs | null) => {
    const newEntries = [...calendarEntries];
    newEntries[index].to = newValue || DEFAULT_CALENDAR_ENTRY.to;
    setCalendarEntries(newEntries);
  };
  const handleChangeDay =
    (index: number) => (event: SelectChangeEvent<number>) => {
      try {
        const newEntries = [...calendarEntries];
        newEntries[index].day = parseInt(event.target.value as string, 10);
        setCalendarEntries(newEntries);
      } catch (e) {
        console.error(e);
      }
    };
  const handleChangeTitle =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newEntries = [...calendarEntries];
      newEntries[index].title = event.target.value;
      setCalendarEntries(newEntries);
    };
  const handleClickDelete = (index: number) => () => {
    const newEntries = [...calendarEntries];
    pullAt(newEntries, index);
    setCalendarEntries(newEntries);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', ...sx }}>
      <Button
        variant="outlined"
        onClick={handleNewEntryClick}
        startIcon={<TodayIcon />}
      >
        New Calendar Entry
      </Button>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {calendarEntries.map((entry, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
                flexWrap: 'wrap',
              }}
            >
              <FormControl>
                <InputLabel id="day-label">day</InputLabel>
                <Select
                  labelId="day-label"
                  id="day"
                  value={entry.day}
                  label="Day"
                  sx={{ width: 200 }}
                  onChange={handleChangeDay(i)}
                >
                  {DAYS.map((day, dayIndex) => (
                    <MenuItem key={dayIndex} value={dayIndex}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TimePicker
                label="start"
                value={entry.from}
                onChange={handleChangeFrom(i)}
                renderInput={(params) => <TextField {...params} />}
              />
              <TimePicker
                label="end"
                value={entry.to}
                onChange={handleChangeTo(i)}
                renderInput={(params) => <TextField {...params} />}
              />
              <TextField
                id="title"
                label="title"
                variant="outlined"
                value={entry.title}
                onChange={handleChangeTitle(i)}
                required
                sx={{ flexGrow: 2 }}
              />
              <Box sx={{ display: 'flex' }}>
                <IconButton
                  aria-label="delete"
                  size="small"
                  sx={{ margin: 'auto' }}
                  onClick={handleClickDelete(i)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </LocalizationProvider>
      </Box>
    </Box>
  );
}
