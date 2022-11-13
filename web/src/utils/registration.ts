import { FormEntryKind, Gender } from '../generated/graphql';

export function parseGender(value: string): Gender {
  if (value.toLowerCase() === 'female') return Gender.Female;
  if (value.toLowerCase() === 'male') return Gender.Male;
  return Gender.Other;
}

export function parseFormEntryKind(value: string): FormEntryKind | null {
  if (value.toLocaleLowerCase() === 'text') return FormEntryKind.Text;
  if (value.toLocaleLowerCase() === 'file') return FormEntryKind.File;
  return null;
}
