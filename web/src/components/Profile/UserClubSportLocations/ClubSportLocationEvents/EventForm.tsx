import * as React from 'react';
import { Box, Stack, TextField, SxProps, Theme } from '@mui/material';
import { EventInput } from '../../../../generated/graphql';
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import ImagesForm from '../../ImagesForm';

export type EventFormProps = {
  details: EventInput;
  onChange?: (details: EventInput) => void;
  readOnly?: boolean;
  sx?: SxProps<Theme>;
};

export default function EventForm(props: EventFormProps) {
  const { sx, details, onChange, readOnly } = props;

  const handleTextInputChange =
    (key: keyof EventInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!onChange) return;
      onChange({
        ...details,
        [key]: e.target.value,
      });
    };
  const handleDateChange = (newValue: Dayjs | null) => {
    if (!newValue || !onChange) return;
    onChange({
      ...details,
      dateRFC3339: newValue?.toISOString() || '',
    });
  };
  const handleImagesChange = (urls: string[]) => {
    if (!onChange) return;
    onChange({ ...details, image: urls.length === 0 ? undefined : urls[0] });
  };

  return (
    <Stack
      spacing={5}
      sx={{
        gridArea: 'form',
        placeSelf: 'center',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Date"
            inputFormat="DD/MM/YYYY HH:MM XM"
            value={details.dateRFC3339}
            onChange={handleDateChange}
            disabled={readOnly}
            renderInput={(params) => (
              <TextField {...params} sx={{ width: '340px' }} />
            )}
          />
        </LocalizationProvider>
        <TextField
          id="title"
          label="title"
          variant="standard"
          required={!readOnly}
          fullWidth
          value={details.title}
          onChange={handleTextInputChange('title')}
          InputProps={{ readOnly }}
        />
      </Box>
      <Box>
        <ImagesForm onChange={handleImagesChange} readOnly={readOnly} />
      </Box>
      <TextField
        id="description"
        label="description"
        variant="outlined"
        value={details.description}
        onChange={handleTextInputChange('description')}
        rows={8}
        multiline
        InputProps={{ readOnly }}
      />
    </Stack>
  );
}
