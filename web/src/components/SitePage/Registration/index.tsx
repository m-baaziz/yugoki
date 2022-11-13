import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, Button, Typography, Divider } from '@mui/material';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  FileUploadKind,
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
import RegistrationForm, { RegistrationFilesInfo } from './RegistrationForm';
import { FileInfo } from '../../FilesForm';
import { useUploadFile } from '../../../hooks/fileUpload';

const DEFAULT_SUBSCRIBER_DETAILS: SubscriberDetailsInput = {
  firstname: '',
  lastname: '',
  gender: Gender.Other,
  email: '',
  address: '',
  phone: '',
  dateOfBirth: '',
  formEntriesValues: [],
};

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

const CREATE_SUBSCRIPTION = gql`
  mutation createSubscription(
    $siteId: ID!
    $subscriptionOptionId: ID!
    $details: SubscriberDetailsInput!
  ) {
    createSubscription(
      siteId: $siteId
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
  const [subscriptionFiles, setSubscriptionFiles] =
    React.useState<RegistrationFilesInfo>(new Map());
  const { siteId, subscriptionOptionId } = useParams();
  const navigate = useNavigate();
  const { uploadFile } = useUploadFile();

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
  const [createSubscription] = useMutation<
    { createSubscription: Subscription },
    MutationCreateSubscriptionArgs
  >(CREATE_SUBSCRIPTION);

  React.useEffect(() => {
    if (
      !subscriptionOptionData?.getSubscriptionOption ||
      subscriberDetailsInput.formEntriesValues.length ===
        subscriptionOptionData.getSubscriptionOption.formEntries.length
    )
      return;
    const formEntriesValues = Array(
      subscriptionOptionData.getSubscriptionOption.formEntries.length,
    ).fill('');
    setSubscriberDetailsInput({ ...subscriberDetailsInput, formEntriesValues });
  }, [subscriptionOptionData]);

  const handleDetailsChange = (details: SubscriberDetails) => {
    setSubscriberDetailsInput({ ...details });
  };
  const handleFileChange = (entryIndex: number) => (files: FileInfo[]) => {
    const newFiles = new Map(subscriptionFiles);
    if (files.length === 0) {
      newFiles.delete(entryIndex);
    } else {
      newFiles.set(entryIndex, files[0]);
    }
    setSubscriptionFiles(newFiles);
  };

  const handleBackClick = () => {
    navigate(`/sites/${siteId}`);
  };
  const handleSubmitClick = async () => {
    try {
      if (!siteId || !subscriptionOptionId) return;

      const formEntriesValues = {
        ...subscriberDetailsInput.formEntriesValues,
      };

      const fileEntriesKeys = Array.from(subscriptionFiles.keys()).filter(
        (key) =>
          subscriptionFiles.get(key)?.isNew && subscriptionFiles.get(key)?.file,
      );

      notify({
        level: NotificationLevel.INFO,
        message: `uploading ${fileEntriesKeys.length} files ...`,
      });

      await Promise.all(
        fileEntriesKeys.map((key) => {
          const fileInfo = subscriptionFiles.get(key) as FileInfo;
          return uploadFile(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            fileInfo.file!,
            FileUploadKind.SubscriptionFile,
          ).then((fileUpload) => {
            formEntriesValues[key] = fileUpload.id || '';
          });
        }),
      );

      await createSubscription({
        variables: {
          siteId,
          subscriptionOptionId,
          details: {
            ...subscriberDetailsInput,
            formEntriesValues,
          },
        },
      });
      notify({
        level: NotificationLevel.SUCCESS,
        message: 'Registration complete',
      });
      navigate(`/sites/${siteId}`);
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
        formEntries={
          subscriptionOptionData?.getSubscriptionOption.formEntries || []
        }
        files={subscriptionFiles}
        onFileChange={handleFileChange}
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
