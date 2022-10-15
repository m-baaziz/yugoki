import * as React from 'react';
import { Box, SxProps, Theme, Typography } from '@mui/material';
import { Trainer } from '../../../generated/graphql';
import { useGetFile } from '../../../hooks/fileUpload';

const IMG_SIZE = 80;

export type TrainerCardProps = {
  trainer: Trainer;
  sx?: SxProps<Theme>;
};

export default function TrainerCard(props: TrainerCardProps) {
  const {
    trainer: { photo, displayname, firstname, lastname, description },
    sx,
  } = props;

  const { data: trainerPhotoData } = useGetFile(photo || undefined);

  const photoUrl = React.useMemo<string>(
    () =>
      trainerPhotoData && trainerPhotoData.getFileUpload.url
        ? trainerPhotoData.getFileUpload.url
        : '',
    [trainerPhotoData],
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', ...sx }}>
      <Box sx={{ margin: 'auto' }}>
        <img src={photoUrl} height={IMG_SIZE} width={IMG_SIZE} />
      </Box>
      <Typography variant="h5" sx={{ margin: 'auto' }}>
        {displayname}
      </Typography>
      <Typography variant="body1" sx={{ margin: 'auto' }}>
        ({firstname} {lastname})
      </Typography>
      <Typography variant="body2" sx={{ margin: 'auto' }}>
        {description}
      </Typography>
    </Box>
  );
}
