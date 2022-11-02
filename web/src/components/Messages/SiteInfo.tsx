import * as React from 'react';
import { Box, SxProps } from '@mui/material';

export type SiteInfoProps = {
  sx?: SxProps;
};

export default function SiteInfo(props: SiteInfoProps) {
  const { sx } = props;

  return <Box sx={{ ...sx }}>SiteInfo</Box>;
}
