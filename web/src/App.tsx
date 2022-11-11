import React, { ReactElement } from 'react';
import { Box, BoxProps, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useQuery, gql } from '@apollo/client';

import './App.css';
import AppContext, {
  NavigationState,
  Notification,
  NotificationLevel,
} from './context';
import config from './config';
import { useWsHandlers } from './hooks/ws';
import { User } from './generated/graphql';
import ButtonAppBar, {
  ButtonAppBarProps as AppBarProps,
} from './components/AppBar';
import Home from './components/Home';
import SiteList from './components/SiteList';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import SitePage from './components/SitePage';
import UserClubs from './components/Profile/UserClubs';
import UserSites from './components/Profile/UserSites';
import SiteForm from './components/Profile/UserSites/SiteForm';
import UserClubTrainers from './components/Profile/UserClubTrainers';
import ClubTrainerForm from './components/Profile/UserClubTrainers/ClubTrainerForm';
import UserClub from './components/Profile/UserClubs/UserClub';
import Subscriptions from './components/Profile/UserSites/Subscriptions';
import SubscriptionOptionForm from './components/Profile/UserSites/Subscriptions/SubscriptionOptionForm';
import UserClubSite from './components/Profile/UserSites/UserClubSite';
import Registration from './components/SitePage/Registration';
import SubscriptionPage from './components/Profile/UserSites/Subscriptions/SubscriptionPage';
import SiteEvents from './components/Profile/UserSites/SiteEvents';
import SiteEvent from './components/Profile/UserSites/SiteEvents/SiteEvent';
import NewSiteEvent from './components/Profile/UserSites/SiteEvents/NewSiteEvent';
import Wip from './components/Wip';
import UserChat from './components/UserChat';
import SiteChat from './components/Profile/UserSites/SiteChat';
import AccountVerification, {
  PATH_NAME as ACCOUNT_VERIF_PATH_NAME,
} from './components/AccountVerification';

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
      isVerified
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
  const location = useLocation();
  const {
    connect: connectWs,
    disconnect: disconnectWs,
    setNewMessageHandler,
  } = useWsHandlers();

  React.useEffect(() => {
    if (meData?.me) {
      setUser(meData.me);
      connectWs();
      if (
        !meData.me.isVerified &&
        location.pathname !== ACCOUNT_VERIF_PATH_NAME
      ) {
        setNotification({
          level: NotificationLevel.WARNING,
          message:
            'Your account is not verified yet. Please check your e-mails.',
        });
      }
    } else {
      disconnectWs();
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
    localStorage.removeItem(config.tokenCacheKey);
    setUser(undefined);
    navigate('/');
  };

  const withUser = (
    path: string,
    element: ReactElement,
  ): { path: string; element: ReactElement } => {
    if (userFetchCalled && !userFetchLoading && !meData?.me) {
      const navState: NavigationState = {
        nextRoute: `${location.pathname}${location.search}`,
      };
      return {
        path,
        element: <Navigate replace to="/signin" state={navState} />,
      };
    }
    if (meData?.me) return { path, element };
    return {
      path,
      element: (
        <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
          <CircularProgress sx={{ margin: 'auto' }} />
        </Box>
      ),
    };
  };

  return (
    <AppContext.Provider
      value={{
        user,
        notify: setNotification,
        setNewMessageHandler,
      }}
    >
      <Container>
        <AppBar title="Limbz" onLogOut={handleLogOut} />
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
            <Route
              {...withUser(
                ACCOUNT_VERIF_PATH_NAME,
                <AccountVerification refetchMe={refetchMe} />,
              )}
            />
            <Route {...withUser('/messages', <UserChat />)} />
            <Route path="/sites" element={<SiteList />} />
            <Route path="/sites/:id" element={<SitePage />} />
            <Route
              path="/sites/:siteId/registration/:subscriptionOptionId"
              element={<Registration />}
            />
            <Route {...withUser('/profile/clubs', <UserClubs />)} />
            <Route {...withUser('/profile/clubs/:id', <UserClub />)} />
            <Route
              {...withUser('/profile/clubs/:id/trainers', <UserClubTrainers />)}
            />
            <Route
              {...withUser('/profile/clubs/:id/trainers/:trainerId', <Wip />)}
            />
            <Route
              {...withUser(
                '/profile/clubs/:id/trainers/new',
                <ClubTrainerForm />,
              )}
            />
            <Route {...withUser('/profile/clubs/:id/sites', <UserSites />)} />
            <Route
              {...withUser('/profile/clubs/:id/sites/new', <SiteForm />)}
            />
            <Route
              {...withUser(
                '/profile/clubs/:clubId/sites/:siteId',
                <UserClubSite />,
              )}
            />
            <Route
              {...withUser(
                '/profile/clubs/:clubId/sites/:siteId/subscriptions',
                <Subscriptions />,
              )}
            />
            <Route
              {...withUser(
                '/profile/clubs/:clubId/sites/:siteId/subscriptions/options/:subscriptionOptionId',
                <Wip />,
              )}
            />
            <Route
              {...withUser(
                '/profile/clubs/:clubId/sites/:siteId/subscriptions/options/new',
                <SubscriptionOptionForm />,
              )}
            />
            <Route
              {...withUser(
                '/profile/clubs/:clubId/sites/:siteId/subscriptions/options/:subscriptionOptionId/:id',
                <SubscriptionPage />,
              )}
            />
            <Route
              {...withUser(
                '/profile/clubs/:clubId/sites/:siteId/events',
                <SiteEvents />,
              )}
            />
            <Route
              {...withUser(
                '/profile/clubs/:clubId/sites/:siteId/events/new',
                <NewSiteEvent />,
              )}
            />
            <Route
              {...withUser(
                '/profile/clubs/:clubId/sites/:siteId/events/:id',
                <SiteEvent />,
              )}
            />
            <Route
              {...withUser(
                '/profile/clubs/:clubId/sites/:siteId/messages',
                <SiteChat />,
              )}
            />
          </Routes>
        </Content>
      </Container>
    </AppContext.Provider>
  );
}

export default App;
