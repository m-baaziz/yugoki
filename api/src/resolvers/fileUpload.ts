import { ContextWithDataSources } from '../datasources';
import {
  QueryGetFileUploadArgs,
  FileUploadResponse,
  MutationCreateFileUploadArgs,
} from '../generated/graphql';
import { logger } from '../logger';
import { dbFileUploadToFileUpload } from '../utils/fileUpload';

export async function getFileUpload(
  _parent: unknown,
  { id }: QueryGetFileUploadArgs,
  { dataSources: { fileUploadAPI } }: ContextWithDataSources,
): Promise<FileUploadResponse> {
  try {
    const fileUpload = await fileUploadAPI.findFileUploadById(id);
    const url = await fileUploadAPI.generateFileUrlGet(id);
    return {
      file: dbFileUploadToFileUpload(fileUpload),
      url,
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
    const fileUpload = await fileUploadAPI.createFileUpload(input);
    const url = await fileUploadAPI.generateFileUrlPut(
      fileUpload._id.toString(),
    );
    return {
      file: dbFileUploadToFileUpload(fileUpload),
      url,
    };
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}
