import React, { useState } from 'react';
import { verifyEmail } from '../api';
import { TextField, Button, Typography, Container, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      const { data } = await verifyEmail({ email, code });
      localStorage.setItem('authToken', data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>Email Verification</Typography>
      <TextField fullWidth label="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <TextField fullWidth label="Verification Code" value={code} onChange={e => setCode(e.target.value)} sx={{ mt: 2 }} />
      <Button variant="contained" fullWidth onClick={handleVerify} sx={{ mt: 2 }}>Verify</Button>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Container>
  );
};

export default VerifyEmail;