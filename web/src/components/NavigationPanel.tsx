import * as React from 'react';
import { Grid, Box, SxProps, Theme, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export type NavigationInfo = {
  to: string;
  label: string;
  icon?: React.ReactElement;
};

export type NavigationPanelProps = {
  links: NavigationInfo[];
  sx?: SxProps<Theme>;
};

export default function NavigationPanel(props: NavigationPanelProps) {
  const { sx, links } = props;

  return (
    <Grid
      sx={{
        ...sx,
      }}
      container
      spacing={2}
    >
      {links.map((link, i) => (
        <Grid key={i} item xs={6}>
          <Link
            to={link.to}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              width: '100%',
              height: '100%',
            }}
          >
            <Button sx={{ width: '100%', height: '100%', display: 'flex' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  margin: 'auto',
                  gap: '10px',
                }}
              >
                <Box sx={{ margin: 'auto' }}>{link.icon || null}</Box>
                <Typography variant="h5" sx={{ margin: 'auto' }}>
                  {link.label}
                </Typography>
              </Box>
            </Button>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
}
