import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
  IconButton,
  Collapse,
  Box,
  Divider,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import './login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await login(formData);
      localStorage.setItem('authToken', response.data.token);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!loading) {
      window.location.href = 'http://localhost:5000/api/auth/google'; // Update if deployed
    }
  };

  return (
    <Box className="login-wrapper">
      <Container maxWidth="sm">
        <Card className="login-card" elevation={0}>
          <CardContent>
            <Typography variant="h5" align="center" className="login-title">
              🔐 Welcome Back
            </Typography>

            <form onSubmit={handleSubmit} className="login-form">
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                className="input-field"
                disabled={loading}
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                required
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                className="input-field"
                disabled={loading}
              />

              <Typography
                variant="body2"
                sx={{
                  textAlign: 'right',
                  mt: 1,
                  mb: 2,
                  color: 'primary.main',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}
                onClick={() => navigate('/forgot-password')}
              >
                Forgot Password?
              </Typography>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="login-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>

            <Divider sx={{ my: 3 }}>OR</Divider>

            <Button
              variant="outlined"
              fullWidth
              className="google-login-btn"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              Continue with Google
            </Button>

            <Collapse in={!!error} sx={{ mt: 2 }}>
              <Alert
                severity="error"
                className="login-alert"
                action={
                  <IconButton
                    color="inherit"
                    size="small"
                    onClick={() => setError(null)}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                {error}
              </Alert>
            </Collapse>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
