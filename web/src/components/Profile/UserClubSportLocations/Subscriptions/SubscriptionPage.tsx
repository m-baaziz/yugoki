import * as React from 'react';
import { Box, styled, BoxProps } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import {
  QueryGetSubscriptionArgs,
  Subscription,
} from '../../../../generated/graphql';
import RegistrationForm from '../../../CslPage/Registration/RegistrationForm';

const GET_SUBSCRIPTION = gql`
  query getSubscription($id: ID!) {
    getSubscription(id: $id) {
      id
      createdAtRFC3339
      subscriptionOption {
        id
        title
        features
        price
        enabled
      }
      subscriberDetails {
        firstname
        lastname
        gender
        email
        address
        phone
        dateOfBirth
      }
    }
  }
`;

const Container = styled(Box)<BoxProps>(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplate:
    "  \
    '   .        .         .    '  4em  \
    '   .       info       .    '  1fr  \
    '   .        .         .    '  1em  \
    /  10%      1fr       10%           \
  ",
}));

export default function SubscriptionPage() {
  const { id } = useParams();

  const { data: subscriptionData } = useQuery<
    { getSubscription: Subscription },
    QueryGetSubscriptionArgs
  >(GET_SUBSCRIPTION, {
    skip: !id,
    variables: {
      id: id || '',
    },
    fetchPolicy: 'no-cache',
  });

  return (
    <Container>
      {subscriptionData?.getSubscription ? (
        <RegistrationForm
          details={subscriptionData?.getSubscription.subscriberDetails}
          readOnly
          sx={{
            gridArea: 'info',
            placeSelf: 'center',
            width: '100%',
            height: '100%',
          }}
        />
      ) : null}
    </Container>
  );
}
