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
import { Event as ClubEvent } from '../../../../generated/graphql';
import { Link } from 'react-router-dom';

export type EventCardProps = {
  clubEvent: ClubEvent;
  onDelete: (id: string) => void;
  sx?: SxProps<Theme>;
};

export default function EventCard(props: EventCardProps) {
  const { sx, clubEvent, onDelete } = props;

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    if (!clubEvent.id) return;
    onDelete(clubEvent.id);
  };

  return (
    <Box sx={{ ...sx }}>
      <Link
        to={`${clubEvent.id || ''}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" component="div">
              {clubEvent.title}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {clubEvent.dateRFC3339}
            </Typography>
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
