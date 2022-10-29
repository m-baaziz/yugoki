import * as React from 'react';
import { SxProps, Theme, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import {
  QueryListEnabledSubscriptionOptionsBySiteArgs,
  SubscriptionOptionPageInfo,
} from '../../../generated/graphql';
import SubscriptionOptionCard from './SubscriptionOptionCard';

const SUBSCRIPTION_OPTIONS_PAGE_SIZE = 100;

const LIST_SUBSCRIPTION_OPTIONS = gql`
  query listEnabledSubscriptionOptionsBySite(
    $siteId: ID!
    $first: Int!
    $after: String
  ) {
    listEnabledSubscriptionOptionsBySite(
      siteId: $siteId
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
  const { id: siteId } = useParams();

  const { data: subscriptionOptionsData } = useQuery<
    {
      listEnabledSubscriptionOptionsBySite: SubscriptionOptionPageInfo;
    },
    QueryListEnabledSubscriptionOptionsBySiteArgs
  >(LIST_SUBSCRIPTION_OPTIONS, {
    skip: !siteId,
    variables: {
      siteId: siteId || '',
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
      {subscriptionOptionsData?.listEnabledSubscriptionOptionsBySite.subscriptionOptions.map(
        (subscriptionOption, i) => (
          <Grid key={subscriptionOption.id || i} item xs={3}>
            <SubscriptionOptionCard subscriptionOption={subscriptionOption} />
          </Grid>
        ),
      )}
    </Grid>
  );
}
