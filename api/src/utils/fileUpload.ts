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
    id: item.Id.S,
    size: parseInt(item.Size.N, 10),
    ext: item.Ext.S,
    kind: parseFileUploadKind(item.Kind.S),
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
