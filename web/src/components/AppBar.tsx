import * as React from 'react';
import { AppBar, Box, Toolbar, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import appContext from '../context';

export type ButtonAppBarProps = {
  title: string;
  onLogOut: () => void;
};

export default function ButtonAppBar(props: ButtonAppBarProps) {
  const { title, onLogOut } = props;
  const { user } = React.useContext(appContext);

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              {title}
            </Link>
          </Typography>
          <Box
            sx={{
              flexGrow: 5,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box></Box>
            <Box>
              {user ? (
                <Box>
                  <Link
                    to="/messages"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <Button color="inherit">messages</Button>
                  </Link>
                  <Link
                    to="/profile/clubs"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <Button color="inherit">clubs</Button>
                  </Link>
                  <Button color="inherit" onClick={onLogOut}>
                    Sign Out
                  </Button>
                </Box>
              ) : (
                <Link
                  to="/signin"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Button color="inherit">Sign In</Button>
                </Link>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
