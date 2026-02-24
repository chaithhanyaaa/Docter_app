import { useState } from "react";

function Signup({ onSignup, onClose, onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const newUser = {
      id: Date.now(),
      name: name,
      role: "PATIENT",
      email,
    };
    onSignup(newUser);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal signup-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <h2>Create Account</h2>
        <p className="subtitle">Join DocBook to book appointments</p>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <div className="modal-actions">
          <button onClick={handleSignup}>Create Account</button>
          <button className="secondary" onClick={onClose}>
            Cancel
          </button>
        </div>

        <p className="switch-text">
          Already have an account? 
          <span onClick={onSwitchToLogin} style={{ cursor: 'pointer', color: 'var(--medical-green)', fontWeight: '600', marginLeft: '6px' }}>
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
