import * as React from 'react';
import { Box, SxProps } from '@mui/material';

export type MessageInputProps = {
  sx?: SxProps;
};

export default function MessageInput(props: MessageInputProps) {
  const { sx } = props;

  return <Box sx={{ ...sx }}>MessageInput</Box>;
}
