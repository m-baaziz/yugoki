import * as React from 'react';
import { Box, styled, BoxProps } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import {
  QueryGetSubscriptionArgs,
  Subscription,
} from '../../../../generated/graphql';
import RegistrationForm from '../../../SitePage/Registration/RegistrationForm';

const GET_SUBSCRIPTION = gql`
  query getSubscription($siteId: ID!, $subscriptionOptionId: ID!, $id: ID!) {
    getSubscription(
      siteId: $siteId
      subscriptionOptionId: $subscriptionOptionId
      id: $id
    ) {
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
  const { siteId, subscriptionOptionId, id } = useParams();

  const { data: subscriptionData } = useQuery<
    { getSubscription: Subscription },
    QueryGetSubscriptionArgs
  >(GET_SUBSCRIPTION, {
    skip: !siteId || !subscriptionOptionId || !id,
    variables: {
      siteId: siteId || '',
      subscriptionOptionId: subscriptionOptionId || '',
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
