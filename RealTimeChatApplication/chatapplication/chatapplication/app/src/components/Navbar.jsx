import {Link, useNavigate} from "react-router-dom";
import {authService} from "../services/authService.js";
import { useState, useEffect } from 'react';
import '../styles/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const isAuthenticated = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
            localStorage.clear();
            navigate('/login');
        }
    };

    return (
        <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <div className="brand-icon">💬</div>
                    <span className="brand-text">ChatFlow</span>
                </Link>

                <div className="navbar-menu">
                    {isAuthenticated ? (
                        <>
                            <Link to="/chatarea" className="navbar-link">
                                <span className="link-icon">🚀</span>
                                Chat Area
                            </Link>
                            <div className="navbar-user">
                                <div 
                                    className="user-profile"
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                >
                                    <div className="user-avatar" style={{ backgroundColor: currentUser.color || '#6B73FF' }}>
                                        {currentUser.username.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="username">Welcome, {currentUser.username}</span>
                                    <div className="dropdown-arrow">▼</div>
                                </div>
                                {showUserMenu && (
                                    <div className="user-dropdown">
                                        <div className="dropdown-item">
                                            <span className="dropdown-icon">👤</span>
                                            Profile
                                        </div>
                                        <div className="dropdown-item">
                                            <span className="dropdown-icon">⚙️</span>
                                            Settings
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        <div className="dropdown-item logout-item" onClick={handleLogout}>
                                            <span className="dropdown-icon">🚪</span>
                                            Logout
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="auth-buttons">
                            <Link to='/login' className="navbar-link login-link">
                                <span className="link-icon">🔐</span>
                                Login
                            </Link>
                            <Link to='/signup' className="navbar-link signup-link">
                                <span className="link-icon">✨</span>
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;