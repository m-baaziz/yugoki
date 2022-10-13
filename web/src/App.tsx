import React, { ReactElement } from 'react';
import { Box, BoxProps, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
import CslPage from './components/CslPage';
import UserClubs from './components/Profile/UserClubs';
import UserClubSportLocations from './components/Profile/UserClubSportLocations';
import ClubSportLocationForm from './components/Profile/UserClubSportLocations/ClubSportLocationForm';
import UserClubTrainers from './components/Profile/UserClubTrainers';
import ClubTrainerForm from './components/Profile/UserClubTrainers/ClubTrainerForm';
import UserClub from './components/Profile/UserClubs/UserClub';
import Subscriptions from './components/Profile/UserClubSportLocations/Subscriptions';
import SubscriptionOptionForm from './components/Profile/UserClubSportLocations/Subscriptions/SubscriptionOptionForm';
import UserClubSportLocation from './components/Profile/UserClubSportLocations/UserClubSportLocation';
import Registration from './components/CslPage/Registration';
import SubscriptionPage from './components/Profile/UserClubSportLocations/Subscriptions/SubscriptionPage';

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
  const {
    data: meData,
    refetch: refetchMe,
    loading: userFetchLoading,
    called: userFetchCalled,
  } = useQuery<{ me: User }>(ME, {
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

  const withUser = (component: ReactElement): ReactElement => {
    if (userFetchCalled && !userFetchLoading && !meData?.me)
      return <Navigate replace to="/signin" />;
    if (meData?.me) return component;
    return (
      <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
        <CircularProgress sx={{ margin: 'auto' }} />
      </Box>
    );
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
            <Route path="/locations/:id" element={<CslPage />} />
            <Route
              path="/locations/:cslId/registration/:subscriptionOptionId"
              element={<Registration />}
            />
            <Route path="/profile/clubs" element={withUser(<UserClubs />)} />
            <Route path="/profile/clubs/:id" element={withUser(<UserClub />)} />
            <Route
              path="/profile/clubs/:id/trainers"
              element={withUser(<UserClubTrainers />)}
            />
            <Route
              path="/profile/clubs/:id/trainers/new"
              element={withUser(<ClubTrainerForm />)}
            />
            <Route
              path="/profile/clubs/:id/locations"
              element={withUser(<UserClubSportLocations />)}
            />
            <Route
              path="/profile/clubs/:id/locations/new"
              element={withUser(<ClubSportLocationForm />)}
            />
            <Route
              path="/profile/clubs/:clubId/locations/:cslId"
              element={withUser(<UserClubSportLocation />)}
            />
            <Route
              path="/profile/clubs/:clubId/locations/:cslId/subscriptions"
              element={withUser(<Subscriptions />)}
            />
            <Route
              path="/profile/clubs/:clubId/locations/:cslId/subscriptions/:id"
              element={withUser(<SubscriptionPage />)}
            />
            <Route
              path="/profile/clubs/:clubId/locations/:cslId/subscriptions/options/new"
              element={withUser(<SubscriptionOptionForm />)}
            />
          </Routes>
        </Content>
      </Container>
    </AppContext.Provider>
  );
}

export default App;
