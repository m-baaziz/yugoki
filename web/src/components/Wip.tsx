import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, Typography } from '@mui/material';

const Container = styled(Box)<BoxProps>(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplate:
    "  \
    '   .        .         .    '  1em  \
    '   .       wip        .    '  1fr  \
    '   .        .         .    '  1em  \
    /  10%      1fr       10%           \
  ",
}));

export default function Wip() {
  return (
    <Container>
      <Box
        sx={{
          gridArea: 'wip',
          placeSelf: 'center',
          display: 'flex',
          height: '100%',
          width: '100%',
        }}
      >
        <Typography variant="h2" sx={{ margin: 'auto' }}>
          Work in progress ...
        </Typography>
      </Box>
    </Container>
  );
}
