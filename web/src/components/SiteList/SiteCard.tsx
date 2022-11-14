import * as React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material';
import { useGetFile } from '../../hooks/fileUpload';

const LOGO_SIZE = 50;

export type SiteCardProps = {
  id: string;
  name: string;
  logoId?: string;
  subtitle?: string;
  address: string;
  onClick: (id: string) => void;
  sx?: SxProps<Theme>;
};

export default function SiteCard(props: SiteCardProps) {
  const { id, name, logoId, subtitle, address, onClick, sx } = props;

  const { data: logoData } = useGetFile(logoId);

  const handleClick = () => {
    onClick(id);
  };

  return (
    <Card sx={{ minWidth: 275, height: 150, ...sx }} onClick={handleClick}>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        {logoData?.getFileUpload.url ? (
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ margin: 'auto' }}>
              <img
                src={logoData?.getFileUpload.url || ''}
                alt={name}
                loading="lazy"
                width={LOGO_SIZE}
                height={LOGO_SIZE}
              />
            </Box>
          </Box>
        ) : null}
        <Box sx={{ flexGrow: 3 }}>
          <Typography variant="h5" component="div">
            {name}
          </Typography>
          {subtitle ? (
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
          <Typography variant="body2">{address}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
