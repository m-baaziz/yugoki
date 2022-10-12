import * as React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  SxProps,
  Theme,
} from '@mui/material';
import { Trainer } from '../../../generated/graphql';
import { Link } from 'react-router-dom';
import TrainerCard from '../../CslPage/InfoTabs/TrainerCard';

export type UserClubTrainerCardProps = {
  trainer: Trainer;
  onDelete: (id: string) => void;
  sx?: SxProps<Theme>;
};

export default function UserClubTrainerCard(props: UserClubTrainerCardProps) {
  const { sx, trainer, onDelete } = props;

  const handleDeleteClick = () => {
    if (!trainer.id) return;
    onDelete(trainer.id);
  };

  return (
    <Card variant="outlined" sx={{ ...sx }}>
      <Link
        to={`${trainer.id || ''}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <CardContent>
          <TrainerCard trainer={trainer} />
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
