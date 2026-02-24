import { useState } from "react";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import "./App.css";

function App() {
  // 🔐 GLOBAL AUTH STATE
  const [user, setUser] = useState(null);
  
  // 📅 APPOINTMENTS STATE
  const [appointments, setAppointments] = useState([]);

  // 🪟 LOGIN MODAL STATE
  const [showLogin, setShowLogin] = useState(false);
  
  // 📝 SIGNUP MODAL STATE
  const [showSignup, setShowSignup] = useState(false);

  // 📅 ADD APPOINTMENT
  const addAppointment = (doctor, date, time) => {
    const newAppointment = {
      id: Date.now(),
      doctor: doctor,
      date: date,
      time: time,
      status: "Confirmed"
    };
    setAppointments([...appointments, newAppointment]);
  };

  // 📅 CANCEL APPOINTMENT
  const cancelAppointment = (appointmentId) => {
    setAppointments(appointments.filter(apt => apt.id !== appointmentId));
  };

  return (
    <>
      {/* 🏠 MAIN APP */}
      <Home
        user={user}
        appointments={appointments}
        onLoginClick={() => setShowLogin(true)}
        onSignupClick={() => setShowSignup(true)}
        onLogout={() => setUser(null)}
        onAddAppointment={addAppointment}
        onCancelAppointment={cancelAppointment}
      />

      {/* 🔐 LOGIN POPUP */}
      {showLogin && (
        <Login
          onLogin={(loggedInUser) => {
            setUser(loggedInUser);
            setShowLogin(false);
          }}
          onClose={() => setShowLogin(false)}
          onSwitchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      )}

      {/* 📝 SIGNUP POPUP */}
      {showSignup && (
        <Signup
          onSignup={(newUser) => {
            setUser(newUser);
            setShowSignup(false);
          }}
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
}

export default App;
