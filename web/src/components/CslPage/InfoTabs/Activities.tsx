import * as React from 'react';
import { Box, SxProps, Theme, Typography } from '@mui/material';
import { Activity } from '../../../generated/graphql';
import IconTextCombo from '../../IconTextCombo';

export type ActivitiesProps = {
  activities: Activity[];
  sx?: SxProps<Theme>;
};

export default function Activities(props: ActivitiesProps) {
  const { activities, sx } = props;

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
      {activities.map(({ icon, name, description }, i) => (
        <IconTextCombo
          key={i}
          size={60}
          icon={`/icons/80/${icon}` || undefined}
          text={
            <Box sx={{ maxWidth: 300 }}>
              <Typography variant="h5">{name}</Typography>
              <Typography variant="body2">{description}</Typography>
            </Box>
          }
        />
      ))}
    </Box>
  );
}
