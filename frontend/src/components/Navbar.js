import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  Box,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import './Navbar.css';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const navLinks = [
    { text: 'Home', to: '/' },
    { text: 'Problems', to: '/problems' },
    { text: 'Trending', to: '/trending' },
    { text: 'Create', to: '/create-problem' },
    ...(isLoggedIn ? [{ text: 'Profile', to: '/profile' }] : []),
    ...(isLoggedIn
      ? []
      : [
          { text: 'Login', to: '/login' },
          { text: 'Register', to: '/register' }
        ])
  ];

  return (
    <>
      <AppBar position="sticky" className="navbar-appbar" elevation={0}>
        <Toolbar className="navbar-toolbar">
          <Typography variant="h6" component={Link} to="/" className="navbar-brand">
            raise<span className="brand-highlight">problem</span>
          </Typography>

          {!isMobile && (
            <Box className="navbar-links">
              {navLinks.map((link) => (
                <Link key={link.text} to={link.to} className="navbar-link">
                  {link.text}
                </Link>
              ))}
              {isLoggedIn && (
                <Button onClick={handleLogout} className="logout-btn" endIcon={<LogoutIcon />}>
                  Logout
                </Button>
              )}
            </Box>
          )}

          <IconButton
            className="navbar-menu-btn"
            onClick={toggleDrawer(true)}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box className="navbar-drawer" onClick={toggleDrawer(false)}>
          <List>
            {navLinks.map((link) => (
              <ListItem button key={link.text} component={Link} to={link.to}>
                <ListItemText primary={link.text} />
              </ListItem>
            ))}
            {isLoggedIn && (
              <ListItem button onClick={handleLogout}>
                <LogoutIcon style={{ marginRight: '10px' }} />
                <ListItemText primary="Logout" />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
