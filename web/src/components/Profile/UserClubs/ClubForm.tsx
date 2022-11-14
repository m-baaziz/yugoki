import * as React from 'react';
import { Box, Stack, TextField, SxProps, Theme } from '@mui/material';
import { ClubInput } from '../../../generated/graphql';
import FilesForm, { FileInfo, FileKind } from '../../FilesForm';

export type ClubFormProps = {
  details: ClubInput;
  images: FileInfo[];
  onChange?: (details: ClubInput) => void;
  onImagesChange?: (files: FileInfo[]) => void;
  readOnly?: boolean;
  sx?: SxProps<Theme>;
};

export default function ClubForm(props: ClubFormProps) {
  const { sx, details, images, onChange, onImagesChange, readOnly } = props;

  const handleTextInputChange =
    (key: keyof ClubInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!onChange) return;
      onChange({
        ...details,
        [key]: e.target.value,
      });
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
        <TextField
          id="name"
          label="name"
          variant="standard"
          required={!readOnly}
          fullWidth
          value={details.name}
          onChange={handleTextInputChange('name')}
          InputProps={{ readOnly }}
        />
      </Box>
      <Box>
        <FilesForm
          kind={FileKind.IMAGE}
          label="Upload Logo"
          files={images}
          onChange={onImagesChange}
          readOnly={readOnly}
        />
      </Box>
    </Stack>
  );
}
