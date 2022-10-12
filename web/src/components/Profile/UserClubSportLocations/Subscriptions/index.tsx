import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, Button, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, gql, useMutation } from '@apollo/client';
import {
  MutationDisableSubscriptionOptionArgs,
  MutationEnableSubscriptionOptionArgs,
  QueryListSubscriptionOptionsByClubSportLocationArgs,
  SubscriptionOption,
  SubscriptionOptionPageInfo,
} from '../../../../generated/graphql';
import SubscriptionOptionCard from './SubscriptionOptionCard';
import appContext, { NotificationLevel } from '../../../../context';

const SUBSCRIPTION_OPTIONS_PAGE_SIZE = 100;

const LIST_SUBSCRIPTION_OPTIONS = gql`
  query listSubscriptionOptionsByClubSportLocation(
    $cslId: ID!
    $first: Int!
    $after: String
  ) {
    listSubscriptionOptionsByClubSportLocation(
      cslId: $cslId
      first: $first
      after: $after
    ) {
      subscriptionOptions {
        id
        title
        features
        price
        enabled
      }
      hasNextPage
      endCursor
    }
  }
`;

const ENABLE_SUBSCRIPTION_OPTION = gql`
  mutation enableSubscriptionOption($id: ID!) {
    enableSubscriptionOption(id: $id) {
      id
    }
  }
`;

const DISABLE_SUBSCRIPTION_OPTION = gql`
  mutation disableSubscriptionOption($id: ID!) {
    disableSubscriptionOption(id: $id) {
      id
    }
  }
`;

const Container = styled(Box)<BoxProps>(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplate:
    "  \
    '   .        .         .    '  1em  \
    '   .     newOption    .    '  auto \
    '   .        .         .    '  1em  \
    '   .      options     .    '  1fr  \
    '   .        .         .    '  4em  \
    '   .      table       .    '  1fr  \
    '   .        .         .    '  1em  \
    /  10%      1fr       10%           \
  ",
}));

export default function Subscriptions() {
  const { notify } = React.useContext(appContext);
  const { cslId } = useParams();
  const navigate = useNavigate();

  const { data: subscriptionOptionsData, refetch } = useQuery<
    { listSubscriptionOptionsByClubSportLocation: SubscriptionOptionPageInfo },
    QueryListSubscriptionOptionsByClubSportLocationArgs
  >(LIST_SUBSCRIPTION_OPTIONS, {
    skip: !cslId,
    variables: {
      cslId: cslId || '',
      first: SUBSCRIPTION_OPTIONS_PAGE_SIZE,
      after: '',
    },
    fetchPolicy: 'no-cache',
  });
  const [enableSubscriptionOption] = useMutation<
    { enableSubscriptionOption: SubscriptionOption },
    MutationEnableSubscriptionOptionArgs
  >(ENABLE_SUBSCRIPTION_OPTION);
  const [disableSubscriptionOption] = useMutation<
    { disableSubscriptionOption: SubscriptionOption },
    MutationDisableSubscriptionOptionArgs
  >(DISABLE_SUBSCRIPTION_OPTION);

  const handleClickNewOption = () => {
    navigate('options/new');
  };

  const handleOnEnableDisableOption = async (id: string, enable: boolean) => {
    try {
      if (enable) {
        await enableSubscriptionOption({
          variables: {
            id,
          },
        });
      } else {
        await disableSubscriptionOption({
          variables: {
            id,
          },
        });
      }
      await refetch();
    } catch (e) {
      notify({ level: NotificationLevel.ERROR, message: `${e}` });
    }
  };

  return (
    <Container>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleClickNewOption}
        sx={{ gridArea: 'newOption' }}
      >
        New Subscription Option
      </Button>
      <Grid
        container
        spacing={2}
        sx={{
          gridArea: 'options',
          placeSelf: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        {subscriptionOptionsData?.listSubscriptionOptionsByClubSportLocation.subscriptionOptions.map(
          (subscriptionOption, i) => (
            <Grid key={subscriptionOption.id || i} item xs={3}>
              <SubscriptionOptionCard
                subscriptionOption={subscriptionOption}
                onEnableDisable={handleOnEnableDisableOption}
              />
            </Grid>
          ),
        )}
      </Grid>
    </Container>
  );
}
