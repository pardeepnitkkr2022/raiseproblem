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
import { register } from '../api';
import './register.css';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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
      const response = await register(formData);

      navigate('/verify-email', {
        state: { email: formData.email, message: response.data.message },
      });
    } catch (error) {
      console.error('Registration error:', error);
      setError(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!loading) {
      window.location.href = 'http://localhost:5000/api/auth/google';
    }
  };

  return (
    <Box className="register-wrapper">
      <Container maxWidth="sm">
        <Card className="register-card" elevation={0}>
          <CardContent>
            <Typography variant="h5" align="center" className="register-title">
              🚀 Create an Account
            </Typography>

            <form onSubmit={handleSubmit} className="register-form">
              <TextField
                label="Full Name"
                name="name"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                className="input-field"
                disabled={loading}
              />
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="register-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    Registering...
                  </>
                ) : (
                  'Register'
                )}
              </Button>
            </form>

            <Divider sx={{ my: 3 }}>OR</Divider>

            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              Continue with Google
            </Button>

            <Collapse in={!!error} sx={{ mt: 2 }}>
              <Alert
                severity="error"
                className="register-alert"
                action={
                  <IconButton color="inherit" size="small" onClick={() => setError(null)}>
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

export default Register;
