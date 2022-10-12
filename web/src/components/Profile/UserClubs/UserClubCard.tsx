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
import { Club } from '../../../generated/graphql';
import { Link } from 'react-router-dom';

export type UserClubCardProps = {
  club: Club;
  onDelete: (id: string) => void;
  sx?: SxProps<Theme>;
};

export default function UserClubCard(props: UserClubCardProps) {
  const { sx, club, onDelete } = props;

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    if (!club.id) return;
    onDelete(club.id);
  };

  return (
    <Box sx={{ ...sx }}>
      <Link
        to={`/profile/clubs/${club.id || ''}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <Card variant="outlined">
          <CardContent sx={{ display: 'flex' }}>
            <Typography variant="h5" component="div" sx={{ margin: 'auto' }}>
              {club.name}
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
