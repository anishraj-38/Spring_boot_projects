import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import ChatApp from './components/ChatApp';

type AuthState = 'login' | 'signup' | 'authenticated';

function App() {
  const [authState, setAuthState] = useState<AuthState>('login');
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const handleLogin = (email: string, password: string) => {
    // In a real app, you would validate credentials with your backend
    console.log('Login attempt:', { email, password });
    
    // Simulate successful login
    setUser({ name: 'John Doe', email });
    setAuthState('authenticated');
  };

  const handleSignup = (name: string, email: string, password: string) => {
    // In a real app, you would create the account with your backend
    console.log('Signup attempt:', { name, email, password });
    
    // Simulate successful signup
    setUser({ name, email });
    setAuthState('authenticated');
  };

  const handleLogout = () => {
    setUser(null);
    setAuthState('login');
  };

  if (authState === 'authenticated' && user) {
    return <ChatApp />;
  }

  if (authState === 'signup') {
    return (
      <SignupForm
        onSignup={handleSignup}
        onSwitchToLogin={() => setAuthState('login')}
      />
    );
  }

  return (
    <LoginForm
      onLogin={handleLogin}
      onSwitchToSignup={() => setAuthState('signup')}
    />
  );
}

export default App;