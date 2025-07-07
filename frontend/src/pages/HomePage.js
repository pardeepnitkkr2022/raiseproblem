// HomePage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Stack, Paper } from '@mui/material';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Box className="homepage-wrapper">
      <Paper className="homepage-card" elevation={6}>
        <Typography variant="h3" component="h1" className="homepage-title">
          Welcome to <span className="logo-gradient">raiseproblem</span>
        </Typography>

        <Typography variant="subtitle1" className="homepage-subtitle">
          Raise, solve and vote on real-world problems. Join the community!
        </Typography>

        <Stack spacing={2}>
          <Button
            className="primary-button"
            variant="contained"
            size="large"
            onClick={() => navigate('/problems')}
          >
            Explore Problems
          </Button>

          {isLoggedIn ? (
            <>
              <Button
                className="secondary-button"
                variant="outlined"
                size="large"
                onClick={() => navigate('/profile')}
              >
                Go to Profile
              </Button>
              <Button
                className="secondary-button"
                variant="outlined"
                size="large"
                onClick={() => navigate('/create-problem')}
              >
                Create a Problem
              </Button>
              <Button
                className="secondary-button"
                variant="outlined"
                size="large"
                onClick={() => navigate('/trending')}
              >
                Trending Problems
              </Button>
            </>
          ) : (
            <>
              <Button
                className="secondary-button"
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                className="secondary-button"
                variant="outlined"
                size="large"
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default HomePage;
