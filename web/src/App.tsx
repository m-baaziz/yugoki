import React from 'react';
import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useQuery, gql } from '@apollo/client';

import './App.css';
import AppContext, { LOCAL_STORAGE_TOKEN_KEY, Notification } from './context';
import { User } from './generated/graphql';
import ButtonAppBar, {
  ButtonAppBarProps as AppBarProps,
} from './components/AppBar';
import Home from './components/Home';
import CslList from './components/CslList';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

const Container = styled(Box)<BoxProps>(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Content = styled(Box)<BoxProps>(() => ({}));

const AppBar = styled(ButtonAppBar)<AppBarProps>(() => ({
  width: '100%',
}));

const ME = gql`
  query me {
    me {
      id
      email
    }
  }
`;

function App() {
  const [user, setUser] = React.useState<User | undefined>();
  const [notification, setNotification] = React.useState<
    Notification | undefined
  >();
  const { data: meData, refetch: refetchMe } = useQuery<{ me: User }>(ME, {
    skip: localStorage.getItem('token') === null,
    fetchPolicy: 'no-cache',
  });
  const navigate = useNavigate();

  React.useEffect(() => {
    if (meData?.me) {
      setUser(meData.me);
    }
  }, [meData]);

  const handleCloseNotification = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification(undefined);
  };

  const handleLogOut = () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    setUser(undefined);
    navigate('/');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        notify: setNotification,
      }}
    >
      <Container>
        <AppBar title="Yugoki" onLogOut={handleLogOut} />
        <Snackbar
          open={!!notification}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={handleCloseNotification}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification?.level}
            sx={{ width: '100%' }}
          >
            {notification?.message}
          </Alert>
        </Snackbar>
        <Content sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn refetchMe={refetchMe} />} />
            <Route path="/signup" element={<SignUp refetchMe={refetchMe} />} />
            <Route path="/clubs" element={<CslList />} />
          </Routes>
        </Content>
      </Container>
    </AppContext.Provider>
  );
}

export default App;
