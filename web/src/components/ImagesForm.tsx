import * as React from 'react';
import {
  Box,
  SxProps,
  Theme,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import pullAt from 'lodash/pullAt';

const PREVIEW_IMG_PER_ROW = 10;

export type FileInfo = {
  url: string;
  file?: File;
  isNew?: boolean;
};

export type ImagesFormProps = {
  files: FileInfo[];
  onChange?: (files: FileInfo[]) => void;
  multiple?: boolean;
  sx?: SxProps<Theme>;
  readOnly?: boolean;
};

export default function ImagesForm(props: ImagesFormProps) {
  const { sx, files, onChange, multiple, readOnly } = props;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    const newFiles: FileInfo[] = Array.from(
      event.target.files || new FileList(),
    ).map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isNew: true,
    }));
    if (!multiple) {
      onChange([...newFiles]);
      return;
    }
    onChange([...files, ...newFiles]);
  };

  const handleCloseCick = (index: number) => () => {
    if (!onChange) return;
    const newFiles = [...files];
    pullAt(newFiles, index);
    onChange(newFiles);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
    >
      {readOnly ? null : (
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<FileUploadIcon />}
          >
            Upload Image
            <input
              hidden
              type="file"
              id="images"
              name="images"
              accept="images/png, images/jpeg"
              multiple
              onChange={handleFileChange}
            />
          </Button>
        </Box>
      )}
      <ImageList sx={{ width: '100%' }} cols={PREVIEW_IMG_PER_ROW}>
        {files.map(({ file, url }, i) => (
          <ImageListItem key={i}>
            <img src={url} alt={file?.name || url} loading="lazy" />
            {readOnly ? null : (
              <ImageListItemBar
                position="top"
                sx={{ background: 'rgba(0, 0, 0, 0.5)' }}
                actionIcon={
                  <IconButton
                    sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                    aria-label={`delete ${file?.name || url}`}
                    onClick={handleCloseCick(i)}
                  >
                    <CloseIcon />
                  </IconButton>
                }
              />
            )}
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}
