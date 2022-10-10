import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material';

export type CslCardProps = {
  id: string;
  name: string;
  subtitle?: string;
  address: string;
  onClick: (id: string) => void;
  sx?: SxProps<Theme>;
};

export default function CslCard(props: CslCardProps) {
  const { id, name, subtitle, address, onClick, sx } = props;

  const handleClick = () => {
    onClick(id);
  };

  return (
    <Card sx={{ minWidth: 275, height: 200, ...sx }} onClick={handleClick}>
      <CardContent>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        {subtitle ? (
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {subtitle}
          </Typography>
        ) : null}
        <Typography variant="body2">{address}</Typography>
      </CardContent>
    </Card>
  );
}
