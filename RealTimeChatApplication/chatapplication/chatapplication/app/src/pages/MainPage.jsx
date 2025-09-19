import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import '../styles/MainPage.css';

const MainPage = () => {
    const isAuthenticated = authService.isAuthenticated();
    const [isLoaded, setIsLoaded] = useState(false);
    const [particlesVisible, setParticlesVisible] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
        setTimeout(() => setParticlesVisible(true), 500);
    }, []);

    return (
        <div className="mainpage-container">
            <div className="background-gradient"></div>
            <div className="floating-particles">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div 
                        key={i} 
                        className={`particle ${particlesVisible ? 'visible' : ''}`}
                        style={{
                            '--delay': `${i * 0.2}s`,
                            '--x': `${Math.random() * 100}%`,
                            '--y': `${Math.random() * 100}%`
                        }}
                    ></div>
                ))}
            </div>
            
            <div className={`mainpage-content ${isLoaded ? 'loaded' : ''}`}>
                <div className="mainpage-header">
                    <div className="mainpage-icon-container">
                        <div className="mainpage-icon">💬</div>
                        <div className="icon-glow"></div>
                    </div>
                    <h1 className="main-title">
                        Welcome to <span className="gradient-text">ChatSphere</span>
                    </h1>
                    <p className="main-subtitle">
                        Experience the future of real-time communication
                    </p>
                </div>

                <div className="mainpage-features">
                    <div className="feature-card">
                        <div className="feature-icon-wrapper">
                            <div className="feature-icon">⚡</div>
                        </div>
                        <h3>Lightning Fast</h3>
                        <p>Real-time messaging with zero latency</p>
                        <div className="feature-glow"></div>
                    </div>
                    
                    <div className="feature-card">
                        <div className="feature-icon-wrapper">
                            <div className="feature-icon">🌐</div>
                        </div>
                        <h3>Global Connection</h3>
                        <p>Connect with users from around the world</p>
                        <div className="feature-glow"></div>
                    </div>
                    
                    <div className="feature-card">
                        <div className="feature-icon-wrapper">
                            <div className="feature-icon">🔒</div>
                        </div>
                        <h3>Private & Secure</h3>
                        <p>End-to-end encrypted private conversations</p>
                        <div className="feature-glow"></div>
                    </div>
                </div>

                <div className="mainpage-actions">
                    {isAuthenticated ? (
                        <Link to="/chatarea" className="cta-button primary">
                            <span>Enter Chat Area</span>
                            <div className="button-shine"></div>
                        </Link>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="cta-button primary">
                                <span>Get Started</span>
                                <div className="button-shine"></div>
                            </Link>
                            <Link to="/signup" className="cta-button secondary">
                                <span>Create Account</span>
                                <div className="button-shine"></div>
                            </Link>
                        </div>
                    )}
                </div>

                <div className="stats-section">
                    <div className="stat-item">
                        <div className="stat-number">1M+</div>
                        <div className="stat-label">Messages Sent</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">50K+</div>
                        <div className="stat-label">Active Users</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">99.9%</div>
                        <div className="stat-label">Uptime</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;