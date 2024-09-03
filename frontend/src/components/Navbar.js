import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
       
        const token = localStorage.getItem('authToken');
        setIsLoggedIn(!!token); 
    }, []);

    const toggleMenu = () => setIsMenuOpen(prev => !prev);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setIsLoggedIn(false); 
        window.location.href = '/login'; 
    };

    return (
        <nav>
            <div className="brand">raiseproblem</div>
            <div className="menu-toggle" onClick={toggleMenu}>
                ☰
            </div>
            <ul className={isMenuOpen ? 'active' : ''}>
                <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                <li><Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link></li>

                {!isLoggedIn && (
                    <>
                        <li><Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link></li>
                        <li><Link to="/register" onClick={() => setIsMenuOpen(false)}>Register</Link></li>
                    </>
                )}

                <li><Link to="/problems" onClick={() => setIsMenuOpen(false)}>Problems</Link></li>
                <li><Link to="/create-problem" onClick={() => setIsMenuOpen(false)}>Create Problem</Link></li>
                
                {isLoggedIn && (
                    <li><button className="logout-button" onClick={handleLogout}>Logout</button></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
