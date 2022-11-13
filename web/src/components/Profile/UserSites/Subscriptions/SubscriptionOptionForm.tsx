/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */

import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  BoxProps,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { gql, useMutation } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import pullAt from 'lodash/pullAt';
import {
  FormEntryInput,
  FormEntryKind,
  MutationCreateSubscriptionOptionArgs,
  SubscriptionOption,
  SubscriptionOptionInput,
} from '../../../../generated/graphql';
import appContext, { NotificationLevel } from '../../../../context';
import { parseFormEntryKind } from '../../../../utils/registration';
import LabelInputCombo from '../../../LabelInputCombo';

const DEFAULT_FORM_ENTRY: FormEntryInput = {
  label: '',
  kind: FormEntryKind.Text,
};

const DEFAULT_SUBSCRIPTION_OPTION: SubscriptionOptionInput = {
  title: '',
  features: [],
  price: 0,
  formEntries: [],
};

const CREATE_SUBSCRIPTION_OPTION = gql`
  mutation createSubscriptionOption(
    $siteId: ID!
    $input: SubscriptionOptionInput!
  ) {
    createSubscriptionOption(siteId: $siteId, input: $input) {
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
  const { clubId, siteId } = useParams();
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
  const handleNewFormEntryClick = () => {
    setSubscriptionOptionInput({
      ...subscriptionOptionInput,
      formEntries: [
        ...subscriptionOptionInput.formEntries,
        { ...DEFAULT_FORM_ENTRY },
      ],
    });
  };
  const handleChangeFormEntryLabel =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const formEntries = [...subscriptionOptionInput.formEntries];
      formEntries[index].label = e.target.value;
      setSubscriptionOptionInput({
        ...subscriptionOptionInput,
        formEntries,
      });
    };

  const handleChangeFormEntryKind =
    (index: number) =>
    (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
      const formEntries = [...subscriptionOptionInput.formEntries];
      const kind = parseFormEntryKind(value);
      if (!kind) {
        console.error('unexpected null form entry type');
        return;
      }
      formEntries[index].kind = kind;
      setSubscriptionOptionInput({
        ...subscriptionOptionInput,
        formEntries,
      });
    };

  const handleClickDelete = (index: number) => () => {
    const formEntries = [...subscriptionOptionInput.formEntries];
    pullAt(formEntries, [index]);
    setSubscriptionOptionInput({
      ...subscriptionOptionInput,
      formEntries,
    });
  };

  const handleBackClick = () => {
    navigate(`/profile/clubs/${clubId}/sites/${siteId}/subscriptions`);
  };
  const handleSubmitClick = async () => {
    try {
      if (!siteId) return;
      const result = await createSubscriptionOption({
        variables: {
          siteId,
          input: subscriptionOptionInput,
        },
      });
      notify({
        level: NotificationLevel.SUCCESS,
        message: `created ${result.data?.createSubscriptionOption.title}`,
      });
      navigate(`/profile/clubs/${clubId}/sites/${siteId}/subscriptions`);
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
        <Button
          variant="outlined"
          onClick={handleNewFormEntryClick}
          startIcon={<AddIcon />}
        >
          New Form Entry
        </Button>
        {subscriptionOptionInput.formEntries.map((formEntry, i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <TextField
              id={`label-${i}`}
              label="Label"
              variant="outlined"
              value={formEntry.label}
              onChange={handleChangeFormEntryLabel(i)}
              required
              sx={{ flexGrow: 2 }}
            />
            <FormControl>
              <FormLabel id="type-radio-buttons-group-label">
                Entry Type
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="type-radio-buttons-group-label"
                name="type-row-radio-buttons-group"
                value={formEntry.kind}
                onChange={handleChangeFormEntryKind(i)}
              >
                <FormControlLabel
                  value={FormEntryKind.Text}
                  control={<Radio />}
                  label="Text"
                />
                <FormControlLabel
                  value={FormEntryKind.File}
                  control={<Radio />}
                  label="File"
                />
              </RadioGroup>
            </FormControl>
            <Box sx={{ display: 'flex' }}>
              <IconButton
                aria-label="delete"
                size="small"
                sx={{ margin: 'auto' }}
                onClick={handleClickDelete(i)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        ))}
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
