import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService.js";
import '../styles/Signup.css';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        checkPasswordStrength(password);
    }, [password]);

    const checkPasswordStrength = (pwd) => {
        let strength = 0;
        if (pwd.length >= 8) strength++;
        if (/[A-Z]/.test(pwd)) strength++;
        if (/[a-z]/.test(pwd)) strength++;
        if (/[0-9]/.test(pwd)) strength++;
        if (/[^A-Za-z0-9]/.test(pwd)) strength++;
        setPasswordStrength(strength);
    };

    const validateForm = () => {
        const errors = {};
        
        if (username.length < 3) {
            errors.username = "Username must be at least 3 characters";
        }
        
        if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Please enter a valid email address";
        }
        
        if (password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }
        
        if (password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setMessage('');
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);

        try {
            const result = await authService.signup(username, email, password);
            if (result.success) {
                setMessage('Account created successfully! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            setMessage(error.message || 'Signup failed, please try again.');
            console.error('Signup failed', error);
        } finally {
            setIsLoading(false);
        }
    }

    const getPasswordStrengthText = () => {
        switch(passwordStrength) {
            case 0:
            case 1: return 'Weak';
            case 2:
            case 3: return 'Medium';
            case 4:
            case 5: return 'Strong';
            default: return '';
        }
    };

    const getPasswordStrengthColor = () => {
        switch(passwordStrength) {
            case 0:
            case 1: return '#ef4444';
            case 2:
            case 3: return '#f59e0b';
            case 4:
            case 5: return '#10b981';
            default: return '#6b7280';
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-background">
                <div className="background-grid"></div>
                <div className="background-shapes">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className={`shape shape-${i + 1}`}></div>
                    ))}
                </div>
            </div>
            
            <div className={`signup-box ${isVisible ? 'visible' : ''}`}>
                <div className="signup-header">
                    <div className="signup-icon">
                        <div className="icon-wrapper">
                            ✨
                        </div>
                    </div>
                    <h1>Join ChatSphere</h1>
                    <p>Create your account and start connecting</p>
                </div>

                <form onSubmit={handleSignup} className="signup-form">
                    <div className="input-group">
                        <div className="input-wrapper">
                            <input
                                type="text"
                                placeholder="Choose a username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={`form-input ${validationErrors.username ? 'error' : ''}`}
                                maxLength={20}
                                required
                                disabled={isLoading}
                            />
                            <div className="input-icon">👤</div>
                        </div>
                        {validationErrors.username && (
                            <div className="validation-error">{validationErrors.username}</div>
                        )}
                    </div>

                    <div className="input-group">
                        <div className="input-wrapper">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`form-input ${validationErrors.email ? 'error' : ''}`}
                                required
                                disabled={isLoading}
                            />
                            <div className="input-icon">📧</div>
                        </div>
                        {validationErrors.email && (
                            <div className="validation-error">{validationErrors.email}</div>
                        )}
                    </div>

                    <div className="input-group">
                        <div className="input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`form-input ${validationErrors.password ? 'error' : ''}`}
                                maxLength={50}
                                required
                                disabled={isLoading}
                            />
                            <div className="input-icon">🔒</div>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="password-toggle"
                                disabled={isLoading}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {password && (
                            <div className="password-strength">
                                <div className="strength-bar">
                                    <div 
                                        className="strength-fill"
                                        style={{
                                            width: `${(passwordStrength / 5) * 100}%`,
                                            backgroundColor: getPasswordStrengthColor()
                                        }}
                                    ></div>
                                </div>
                                <span 
                                    className="strength-text"
                                    style={{ color: getPasswordStrengthColor() }}
                                >
                                    {getPasswordStrengthText()}
                                </span>
                            </div>
                        )}
                        {validationErrors.password && (
                            <div className="validation-error">{validationErrors.password}</div>
                        )}
                    </div>

                    <div className="input-group">
                        <div className="input-wrapper">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`form-input ${validationErrors.confirmPassword ? 'error' : ''}`}
                                maxLength={50}
                                required
                                disabled={isLoading}
                            />
                            <div className="input-icon">🔐</div>
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="password-toggle"
                                disabled={isLoading}
                            >
                                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {validationErrors.confirmPassword && (
                            <div className="validation-error">{validationErrors.confirmPassword}</div>
                        )}
                    </div>

                    <button 
                        type="submit"
                        disabled={!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim() || isLoading}
                        className="signup-btn"
                    >
                        {isLoading ? (
                            <div className="loading-spinner">
                                <div className="spinner"></div>
                                <span>Creating Account...</span>
                            </div>
                        ) : (
                            <span>Create Account</span>
                        )}
                        <div className="btn-shine"></div>
                    </button>

                    {message && (
                        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                            <div className="message-icon">
                                {message.includes('successfully') ? '✅' : '❌'}
                            </div>
                            <span>{message}</span>
                        </div>
                    )}
                </form>

                <div className="signup-footer">
                    <p>Already have an account?</p>
                    <Link to="/login" className="login-link">
                        Sign In
                        <div className="link-underline"></div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;