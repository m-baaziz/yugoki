import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps } from '@mui/material';
import appContext from '../context';

import SportList from './SportList';

const Container = styled(Box)<BoxProps>(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplate:
    "  \
    '   .        .         .    '  1em  \
    '   .      sports      .    '  1fr  \
    '   .        .         .    '  1em  \
    /  10%      1fr       10%           \
  ",
}));

export default function Home() {
  const { user } = React.useContext(appContext);
  console.log('user = ', user);

  return (
    <Container>
      <Box
        sx={{
          gridArea: 'sports',
          placeSelf: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        <SportList />
      </Box>
    </Container>
  );
}
