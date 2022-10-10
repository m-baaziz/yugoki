import * as React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  SxProps,
  Theme,
} from '@mui/material';
import { ClubSportLocation } from '../../generated/graphql';
import { Link } from 'react-router-dom';

export type UserClubSportLocationCardProps = {
  clubSportLocation: ClubSportLocation;
  onDelete: (id: string) => void;
  sx?: SxProps<Theme>;
};

export default function UserClubSportLocationCard(
  props: UserClubSportLocationCardProps,
) {
  const { sx, clubSportLocation, onDelete } = props;

  const handleDeleteClick = () => {
    if (!clubSportLocation.id) return;
    onDelete(clubSportLocation.id);
  };

  return (
    <Card variant="outlined" sx={{ ...sx }}>
      <Link
        to={`${clubSportLocation.id || ''}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <CardContent>
          <Typography variant="h5" component="div">
            {clubSportLocation.name}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {clubSportLocation.sport.title}
          </Typography>
          <Typography variant="body2">{clubSportLocation.address}</Typography>
        </CardContent>
      </Link>
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
  );
}
