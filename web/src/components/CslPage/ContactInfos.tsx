import * as React from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import IconTextCombo from '../IconTextCombo';

const ICON_SIZE = 10;

export type ContactInfosProps = {
  address: string;
  phone: string;
  web?: string;
  sx?: SxProps<Theme>;
};

export default function ContactInfos(props: ContactInfosProps) {
  const { address, phone, web, sx } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        width: '100%',
        height: '100%',
        ...sx,
      }}
    >
      <IconTextCombo icon="/address.png" size={ICON_SIZE} text={address} />
      <IconTextCombo icon="/phone.png" size={ICON_SIZE} text={phone} />
      {web ? (
        <IconTextCombo icon="/web.png" size={ICON_SIZE} text={web} link />
      ) : null}
      <Box sx={{ flexGrow: 2 }} />
    </Box>
  );
}
