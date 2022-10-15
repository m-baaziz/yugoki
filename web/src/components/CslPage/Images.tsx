import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { SxProps, Theme, Box } from '@mui/material';

const COLUMN_COUNT = 4;
const ROW_COUNT = 2;
const ROW_HEIGHT = 120;

export type ImagesProps = {
  images: string[];
  sx?: SxProps<Theme>;
};

export default function Images(props: ImagesProps) {
  const { images, sx } = props;

  return (
    <Box sx={{ ...sx }}>
      <ImageList
        sx={{ width: '100%', height: ROW_COUNT * ROW_HEIGHT }}
        variant="quilted"
        cols={COLUMN_COUNT}
        rowHeight={ROW_HEIGHT}
      >
        {images.map((img, i) => {
          const rows = i === 0 ? 2 : 1;
          const cols = i === 0 ? 2 : 1;
          return (
            <ImageListItem key={i} cols={cols} rows={rows}>
              <img src={img} alt="club photo" loading="lazy" />
            </ImageListItem>
          );
        })}
      </ImageList>
    </Box>
  );
}
