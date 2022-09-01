import { ClubSportLocationSearchQueryInput } from '../generated/graphql';
import utf8 from 'utf8';

export const QUERY_KEY = 'search';
export const DEFAULT_QUERY: ClubSportLocationSearchQueryInput = {
  sport: '630d3903c8972c1b4d5eb3f6',
  address: '川崎',
};

export function encodeQuery(query: ClubSportLocationSearchQueryInput): string {
  const stringifiedJson = JSON.stringify(query);
  const utf8String = utf8.encode(stringifiedJson);
  const b64String = window.btoa(utf8String);
  return window.encodeURIComponent(b64String);
}

export function decodeQuery(query: string): ClubSportLocationSearchQueryInput {
  const decodedUriComp = window.decodeURIComponent(query);
  const stringifiedJson = window.atob(decodedUriComp);
  const utf8DecodedString = utf8.decode(stringifiedJson);
  return JSON.parse(utf8DecodedString);
}
