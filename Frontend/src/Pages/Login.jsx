import { useState } from "react";

function Login({ onLogin, onClose, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const fakeUser = {
      id: 1,
      name: "Test User",
      role: "PATIENT",
      email,
    };
    onLogin(fakeUser);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to book your appointments</p>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="modal-actions">
          <button onClick={handleLogin}>Sign In</button>
          <button className="secondary" onClick={onClose}>
            Cancel
          </button>
        </div>

        <p className="switch-text">
          Don't have an account? 
          <span onClick={onSwitchToSignup} style={{ cursor: 'pointer', color: 'var(--medical-green)', fontWeight: '600', marginLeft: '6px' }}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
