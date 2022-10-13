import * as React from 'react';
import { SxProps, Theme, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import {
  QueryListEnabledSubscriptionOptionsByClubSportLocationArgs,
  SubscriptionOptionPageInfo,
} from '../../../generated/graphql';
import SubscriptionOptionCard from './SubscriptionOptionCard';

const SUBSCRIPTION_OPTIONS_PAGE_SIZE = 100;

const LIST_SUBSCRIPTION_OPTIONS = gql`
  query listEnabledSubscriptionOptionsByClubSportLocation(
    $cslId: ID!
    $first: Int!
    $after: String
  ) {
    listEnabledSubscriptionOptionsByClubSportLocation(
      cslId: $cslId
      first: $first
      after: $after
    ) {
      subscriptionOptions {
        id
        title
        features
        price
      }
      hasNextPage
      endCursor
    }
  }
`;

export type SubscriptionOptionsProps = {
  sx?: SxProps<Theme>;
};

export default function SubscriptionOptions(props: SubscriptionOptionsProps) {
  const { sx } = props;
  const { id: cslId } = useParams();

  const { data: subscriptionOptionsData } = useQuery<
    {
      listEnabledSubscriptionOptionsByClubSportLocation: SubscriptionOptionPageInfo;
    },
    QueryListEnabledSubscriptionOptionsByClubSportLocationArgs
  >(LIST_SUBSCRIPTION_OPTIONS, {
    skip: !cslId,
    variables: {
      cslId: cslId || '',
      first: SUBSCRIPTION_OPTIONS_PAGE_SIZE,
      after: '',
    },
    fetchPolicy: 'no-cache',
  });

  return (
    <Grid
      container
      spacing={2}
      sx={{
        height: '100%',
        width: '100%',
        ...sx,
      }}
    >
      {subscriptionOptionsData?.listEnabledSubscriptionOptionsByClubSportLocation.subscriptionOptions.map(
        (subscriptionOption, i) => (
          <Grid key={subscriptionOption.id || i} item xs={3}>
            <SubscriptionOptionCard subscriptionOption={subscriptionOption} />
          </Grid>
        ),
      )}
    </Grid>
  );
}
