import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email,setEmail]= useState("");
  const [message,setMessage]= useState("");
  const [isLoading,setIsLoading]= useState(false);
  const navigate = useNavigate();


  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
    try {
      const result = await authService.signup(username,email,password)
      if(result.success){
        setMessage('Account created successfully')
        setTimeout(() => {
          navigate('/login')
        }, 3000);
        }
      }
     catch (error) {
      setMessage(error.message || 'Signup failed. Please try again.')
      console.log('Signed up failed',error)
    }
    finally{
      setIsLoading(false)
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="signup-header">
          <h1>Sign Up</h1>
          <p>Please fill in this form to create an account!</p>
        </div>

        <form onSubmit={handleSignup} className="signup-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="username-input"
            maxLength={20}
            required
            disabled={isLoading}
    
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="username-input"
            maxLength={20}
            required
            disabled={isLoading}

    
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="username-input"
            maxLength={20}
            required
            disabled={isLoading}
          />

          <button type="submit"
            disabled={!username.trim() || !email.trim() || !password.trim() || isLoading}
            className="join-btn"
          >
            {isLoading ? "Loading..." : "Sign Up"}
          </button>

          {message && (
            <p className="auth-message"
              style={{color:message.includes('success') ? 'green' : 'red'}}
              >
              {message}
            </p>
          )}
          
        </form>
          
      </div>
    </div>
  );
}

export default Signup;
