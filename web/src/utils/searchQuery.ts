import { ClubSportLocationSearchQueryInput } from '../generated/graphql';

export const QUERY_KEY = 'search';

export function encodeQuery(query: ClubSportLocationSearchQueryInput): string {
  const stringifiedJson = JSON.stringify(query);
  const b64String = window.btoa(stringifiedJson);
  return window.encodeURIComponent(b64String);
}

export function decodeQuery(query: string): ClubSportLocationSearchQueryInput {
  const decodedUriComp = window.decodeURIComponent(query);
  const stringifiedJson = window.atob(decodedUriComp);
  return JSON.parse(stringifiedJson);
}
