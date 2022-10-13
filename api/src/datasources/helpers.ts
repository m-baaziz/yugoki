import { Collection, Filter, ObjectId, WithId } from 'mongodb';

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
