import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { FileUpload, FileUploadKind } from '../generated/graphql';

export function parseFileUploadKind(kind: string): FileUploadKind | null {
  if (kind === 'SiteImage') return FileUploadKind.SiteImage;
  if (kind === 'EventImage') return FileUploadKind.EventImage;
  if (kind === 'TrainerPhoto') return FileUploadKind.TrainerPhoto;
  if (kind === 'ClubLogo') return FileUploadKind.ClubLogo;
  return null;
}

export function parseFileUpload(
  item: Record<string, AttributeValue>,
): FileUpload {
  return {
    id: item.FileUploadId.S,
    size: parseInt(item.FileUploadSize.N, 10),
    ext: item.FileUploadExt.S,
    kind: parseFileUploadKind(item.FileUploadKind.S),
  };
}

export function fileUploadToRecord(
  fileUpload: FileUpload,
): Record<string, AttributeValue> {
  return {
    FileUploadId: { S: fileUpload.id },
    FileUploadSize: { N: fileUpload.size.toString() },
    FileUploadExt: { S: fileUpload.ext },
    FileUploadKind: { S: fileUpload.kind },
  };
}
