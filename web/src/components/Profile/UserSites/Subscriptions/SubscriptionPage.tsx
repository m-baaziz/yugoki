import * as React from 'react';
import { Box, styled, BoxProps } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import {
  QueryGetSubscriptionArgs,
  QueryGetSubscriptionFilesArgs,
  QueryGetSubscriptionOptionArgs,
  Subscription,
  SubscriptionFile,
  SubscriptionOption,
} from '../../../../generated/graphql';
import RegistrationForm from '../../../SitePage/Registration/RegistrationForm';
import { FileInfo } from '../../../FilesForm';

const GET_SUBSCRIPTION_OPTION = gql`
  query getSubscriptionOption($siteId: ID!, $id: ID!) {
    getSubscriptionOption(siteId: $siteId, id: $id) {
      id
      title
      features
      price
      formEntries
    }
  }
`;

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

const GET_SUBSCRIPTION_FILES = gql`
  query getSubscriptionFiles(
    $siteId: ID!
    $subscriptionOptionId: ID!
    $id: ID!
  ) {
    getSubscriptionFiles(
      siteId: $siteId
      subscriptionOptionId: $subscriptionOptionId
      id: $id
    ) {
      formEntryIndex
      fileUpload {
        file {
          id
          size
          ext
          kind
        }
        url
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

  const { data: subscriptionOptionData } = useQuery<
    {
      getSubscriptionOption: SubscriptionOption;
    },
    QueryGetSubscriptionOptionArgs
  >(GET_SUBSCRIPTION_OPTION, {
    skip: !siteId || !subscriptionOptionId,
    variables: {
      siteId: siteId || '',
      id: subscriptionOptionId || '',
    },
    fetchPolicy: 'no-cache',
  });

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

  const { data: subscriptionFilesData } = useQuery<
    { getSubscriptionFiles: SubscriptionFile[] },
    QueryGetSubscriptionFilesArgs
  >(GET_SUBSCRIPTION_FILES, {
    skip: !siteId || !subscriptionOptionId || !id,
    variables: {
      siteId: siteId || '',
      subscriptionOptionId: subscriptionOptionId || '',
      id: id || '',
    },
    fetchPolicy: 'no-cache',
  });

  const subscriptionFiles = React.useMemo(() => {
    const init = new Map<number, FileInfo>();
    if (!subscriptionFilesData?.getSubscriptionFiles) return init;
    return subscriptionFilesData.getSubscriptionFiles.reduce(
      (acc, subscriptionFile) =>
        acc.set(subscriptionFile.formEntryIndex, {
          isNew: false,
          url: subscriptionFile.fileUpload.url || '',
          file: new File(
            [],
            subscriptionOptionData?.getSubscriptionOption.formEntries[
              subscriptionFile.formEntryIndex
            ].label || `entry ${subscriptionFile.formEntryIndex}`,
          ),
        }),
      new Map(init),
    );
  }, [subscriptionFilesData]);

  return (
    <Container>
      {subscriptionData?.getSubscription ? (
        <RegistrationForm
          details={subscriptionData?.getSubscription.subscriberDetails}
          formEntries={
            subscriptionOptionData?.getSubscriptionOption.formEntries || []
          }
          files={subscriptionFiles}
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
