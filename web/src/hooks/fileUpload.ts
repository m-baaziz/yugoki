import { gql, QueryResult, useMutation, useQuery } from '@apollo/client';
import {
  FileUpload,
  FileUploadKind,
  FileUploadResponse,
  MutationCreateFileUploadArgs,
  QueryGetFileUploadArgs,
} from '../generated/graphql';
import last from 'lodash/last';

const GET_FILE_UPLOAD = gql`
  query getFileUpload($id: ID!) {
    getFileUpload(id: $id) {
      file {
        id
        size
        ext
        kind
      }
      url
    }
  }
`;

const CREATE_FILE_UPLOAD = gql`
  mutation createFileUpload($input: FileUploadInput!) {
    createFileUpload(input: $input) {
      file {
        id
        size
        ext
        kind
      }
      url
    }
  }
`;

type UploadFileReturnType = {
  uploadFile: (file: File, kind: FileUploadKind) => Promise<FileUpload>;
};

export function useUploadFile(): UploadFileReturnType {
  const [createFileUpload] = useMutation<
    { createFileUpload: FileUploadResponse },
    MutationCreateFileUploadArgs
  >(CREATE_FILE_UPLOAD);

  const uploadFile = async (file: File, kind: FileUploadKind) => {
    try {
      const fileUploadResponse = await createFileUpload({
        variables: {
          input: {
            size: file.size,
            ext: last(file.name.split('.')) || '',
            kind,
          },
        },
      });
      const fileUpload = fileUploadResponse.data?.createFileUpload.file;
      const uploadUrl = fileUploadResponse.data?.createFileUpload.url;
      if (!fileUpload || !uploadUrl) {
        return Promise.reject('File upload failed');
      }
      const s3UploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
      });
      if (s3UploadResponse.status !== 200) {
        return Promise.reject(s3UploadResponse.text);
      }
      return Promise.resolve(fileUpload);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  return {
    uploadFile,
  };
}

export function useGetFile(
  id?: string,
): QueryResult<{ getFileUpload: FileUploadResponse }, QueryGetFileUploadArgs> {
  return useQuery<
    { getFileUpload: FileUploadResponse },
    QueryGetFileUploadArgs
  >(GET_FILE_UPLOAD, {
    skip: !id,
    variables: {
      id: id || '',
    },
    fetchPolicy: 'no-cache',
  });
}
