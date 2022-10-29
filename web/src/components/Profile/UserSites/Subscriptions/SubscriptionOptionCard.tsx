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
import { SubscriptionOption } from '../../../../generated/graphql';
import { Link } from 'react-router-dom';

export type SubscriptionOptionCardProps = {
  subscriptionOption: SubscriptionOption;
  onEnableDisable: (id: string, enable: boolean) => void;
  sx?: SxProps<Theme>;
};

export default function SubscriptionOptionCard(
  props: SubscriptionOptionCardProps,
) {
  const { sx, subscriptionOption, onEnableDisable } = props;

  const handleEnableDisableClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    event.preventDefault();
    if (!subscriptionOption.id) return;
    onEnableDisable(subscriptionOption.id, !subscriptionOption.enabled);
  };

  return (
    <Box sx={{ ...sx }}>
      <Link
        to={`options/${subscriptionOption.id || ''}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
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
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              size="small"
              onClick={handleEnableDisableClick}
              color={subscriptionOption.enabled ? 'error' : 'success'}
            >
              {subscriptionOption.enabled ? 'Disable' : 'Enable'}
            </Button>
          </CardActions>
        </Card>
      </Link>
    </Box>
  );
}
