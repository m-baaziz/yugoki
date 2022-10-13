import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, Button, Typography, Divider } from '@mui/material';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Gender,
  MutationCreateSubscriptionArgs,
  QueryGetSubscriptionOptionArgs,
  SubscriberDetails,
  SubscriberDetailsInput,
  Subscription,
  SubscriptionOption,
} from '../../../generated/graphql';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useNavigate, useParams } from 'react-router-dom';
import appContext, { NotificationLevel } from '../../../context';
import RegistrationForm from './RegistrationForm';

const DEFAULT_SUBSCRIBER_DETAILS: SubscriberDetailsInput = {
  firstname: '',
  lastname: '',
  gender: Gender.Other,
  email: '',
  address: '',
  phone: '',
  dateOfBirth: '',
};

const GET_SUBSCRIPTION_OPTION = gql`
  query getSubscriptionOption($id: ID!) {
    getSubscriptionOption(id: $id) {
      id
      title
      features
      price
    }
  }
`;

const CREATE_SUBSCRIPTION = gql`
  mutation createSubscription(
    $subscriptionOptionId: ID!
    $details: SubscriberDetailsInput!
  ) {
    createSubscription(
      subscriptionOptionId: $subscriptionOptionId
      details: $details
    ) {
      id
      createdAtRFC3339
    }
  }
`;

const Container = styled(Box)<BoxProps>(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplate:
    "  \
    '   .        .           .          .       .      '  1em  \
    '   .   description description description .      '  auto \
    '   .        .           .          .       .      '  1fr  \
    '   .      form        form       form      .      '  auto \
    '   .        .           .          .       .      '  1fr  \
    '   .     cancel         .        submit    .      '  auto \
    '   .        .           .          .       .      '  2em  \
    /  10%      auto         1fr       auto    10%             \
  ",
}));

export default function Registration() {
  const { notify } = React.useContext(appContext);
  const [subscriberDetailsInput, setSubscriberDetailsInput] =
    React.useState<SubscriberDetailsInput>(DEFAULT_SUBSCRIBER_DETAILS);
  const { cslId, subscriptionOptionId } = useParams();
  const navigate = useNavigate();

  const { data: subscriptionOptionData } = useQuery<
    {
      getSubscriptionOption: SubscriptionOption;
    },
    QueryGetSubscriptionOptionArgs
  >(GET_SUBSCRIPTION_OPTION, {
    skip: !cslId,
    variables: {
      id: subscriptionOptionId || '',
    },
    fetchPolicy: 'no-cache',
  });
  const [createSubscription] = useMutation<
    { createSubscription: Subscription },
    MutationCreateSubscriptionArgs
  >(CREATE_SUBSCRIPTION);

  const handleDetailsChange = (details: SubscriberDetails) => {
    setSubscriberDetailsInput({ ...details });
  };

  const handleBackClick = () => {
    navigate(`/locations/${cslId}`);
  };
  const handleSubmitClick = async () => {
    try {
      if (!cslId || !subscriptionOptionId) return;
      await createSubscription({
        variables: {
          subscriptionOptionId: subscriptionOptionId,
          details: subscriberDetailsInput,
        },
      });
      notify({
        level: NotificationLevel.SUCCESS,
        message: 'Registration complete',
      });
      navigate(`/locations/${cslId}`);
    } catch (e) {
      notify({ level: NotificationLevel.ERROR, message: `${e}` });
    }
  };

  return (
    <Container>
      <Box
        sx={{
          gridArea: 'description',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <Typography variant="h4">
          {subscriptionOptionData?.getSubscriptionOption.title}
        </Typography>
        <Box>
          {subscriptionOptionData?.getSubscriptionOption.features.map(
            (feature, i) => (
              <Typography key={i} variant="body2">
                - {feature}
              </Typography>
            ),
          )}
        </Box>
        <Divider />
      </Box>
      <RegistrationForm
        sx={{ gridArea: 'form' }}
        details={subscriberDetailsInput}
        onChange={handleDetailsChange}
      />
      <Button
        sx={{ gridArea: 'cancel' }}
        variant="outlined"
        color="inherit"
        startIcon={<ChevronLeftIcon />}
        onClick={handleBackClick}
      >
        Back
      </Button>
      <Button
        sx={{ gridArea: 'submit' }}
        variant="contained"
        color="success"
        startIcon={<LockOpenIcon />}
        onClick={handleSubmitClick}
        disabled={
          subscriptionOptionData?.getSubscriptionOption.enabled === false
        }
      >
        Pay
      </Button>
    </Container>
  );
}
