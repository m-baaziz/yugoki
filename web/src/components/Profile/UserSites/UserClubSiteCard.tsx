import * as React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  SxProps,
  Theme,
  Box,
} from '@mui/material';
import { Site } from '../../../generated/graphql';
import { Link } from 'react-router-dom';

export type UserSiteCardProps = {
  site: Site;
  onDelete: (id: string) => void;
  sx?: SxProps<Theme>;
};

export default function UserSiteCard(props: UserSiteCardProps) {
  const { sx, site, onDelete } = props;

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    if (!site.id) return;
    onDelete(site.id);
  };

  return (
    <Box sx={{ ...sx }}>
      <Link
        to={`${site.id || ''}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" component="div">
              {site.name}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {site.sport.title}
            </Typography>
            <Typography variant="body2">{site.address}</Typography>
          </CardContent>
          <CardActions
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <Button size="small" onClick={handleDeleteClick} color="error">
              Delete
            </Button>
          </CardActions>
        </Card>
      </Link>
    </Box>
  );
}
