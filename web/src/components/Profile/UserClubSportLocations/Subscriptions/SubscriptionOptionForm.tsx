/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */

import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  BoxProps,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { gql, useMutation } from '@apollo/client';
import {
  MutationCreateSubscriptionOptionArgs,
  SubscriptionOption,
  SubscriptionOptionInput,
} from '../../../../generated/graphql';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate, useParams } from 'react-router-dom';
import appContext, { NotificationLevel } from '../../../../context';
import LabelInputCombo from '../../../LabelInputCombo';
import pullAt from 'lodash/pullAt';

const DEFAULT_SUBSCRIPTION_OPTION: SubscriptionOptionInput = {
  title: '',
  features: [],
  price: 0,
};

const CREATE_SUBSCRIPTION_OPTION = gql`
  mutation createSubscriptionOption(
    $cslId: ID!
    $input: SubscriptionOptionInput!
  ) {
    createSubscriptionOption(cslId: $cslId, input: $input) {
      id
      title
    }
  }
`;

const Container = styled(Box)<BoxProps>(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplate:
    "  \
    '   .        .       .       .       .      '  1em  \
    '   .      form    form    form      .      '  auto \
    '   .        .       .       .       .      '  1fr  \
    '   .        .       .       .       .      '  2em  \
    '   .     cancel     .     submit    .      '  auto \
    '   .        .       .       .       .      '  1em  \
    /  10%      auto     1fr    auto    10%             \
  ",
}));

export default function SubscriptionOptionForm() {
  const { notify } = React.useContext(appContext);
  const [subscriptionOptionInput, setSubscriptionOptionInput] =
    React.useState<SubscriptionOptionInput>(DEFAULT_SUBSCRIPTION_OPTION);
  const { clubId, cslId } = useParams();
  const navigate = useNavigate();
  const [priceInputValue, setPriceInputValue] = React.useState(
    subscriptionOptionInput.price.toString(),
  );
  const [newFeatureInputValue, setNewFeatureInputValue] = React.useState('');

  const [createSubscriptionOption] = useMutation<
    { createSubscriptionOption: SubscriptionOption },
    MutationCreateSubscriptionOptionArgs
  >(CREATE_SUBSCRIPTION_OPTION);

  const handleTextInputChange =
    (key: keyof SubscriptionOptionInput) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSubscriptionOptionInput({
        ...subscriptionOptionInput,
        [key]: e.target.value,
      });
    };
  const handleFeatureChange = (index: number) => (feature: string) => {
    const newSubscriptionOptionInput = { ...subscriptionOptionInput };
    if (newSubscriptionOptionInput.features.length <= index) return;
    if (feature.length === 0) {
      pullAt(newSubscriptionOptionInput.features, [index]);
    } else {
      newSubscriptionOptionInput.features[index] = feature;
    }
    setSubscriptionOptionInput(newSubscriptionOptionInput);
  };
  const handleNewFeatureInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewFeatureInputValue(e.target.value);
  };
  const handleNewFeatureSubmit = (e: React.ChangeEvent<HTMLDivElement>) => {
    e.preventDefault();
    const newSubscriptionOptionInput = { ...subscriptionOptionInput };
    newSubscriptionOptionInput.features.push(newFeatureInputValue);
    setSubscriptionOptionInput(newSubscriptionOptionInput);
    setNewFeatureInputValue('');
  };
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceInputValue(e.target.value);
    try {
      const parsedPrice = parseFloat(e.target.value);
      setSubscriptionOptionInput({
        ...subscriptionOptionInput,
        price: isNaN(parsedPrice) ? 0 : parsedPrice,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleBackClick = () => {
    navigate(`/profile/clubs/${clubId}/locations/${cslId}/subscriptions`);
  };
  const handleSubmitClick = async () => {
    try {
      if (!cslId) return;
      const result = await createSubscriptionOption({
        variables: {
          cslId,
          input: subscriptionOptionInput,
        },
      });
      notify({
        level: NotificationLevel.SUCCESS,
        message: `created ${result.data?.createSubscriptionOption.title}`,
      });
      navigate(`/profile/clubs/${clubId}/locations/${cslId}/subscriptions`);
    } catch (e) {
      notify({ level: NotificationLevel.ERROR, message: `${e}` });
    }
  };

  return (
    <Container>
      <Stack
        spacing={5}
        sx={{
          gridArea: 'form',
          placeSelf: 'center',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TextField
          id="title"
          label="title"
          variant="standard"
          required
          value={subscriptionOptionInput.title}
          onChange={handleTextInputChange('title')}
        />
        <List
          component="nav"
          aria-labelledby="list-subheader"
          subheader={
            <ListSubheader component="div" id="list-subheader">
              Features
            </ListSubheader>
          }
        >
          {subscriptionOptionInput.features.map((feature, i) => (
            <ListItem key={i}>
              <LabelInputCombo
                value={feature}
                inputLabel={`${i + 1}`}
                onChange={handleFeatureChange(i)}
                sx={{ width: '100%' }}
                fullWidth
              >
                <ListItemText key={i} primary={feature} />
              </LabelInputCombo>
            </ListItem>
          ))}
          <ListItem>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText>
              <Box component="form" onSubmit={handleNewFeatureSubmit}>
                <TextField
                  id="new-feature"
                  label=""
                  variant="standard"
                  fullWidth
                  value={newFeatureInputValue}
                  onChange={handleNewFeatureInputChange}
                />
                <input type="submit" hidden />
              </Box>
            </ListItemText>
          </ListItem>
        </List>
        <TextField
          id="price"
          label="price"
          type="number"
          variant="filled"
          value={priceInputValue}
          onChange={handlePriceChange}
        />
      </Stack>
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
        startIcon={<CheckCircleIcon />}
        onClick={handleSubmitClick}
      >
        Submit
      </Button>
    </Container>
  );
}
