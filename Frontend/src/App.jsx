import { useState } from "react";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import "./App.css";

function App() {
  // 🔐 GLOBAL AUTH STATE
  const [user, setUser] = useState(null);

  // 🪟 LOGIN MODAL STATE
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {/* 🏠 MAIN APP */}
      <Home
        user={user}
        onLoginClick={() => setShowLogin(true)}
        onLogout={() => setUser(null)}
      />

      {/* 🔐 LOGIN POPUP */}
      {showLogin && (
        <Login
          onLogin={(loggedInUser) => {
            setUser(loggedInUser);
            setShowLogin(false);
          }}
          onClose={() => setShowLogin(false)}
        />
      )}
    </>
  );
}

export default App;