import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, Button, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import appContext, {
  LOCAL_STORAGE_TOKEN_KEY,
  NotificationLevel,
} from '../context';

const Container = styled(Box)<BoxProps>(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplate:
    "  \
    '   .        .       .    '  1em   \
    '   .      email     .    '  auto  \
    '   .        .       .    '  1em   \
    '   .     password   .    '  auto  \
    '   .        .       .    '  1em   \
    '   .     submit     .    '  auto  \
    '   .        .       .    '  1fr   \
    '   .     signup     .    '  auto  \
    '   .        .       .    '  1fr   \
    /  33%      1fr      33%           \
  ",
}));

type SignInResult = {
  signIn: string;
};

type SignInVars = {
  email: string;
  password: string;
};

const SIGN_IN = gql`
  mutation signIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password)
  }
`;

export type SignInProps = {
  refetchMe: () => void;
};

export default function SignIn(props: SignInProps) {
  const { refetchMe } = props;
  const { notify } = React.useContext(appContext);
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [signIn, { error: signInError, data: signInResult }] = useMutation<
    SignInResult,
    SignInVars
  >(SIGN_IN, {
    variables: { email, password },
  });
  const navigate = useNavigate();

  React.useEffect(() => {
    if (signInError?.message) {
      notify({
        level: NotificationLevel.ERROR,
        message: signInError.message,
      });
    }
  }, [signInError]);

  React.useEffect(() => {
    if (signInResult?.signIn) {
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, signInResult.signIn);
      refetchMe();
      navigate('/');
    }
  }, [signInResult]);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleSignInClick();
  };

  const handleSignInClick = () => {
    signIn();
  };

  return (
    <Container component="form" onSubmit={handleSubmit}>
      <TextField
        sx={{ gridArea: 'email' }}
        label="email"
        variant="standard"
        value={email}
        onChange={handleEmailChange}
      />
      <TextField
        sx={{ gridArea: 'password' }}
        label="password"
        variant="standard"
        type="password"
        value={password}
        onChange={handlePasswordChange}
      />
      <Button
        type="submit"
        sx={{ gridArea: 'submit' }}
        variant="outlined"
        onClick={handleSignInClick}
      >
        Pro
      </Button>
      <Typography sx={{ gridArea: 'signup' }}>
        Don't have an account ?{' '}
        <Link to="/signup" style={{ textDecoration: 'none' }}>
          sign up
        </Link>
      </Typography>
    </Container>
  );
}
