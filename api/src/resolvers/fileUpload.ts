import { ContextWithDataSources } from '../datasources';
import {
  QueryGetFileUploadArgs,
  FileUploadResponse,
  MutationCreateFileUploadArgs,
} from '../generated/graphql';
import { logger } from '../logger';

export async function getFileUpload(
  _parent: unknown,
  { id }: QueryGetFileUploadArgs,
  { dataSources: { fileUploadAPI } }: ContextWithDataSources,
): Promise<FileUploadResponse> {
  try {
    return {
      file: await fileUploadAPI.findFileUploadById(id),
      url: await fileUploadAPI.generateFileUrlGet(id),
    };
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function createFileUpload(
  _parent: unknown,
  { input }: MutationCreateFileUploadArgs,
  { user, dataSources: { fileUploadAPI } }: ContextWithDataSources,
): Promise<FileUploadResponse> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    const file = await fileUploadAPI.createFileUpload(input);
    return {
      file,
      url: await fileUploadAPI.generateFileUrlPut(file.id),
    };
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}
