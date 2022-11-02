import * as React from 'react';
import { Box, SxProps } from '@mui/material';

export type MessageListProps = {
  sx?: SxProps;
};

export default function MessageList(props: MessageListProps) {
  const { sx } = props;

  return <Box sx={{ ...sx }}>MessageList</Box>;
}
