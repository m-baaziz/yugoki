import { Gender } from '../generated/graphql';

export function parseGender(value: string): Gender {
  if (value.toLowerCase() === 'female') return Gender.Female;
  if (value.toLowerCase() === 'male') return Gender.Male;
  return Gender.Other;
}
