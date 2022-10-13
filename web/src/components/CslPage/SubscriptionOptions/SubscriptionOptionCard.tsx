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
  List,
  ListItemText,
} from '@mui/material';
import { SubscriptionOption } from '../../../generated/graphql';
import { Link } from 'react-router-dom';
import LockOpenIcon from '@mui/icons-material/LockOpen';

export type SubscriptionOptionCardProps = {
  subscriptionOption: SubscriptionOption;
  sx?: SxProps<Theme>;
};

export default function SubscriptionOptionCard(
  props: SubscriptionOptionCardProps,
) {
  const { sx, subscriptionOption } = props;

  return (
    <Box sx={{ ...sx }}>
      <Card variant="outlined">
        <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h5" component="div" sx={{ margin: 'auto' }}>
            {subscriptionOption.title}
          </Typography>
          <List component="nav">
            {subscriptionOption.features.map((feature, i) => (
              <ListItemText key={i} primary={`- ${feature}`} />
            ))}
          </List>
          <Box sx={{ flexGrow: 2 }} />
          <Typography
            variant="h5"
            component="div"
            sx={{ margin: 'auto', mt: '30px' }}
          >
            $ {subscriptionOption.price}
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            display: 'flex',
          }}
        >
          <Link
            to={`registration/${subscriptionOption.id || ''}`}
            style={{ textDecoration: 'none', color: 'inherit', margin: 'auto' }}
          >
            <Button size="small" color="success" startIcon={<LockOpenIcon />}>
              Register
            </Button>
          </Link>
        </CardActions>
      </Card>
    </Box>
  );
}
