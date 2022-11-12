import { AttributeValue } from '@aws-sdk/client-dynamodb';
import {
  FormEntry,
  FormEntryKind,
  SubscriptionOption,
} from '../generated/graphql';

export function parseFormEntryKind(kind: string): FormEntryKind | null {
  if (kind === 'Text') return FormEntryKind.Text;
  if (kind === 'File') return FormEntryKind.File;
  return null;
}

export function parseFormEntry(
  item: Record<string, AttributeValue>,
): FormEntry {
  return {
    label: item.Label.S,
    kind: parseFormEntryKind(item.Kind.S),
  };
}

export function formEntryToRecord(
  entry: FormEntry,
): Record<string, AttributeValue> {
  return {
    Label: { S: entry.label },
    Kind: { S: entry.kind },
  };
}

export function parseSubscriptionOption(
  item: Record<string, AttributeValue>,
): SubscriptionOption {
  return {
    id: item.SubscriptionOptionId.S,
    site: item.SiteId.S,
    title: item.SubscriptionOptionTitle.S,
    price: parseFloat(item.SubscriptionOptionPrice.N),
    features: item.SubscriptionOptionFeatures.L.map((f) => f.S),
    enabled: item.SubscriptionOptionEnabled.BOOL,
    formEntries: item.FormEntries.L.map((entry) => parseFormEntry(entry.M)),
  };
}

export function subscriptionOptionToRecord(
  subscriptionOption: SubscriptionOption,
): Record<string, AttributeValue> {
  return {
    SubscriptionOptionId: { S: subscriptionOption.id },
    SiteId: { S: subscriptionOption.site },
    SubscriptionOptionTitle: { S: subscriptionOption.title },
    SubscriptionOptionFeatures: {
      L: subscriptionOption.features.map((f) => ({ S: f })),
    },
    SubscriptionOptionPrice: { N: subscriptionOption.price.toString() },
    SubscriptionOptionEnabled: { BOOL: subscriptionOption.enabled },
    FormEntries: {
      L: subscriptionOption.formEntries.map((entry) => ({
        M: formEntryToRecord(entry),
      })),
    },
  };
}
