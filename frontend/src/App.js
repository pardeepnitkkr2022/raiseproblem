import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProblemList from './pages/ProblemList';
import CreateProblem from './pages/CreateProblem';
import ProblemDetails from './pages/ProblemDetails';
import Profile from './pages/Profile'
import Navbar from './components/Navbar';
import './App.css';

const App = () => {
    return (
        <Router>
           
            <div className="app">
                <Navbar />
                <div className="main-content">
                    <Routes>
                        <Route path="/" element={<ProblemList />} />
                        <Route path="/profile" element={<Profile />} />

                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/problems" element={<ProblemList />} />
                        <Route path="/create-problem" element={<CreateProblem />} />
                        <Route path="/problems/:id" element={<ProblemDetails />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
