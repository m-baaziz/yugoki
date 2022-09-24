import * as React from 'react';
import { Box, SxProps, Theme, Typography } from '@mui/material';
import { Trainer } from '../../../generated/graphql';

const IMG_SIZE = 80;

export type TeamProps = {
  trainers: Trainer[];
  sx?: SxProps<Theme>;
};

export default function Team(props: TeamProps) {
  const { trainers, sx } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        rowGap: 5,
        ...sx,
      }}
    >
      {trainers.map(
        ({ photo, displayname, firstname, lastname, description }, i) => (
          <Box key={i} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ margin: 'auto' }}>
              <img
                src={`/icons/80${photo}`}
                height={IMG_SIZE}
                width={IMG_SIZE}
              />
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
        ),
      )}
    </Box>
  );
}
