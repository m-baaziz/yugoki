import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import appContext, { NotificationLevel } from '../context';
import config from '../config';

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
    '   .     confirm    .    '  auto  \
    '   .        .       .    '  1em   \
    '   .     submit     .    '  auto  \
    '   .        .       .    '  1fr   \
    /  33%      1fr      33%           \
  ",
}));

type SignUpResult = {
  signUp: string;
};

type SignUpVars = {
  email: string;
  password: string;
};

const SIGN_UP = gql`
  mutation signUp($email: String!, $password: String!) {
    signUp(email: $email, password: $password)
  }
`;

export type SignUpProps = {
  refetchMe: () => void;
};

export default function SignUp(props: SignUpProps) {
  const { refetchMe } = props;
  const { notify } = React.useContext(appContext);
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] =
    React.useState<string>('');
  const [signUp, { error: signUpError, data: signUpResult }] = useMutation<
    SignUpResult,
    SignUpVars
  >(SIGN_UP, {
    variables: { email, password },
  });
  const navigate = useNavigate();

  React.useEffect(() => {
    if (signUpError?.message) {
      notify({
        level: NotificationLevel.ERROR,
        message: signUpError.message,
      });
    }
  }, [signUpError]);

  React.useEffect(() => {
    if (signUpResult?.signUp) {
      localStorage.setItem(config.tokenCacheKey, signUpResult.signUp);
      refetchMe();
      navigate('/');
    }
  }, [signUpResult]);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handlePasswordConfirmationChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPasswordConfirmation(event.target.value);
  };

  const callSignUp = () => {
    if (passwordConfirmation !== password) {
      notify({
        level: NotificationLevel.ERROR,
        message: 'Password confirmation invalid',
      });
      return;
    }
    signUp().catch(console.error);
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLDivElement>) => {
    e.preventDefault();
    callSignUp();
  };

  const handleSignUpClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    callSignUp();
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
      <TextField
        sx={{ gridArea: 'confirm' }}
        label="password"
        variant="standard"
        type="password"
        value={passwordConfirmation}
        onChange={handlePasswordConfirmationChange}
      />
      <Button
        type="submit"
        sx={{ gridArea: 'submit' }}
        variant="outlined"
        onClick={handleSignUpClick}
      >
        Sign Up
      </Button>
    </Container>
  );
}
