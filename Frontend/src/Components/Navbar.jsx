import logo from "../assets/logo.jpg";

function Navbar({ user, onLoginClick, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src={logo} alt="DocBook" className="logo" />
        <h2>DocBook</h2>
      </div>

      <div>
        {user ? (
          <>
            <span className="nav-item">👤 {user.name}</span>
            <button className="nav-btn" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="nav-btn" onClick={onLoginClick}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;