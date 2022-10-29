import * as React from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import { Trainer } from '../../../generated/graphql';
import TrainerCard from './TrainerCard';

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
      {trainers.map((trainer, i) => (
        <TrainerCard key={trainer.id || i} trainer={trainer} />
      ))}
    </Box>
  );
}
