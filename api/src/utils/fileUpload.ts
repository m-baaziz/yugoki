import {
  FileUpload,
  FileUploadDbObject,
  FileUploadKind,
} from '../generated/graphql';

export function parseFileUploadKind(kind: string): FileUploadKind | null {
  if (kind === 'SiteImage') return FileUploadKind.SiteImage;
  if (kind === 'EventImage') return FileUploadKind.EventImage;
  if (kind === 'TrainerPhoto') return FileUploadKind.TrainerPhoto;
  if (kind === 'ClubLogo') return FileUploadKind.ClubLogo;
  return null;
}

export function dbFileUploadToFileUpload(
  fileUpload: FileUploadDbObject,
): FileUpload {
  const { _id, size, ext, kind } = fileUpload;
  return {
    id: _id.toString(),
    size,
    ext,
    kind: parseFileUploadKind(kind),
  };
}
