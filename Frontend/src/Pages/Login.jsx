import { useState } from "react";

function Login({ onLogin, onClose }) {
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
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
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
          <button onClick={handleLogin}>Login</button>
          <button className="secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;