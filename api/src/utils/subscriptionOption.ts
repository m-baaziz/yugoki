import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { SubscriptionOption } from '../generated/graphql';

export function parseSubscriptionOption(
  item: Record<string, AttributeValue>,
): SubscriptionOption {
  return {
    id: item.SubscriptionOptionId.S,
    site: item.SiteId.S,
    title: item.SubscriptionOptionTitle.S,
    price: parseFloat(item.SubscriptionOptionPrice.N),
    features: item.SubscriptionOptionFeatures.SS,
    enabled: item.SubscriptionOptionEnabled.BOOL,
  };
}

export function subscriptionOptionToRecord(
  subscriptionOption: SubscriptionOption,
): Record<string, AttributeValue> {
  return {
    SubscriptionOptionId: { S: subscriptionOption.id },
    SiteId: { S: subscriptionOption.site },
    SubscriptionOptionTitle: { S: subscriptionOption.title },
    SubscriptionOptionFeatures: { SS: subscriptionOption.features },
    SubscriptionOptionPrice: { N: subscriptionOption.price.toString() },
    SubscriptionOptionEnabled: { BOOL: subscriptionOption.enabled },
  };
}
