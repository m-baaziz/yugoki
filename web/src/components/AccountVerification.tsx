import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, CircularProgress, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { MutationVerifyArgs, User } from '../generated/graphql';
import appContext, { NotificationLevel } from '../context';

const TOKEN_PARAM_KEY = 'token';
export const PATH_NAME = '/verify';

// http://localhost:3000/verify?token=$2a$05$5rYJSkSAhpDB6.c6G985COz3kiIXFRKY9hwhCauBVCKylhg0IO9KO

const Container = styled(Box)<BoxProps>(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplate:
    "  \
    '   .        .       .    '  1fr   \
    '   .     content    .    '  auto  \
    '   .        .       .    '  2fr   \
    /  10%      1fr      10%           \
  ",
}));

const VERIFY = gql`
  mutation verify($token: String!) {
    verify(token: $token) {
      id
      email
      isVerified
    }
  }
`;

export type AccountVerificationProps = {
  refetchMe: () => void;
};

export default function AccountVerification(props: AccountVerificationProps) {
  const { refetchMe } = props;
  const { search } = useLocation();
  const { notify, user } = React.useContext(appContext);

  const verificationToken = React.useMemo(() => {
    const params = new window.URLSearchParams(search);
    return params.get(TOKEN_PARAM_KEY);
  }, [search]);

  const [verify, { error: verifyError, data: verifyData }] = useMutation<
    { verify: User },
    MutationVerifyArgs
  >(VERIFY, {
    variables: {
      token: verificationToken || '',
    },
  });

  React.useEffect(() => {
    if (verificationToken) {
      verify()
        .then(() => refetchMe())
        .catch(console.error);
    }
  }, [verificationToken]);

  React.useEffect(() => {
    if (verifyError?.message) {
      notify({
        level: NotificationLevel.ERROR,
        message: verifyError.message,
      });
    }
  }, [verifyError]);

  return (
    <Container>
      <Box sx={{ gridArea: 'content', placeSelf: 'center' }}>
        {verifyData?.verify.isVerified ? (
          <Typography>
            Account {verifyData?.verify.email} successfully verified !
          </Typography>
        ) : verifyError ? (
          <Typography>Failed to verify account {user?.email}</Typography>
        ) : (
          <CircularProgress />
        )}
      </Box>
    </Container>
  );
}
