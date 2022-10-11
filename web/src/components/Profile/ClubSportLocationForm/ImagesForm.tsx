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

type FileWithUrl = {
  file: File;
  url: string;
};

export type ImagesFormProps = {
  onChange: (urls: string[]) => void;
  sx?: SxProps<Theme>;
};

export default function ImagesForm(props: ImagesFormProps) {
  const { sx, onChange } = props;
  const [files, setFiles] = React.useState<FileWithUrl[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles: FileList = event.target.files || new FileList();
    setFiles([
      ...files,
      ...Array.from(newFiles).map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    ]);
  };

  React.useEffect(() => {
    onChange(files.map((f) => `/${f.file.name}`));
  }, [files]);

  const handleCloseCick = (index: number) => () => {
    const newFiles = [...files];
    pullAt(newFiles, index);
    setFiles(newFiles);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
    >
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
      <ImageList sx={{ width: '100%' }} cols={PREVIEW_IMG_PER_ROW}>
        {files.map(({ file, url }, i) => (
          <ImageListItem key={i}>
            <img src={url} alt={file.name} loading="lazy" />
            <ImageListItemBar
              position="top"
              sx={{ background: 'rgba(0, 0, 0, 0.5)' }}
              actionIcon={
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                  aria-label={`delete ${file.name}`}
                  onClick={handleCloseCick(i)}
                >
                  <CloseIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}
