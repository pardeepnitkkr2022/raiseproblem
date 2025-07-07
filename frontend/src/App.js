// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, Box, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProblemList from './pages/ProblemList';
import TrendingProblems from './pages/TrendingProblems';
import CreateProblem from './pages/CreateProblem';
import ProblemDetails from './pages/ProblemDetails';
import Profile from './pages/Profile';
import OAuthSuccess from './components/OAuthSuccess';

import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/verifyEmail';


import './App.css'; 

const App = () => {
  return (
    <Router>
      <CssBaseline /> {}
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
<Route path="/forgot-password" element={<ForgotPassword />} />


            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route path="/problems" element={<ProblemList />} />
            <Route path="/trending" element={<TrendingProblems />} />
            <Route path="/create-problem" element={<CreateProblem />} />
            <Route path="/problems/:id" element={<ProblemDetails />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
};

export default App;
