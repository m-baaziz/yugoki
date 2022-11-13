import * as React from 'react';
import {
  Box,
  Stack,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  SxProps,
  Theme,
} from '@mui/material';
import {
  FormEntry,
  FormEntryKind,
  Gender,
  SubscriberDetailsInput,
} from '../../../generated/graphql';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { parseGender } from '../../../utils/registration';
import FilesForm, { FileInfo, FileKind } from '../../FilesForm';

export type RegistrationFilesInfo = Map<number, FileInfo>;

export type RegistrationFormProps = {
  details: SubscriberDetailsInput;
  formEntries: FormEntry[];
  files: RegistrationFilesInfo;
  onChange?: (details: SubscriberDetailsInput) => void;
  onFileChange?: (entryIndex: number) => (files: FileInfo[]) => void;
  readOnly?: boolean;
  sx?: SxProps<Theme>;
};

export default function RegistrationForm(props: RegistrationFormProps) {
  const { sx, details, formEntries, files, onChange, onFileChange, readOnly } =
    props;

  const handleTextInputChange =
    (key: keyof SubscriberDetailsInput) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!onChange) return;
      onChange({
        ...details,
        [key]: e.target.value,
      });
    };

  const handleGenderChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string,
  ) => {
    if (!onChange) return;
    onChange({
      ...details,
      gender: parseGender(value),
    });
  };

  const handleDobChange = (newValue: Dayjs | null) => {
    if (!newValue || !onChange) return;
    onChange({
      ...details,
      dateOfBirth: newValue?.toISOString() || '',
    });
  };

  const handleTextFormEntryChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!onChange) return;
      const formEntriesValues = [...details.formEntriesValues];
      formEntriesValues[index] = e.target.value;
      onChange({ ...details, formEntriesValues });
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
        <FormControl>
          <FormLabel id="gender-radio-buttons-group-label">Gender</FormLabel>
          <RadioGroup
            row
            aria-labelledby="gender-radio-buttons-group-label"
            name="gender-row-radio-buttons-group"
            value={details.gender}
            onChange={handleGenderChange}
          >
            <FormControlLabel
              value={Gender.Female}
              control={<Radio />}
              label="Female"
              disabled={readOnly}
            />
            <FormControlLabel
              value={Gender.Male}
              control={<Radio />}
              label="Male"
              disabled={readOnly}
            />
            <FormControlLabel
              value={Gender.Other}
              control={<Radio />}
              label="Other"
              disabled={readOnly}
            />
          </RadioGroup>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label="Date of birth"
            inputFormat="MM/DD/YYYY"
            value={details.dateOfBirth}
            onChange={handleDobChange}
            InputProps={{ readOnly }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
        <TextField
          id="firstname"
          label="first name"
          variant="standard"
          required={!readOnly}
          fullWidth
          value={details.firstname}
          onChange={handleTextInputChange('firstname')}
          InputProps={{ readOnly }}
        />
        <TextField
          id="lastname"
          label="last name"
          variant="standard"
          required={!readOnly}
          fullWidth
          value={details.lastname}
          onChange={handleTextInputChange('lastname')}
          InputProps={{ readOnly }}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
        <TextField
          id="phone"
          label="phone number"
          variant="standard"
          required={!readOnly}
          fullWidth
          value={details.phone}
          onChange={handleTextInputChange('phone')}
          InputProps={{
            readOnly,
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="email"
          label="email"
          variant="standard"
          required={!readOnly}
          fullWidth
          value={details.email}
          onChange={handleTextInputChange('email')}
          InputProps={{
            readOnly,
            startAdornment: (
              <InputAdornment position="start">
                <AlternateEmailIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <TextField
        id="address"
        label="address"
        variant="standard"
        required={!readOnly}
        fullWidth
        value={details.address}
        onChange={handleTextInputChange('address')}
        InputProps={{
          readOnly,
          startAdornment: (
            <InputAdornment position="start">
              <LocationOnIcon />
            </InputAdornment>
          ),
        }}
      />
      {formEntries.map((formEntry, i) =>
        formEntry.kind === FormEntryKind.Text ? (
          <TextField
            key={i}
            id={`form-entry-${i}`}
            label={formEntry.label}
            variant="standard"
            required={!readOnly}
            fullWidth
            value={details.formEntriesValues[i]}
            onChange={handleTextFormEntryChange(i)}
          />
        ) : (
          <FilesForm
            kind={FileKind.FILE}
            files={files.has(i) ? [files.get(i) as FileInfo] : []}
            onChange={onFileChange ? onFileChange(i) : undefined}
            readOnly={readOnly}
          />
        ),
      )}
    </Stack>
  );
}
