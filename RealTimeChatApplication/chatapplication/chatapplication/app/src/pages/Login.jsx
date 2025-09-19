import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService.js";
import '../styles/Login.css';

const Login = () => {
    // Core state
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [uiState, setUiState] = useState({
        message: '',
        messageType: '',
        isLoading: false,
        showPassword: false,
        isVisible: false,
        focusedField: null,
        passwordStrength: 0
    });

    // Refs for enhanced UX
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const formRef = useRef(null);
    const mountedRef = useRef(true);
    const navigate = useNavigate();

    // Password strength calculation
    const calculatePasswordStrength = useCallback((password) => {
        if (!password) return 0;
        let strength = 0;
        if (password.length >= 6) strength += 25;
        if (password.length >= 10) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        return Math.min(strength, 100);
    }, []);

    // Optimized form validation
    const isFormValid = useMemo(() => {
        return formData.username.trim().length >= 3 && 
               formData.password.trim().length >= 6;
    }, [formData.username, formData.password]);

    // Enhanced entrance animation
    useEffect(() => {
        const timer = setTimeout(() => {
            if (mountedRef.current) {
                setUiState(prev => ({ ...prev, isVisible: true }));
            }
        }, 150);

        // Focus username field on mount
        const focusTimer = setTimeout(() => {
            if (usernameRef.current && mountedRef.current) {
                usernameRef.current.focus();
            }
        }, 800);

        return () => {
            clearTimeout(timer);
            clearTimeout(focusTimer);
            mountedRef.current = false;
        };
    }, []);

    // Optimized input handler
    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Update password strength
        if (field === 'password') {
            const strength = calculatePasswordStrength(value);
            setUiState(prev => ({
                ...prev,
                passwordStrength: strength
            }));
        }

        // Clear messages when user starts typing
        if (uiState.message) {
            setUiState(prev => ({
                ...prev,
                message: '',
                messageType: ''
            }));
        }
    }, [calculatePasswordStrength, uiState.message]);

    // Enhanced login handler with better error handling
    const handleLogin = useCallback(async (e) => {
        e.preventDefault();
        
        if (!isFormValid || uiState.isLoading) return;

        setUiState(prev => ({
            ...prev,
            message: '',
            messageType: '',
            isLoading: true
        }));

        try {
            const result = await authService.login(
                formData.username.trim(), 
                formData.password
            );
            
            if (result.success && mountedRef.current) {
                setUiState(prev => ({
                    ...prev,
                    message: '🎉 Welcome back! Redirecting to your dashboard...',
                    messageType: 'success'
                }));

                // Enhanced navigation with fade out
                setTimeout(() => {
                    if (mountedRef.current) {
                        setUiState(prev => ({ ...prev, isVisible: false }));
                    }
                }, 1000);

                setTimeout(() => {
                    if (mountedRef.current) {
                        navigate('/chatarea', { replace: true });
                    }
                }, 1500);
            }
        } catch (error) {
            if (mountedRef.current) {
                const errorMessage = error.message === 'Network Error' 
                    ? 'Connection failed. Please check your internet and try again.'
                    : error.message || 'Authentication failed. Please verify your credentials.';

                setUiState(prev => ({
                    ...prev,
                    message: errorMessage,
                    messageType: 'error'
                }));

                // Shake animation for error
                if (formRef.current) {
                    formRef.current.classList.add('shake');
                    setTimeout(() => {
                        if (formRef.current) {
                            formRef.current.classList.remove('shake');
                        }
                    }, 500);
                }

                // Focus appropriate field based on error
                setTimeout(() => {
                    if (error.message?.includes('username') && usernameRef.current) {
                        usernameRef.current.focus();
                        usernameRef.current.select();
                    } else if (passwordRef.current) {
                        passwordRef.current.focus();
                        passwordRef.current.select();
                    }
                }, 100);
            }
        } finally {
            if (mountedRef.current) {
                setUiState(prev => ({
                    ...prev,
                    isLoading: false
                }));
            }
        }
    }, [formData, isFormValid, uiState.isLoading, navigate]);

    // Enhanced keyboard handling
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && isFormValid && !uiState.isLoading) {
            handleLogin(e);
        }
        
        // Tab navigation enhancement
        if (e.key === 'Tab') {
            const activeElement = document.activeElement;
            if (activeElement === usernameRef.current) {
                setUiState(prev => ({ ...prev, focusedField: 'password' }));
            } else if (activeElement === passwordRef.current) {
                setUiState(prev => ({ ...prev, focusedField: null }));
            }
        }
    }, [isFormValid, uiState.isLoading, handleLogin]);

    // Password visibility toggle
    const togglePasswordVisibility = useCallback(() => {
        setUiState(prev => ({
            ...prev,
            showPassword: !prev.showPassword
        }));
        
        // Maintain focus
        setTimeout(() => {
            if (passwordRef.current) {
                passwordRef.current.focus();
            }
        }, 0);
    }, []);

    // Dynamic background shapes
    const backgroundShapes = useMemo(() => 
        Array.from({ length: 8 }, (_, i) => (
            <div 
                key={i} 
                className={`shape shape-${i + 1}`}
                style={{
                    animationDelay: `${-i * 0.8}s`,
                    animationDuration: `${6 + i * 0.5}s`
                }}
            />
        )), []
    );

    // Enhanced form field component
    const FormField = ({ 
        type, 
        placeholder, 
        value, 
        onChange, 
        icon, 
        fieldRef, 
        showToggle = false,
        maxLength,
        autoComplete 
    }) => (
        <div className="input-group">
            <div className={`input-wrapper ${uiState.focusedField === type ? 'focused' : ''}`}>
                <input
                    ref={fieldRef}
                    type={type === 'password' && uiState.showPassword ? "text" : type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(type, e.target.value)}
                    onFocus={() => setUiState(prev => ({ ...prev, focusedField: type }))}
                    onBlur={() => setUiState(prev => ({ ...prev, focusedField: null }))}
                    onKeyDown={handleKeyDown}
                    className="form-input"
                    maxLength={maxLength}
                    autoComplete={autoComplete}
                    required
                    disabled={uiState.isLoading}
                    spellCheck={false}
                />
                <div className="input-icon">{icon}</div>
                {showToggle && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="password-toggle"
                        disabled={uiState.isLoading}
                        tabIndex={-1}
                        aria-label={uiState.showPassword ? "Hide password" : "Show password"}
                    >
                        {uiState.showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                )}
            </div>
            {type === 'password' && value && (
                <div className="password-strength">
                    <div 
                        className="strength-bar" 
                        style={{ 
                            width: `${uiState.passwordStrength}%`,
                            background: uiState.passwordStrength < 50 
                                ? '#ef4444' 
                                : uiState.passwordStrength < 75 
                                ? '#f59e0b' 
                                : '#10b981'
                        }}
                    />
                </div>
            )}
        </div>
    );

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="background-shapes">
                    {backgroundShapes}
                </div>
            </div>
            
            <div className={`login-box ${uiState.isVisible ? 'visible' : ''}`}>
                <div className="login-header">
                    <div className="login-icon">
                        <div className="icon-wrapper">
                            🔐
                        </div>
                    </div>
                    <h1>Welcome Back</h1>
                    <p>Sign in to continue your conversation</p>
                </div>

                <form 
                    ref={formRef}
                    onSubmit={handleLogin} 
                    className="login-form"
                    noValidate
                >
                    <FormField
                        type="username"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleInputChange}
                        icon="👤"
                        fieldRef={usernameRef}
                        maxLength={20}
                        autoComplete="username"
                    />

                    <FormField
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        icon="🔒"
                        fieldRef={passwordRef}
                        showToggle={true}
                        maxLength={50}
                        autoComplete="current-password"
                    />

                    <button 
                        type="submit"
                        disabled={!isFormValid || uiState.isLoading}
                        className="login-btn"
                        aria-label="Sign in to your account"
                    >
                        {uiState.isLoading ? (
                            <div className="loading-spinner">
                                <div className="spinner" />
                                <span>Signing In...</span>
                            </div>
                        ) : (
                            <span>Sign In</span>
                        )}
                        <div className="btn-shine" />
                    </button>

                    {uiState.message && (
                        <div 
                            className={`message ${uiState.messageType}`}
                            role="alert"
                            aria-live="polite"
                        >
                            <div className="message-icon">
                                {uiState.messageType === 'success' ? '✅' : '❌'}
                            </div>
                            <span>{uiState.message}</span>
                        </div>
                    )}
                </form>

                <div className="login-footer">
                    <p>Don't have an account?</p>
                    <Link 
                        to="/signup" 
                        className="signup-link"
                        tabIndex={uiState.isLoading ? -1 : 0}
                    >
                        Create Account
                        <div className="link-underline" />
                    </Link>
                </div>
            </div>

            {/* Add shake animation CSS */}
            <style jsx>{`
                .shake {
                    animation: shake 0.5s ease-in-out;
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                
                .input-wrapper.focused {
                    transform: scale(1.02);
                }
                
                .input-wrapper.focused .input-icon {
                    color: #667eea;
                    transform: scale(1.1);
                }
            `}</style>
        </div>
    );
};

export default Login;