
import React, { useState } from 'react';
import { forgotPassword, resetPassword } from '../api';
import {
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  
} from '@mui/material';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  const handleSendCode = async () => {
    try {
      await forgotPassword({ email });
      setStep(2);
      setMsg('Reset code sent to your email');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset code');
    }
  };

  const handleReset = async () => {
    try {
      const { data } = await resetPassword({ email, code, newPassword });
      setMsg(data.message);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>Reset Password</Typography>

      {step === 1 && (
        <>
          <TextField
            fullWidth
            label="Registered Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSendCode}
          >
            Send Reset Code
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <Alert severity="info" sx={{ mt: 2 }}>
            A reset code has been sent to <strong>{email}</strong>
          </Alert>

          <TextField
            fullWidth
            label="Reset Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleReset}
          >
            Reset Password
          </Button>
        </>
      )}

      {msg && <Alert severity="success" sx={{ mt: 2 }}>{msg}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Container>
  );
};

export default ForgotPassword;
