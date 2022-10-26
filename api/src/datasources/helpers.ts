import {
  DynamoDBClient,
  QueryCommand,
  BatchGetItemCommand,
  BatchWriteItemCommand,
  AttributeValue,
  QueryCommandInput,
} from '@aws-sdk/client-dynamodb';
import chunk from 'lodash/chunk';
import flatten from 'lodash/flatten';
import { Collection, Filter, ObjectId, WithId } from 'mongodb';

const BATCH_GET_MAX_REQUESTS = 100;
const BATCH_WRITE_MAX_REQUESTS = 25;

export async function listByFilter<T>(
  collection: Collection<T>,
  filter: Filter<T>,
  first: number,
  after?: string,
): Promise<[WithId<T>[], boolean]> {
  try {
    const newFilter = {
      ...filter,
      ...(after
        ? {
            _id: {
              $gt: new ObjectId(after),
            },
          }
        : {}),
    };
    const cursor = collection
      .find(newFilter)
      .limit(first + 1)
      .sort({ _id: 1 });
    const clubs = await cursor.toArray();
    const hasNext = clubs.length > first;
    if (hasNext) {
      clubs.pop();
    }
    return Promise.resolve([clubs, hasNext]);
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function batchGet<T>(
  dynamodbClient: DynamoDBClient,
  tableName: string,
  keys: Record<string, AttributeValue>[],
  parse: (item: Record<string, AttributeValue>) => T,
  projectionKeys?: string[],
): Promise<T[]> {
  try {
    const keysChunks = chunk(keys, BATCH_GET_MAX_REQUESTS);
    const results = flatten(
      await Promise.all(
        keysChunks.map((keysChunk) =>
          dynamodbClient
            .send(
              new BatchGetItemCommand({
                RequestItems: {
                  [tableName]: {
                    Keys: keysChunk,
                    ProjectionExpression: projectionKeys
                      ? projectionKeys.join(',')
                      : undefined,
                  },
                },
              }),
            )
            .then((output) => output.Responses[tableName].map(parse)),
        ),
      ),
    );
    return Promise.resolve(results);
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function batchDelete(
  dynamodbClient: DynamoDBClient,
  tableName: string,
  queryCommandInput: QueryCommandInput,
  getKey: (
    item: Record<string, AttributeValue>,
  ) => Record<string, AttributeValue>,
): Promise<number> {
  try {
    let lastEvaluatedKey: Record<string, AttributeValue> | undefined =
      undefined;
    let init = true;
    let totalDeleted = 0;
    while (lastEvaluatedKey || init) {
      init = false;
      const result = await dynamodbClient.send(
        new QueryCommand({
          ...queryCommandInput,
          Limit: BATCH_WRITE_MAX_REQUESTS,
          ExclusiveStartKey: lastEvaluatedKey,
        }),
      );
      lastEvaluatedKey = result.LastEvaluatedKey;
      const deleteRequests = result.Items.map((item) => ({
        DeleteRequest: {
          Key: getKey(item),
        },
      }));
      const batchResult = await dynamodbClient.send(
        new BatchWriteItemCommand({
          RequestItems: {
            [tableName]: deleteRequests,
          },
        }),
      );
      totalDeleted +=
        deleteRequests.length -
        Object.keys(batchResult.UnprocessedItems || {}).length;
    }

    return Promise.resolve(totalDeleted);
  } catch (e) {
    return Promise.reject(e);
  }
  return 0;
}
