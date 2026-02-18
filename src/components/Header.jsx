import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";
import { loginStatus } from "../App";
import Logo from "../Accets/image.png";

const Header = () => {
  const [token, setToken] = useContext(loginStatus);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = token || localStorage.getItem("userToken");
    if (!storedToken) return;

    // Fetch user profile if token exists
    fetch("https://rej-server.onrender.com/user/profile", {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => {
        setToken("");
        localStorage.removeItem("userToken");
      });
  }, [token, setToken]);

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("userToken");
    setUser(null);
    navigate("/login");
  };

  const closeNavbar = () => {
    const nav = document.getElementById("mainNavbar");
    if (nav?.classList.contains("show")) {
      nav.classList.remove("show");
    }
  };

  return (
    <header className="glass-header sticky-top">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container main">
          {/* Logo */}
          <NavLink className="navbar-brand d-flex flex-column align-items-start" to="/" onClick={closeNavbar}>
            <img src={Logo} alt="RealBeez Logo" width="150" className="logo-img" />
            <span className="logo-tagline text-muted">Your trusted real estate partner</span>
          </NavLink>

          {/* Mobile Toggle */}
          <button
            className="navbar-toggler custom-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menu */}
          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-3 align-items-center">
              <li className="nav-item">
                <NavLink className="nav-link custom-nav-link" to="/" onClick={closeNavbar}>HOME</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link custom-nav-link" to="/about" onClick={closeNavbar}>ABOUT US</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link custom-nav-link" to="/companies" onClick={closeNavbar}>COMPANIES</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link custom-nav-link" to="/contact" onClick={closeNavbar}>CONTACT</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link custom-nav-link" to="/jobs" onClick={closeNavbar}>JOBS</NavLink>
              </li>
            </ul>

            {/* Action Buttons */}
            <div className="d-flex align-items-center gap-3 ms-lg-4 mt-3 mt-lg-0">
              {user ? (
                <div className="dropdown">
                  <button
                    className="btn btn-user-profile dropdown-toggle d-flex align-items-center gap-2"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div className="user-avatar-placeholder">{user?.name?.charAt(0).toUpperCase()}</div>
                    <span className="d-none d-sm-inline">{user?.name}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end custom-dropdown" aria-labelledby="userDropdown">
                    <li>
                      <NavLink className="dropdown-item" to="/account" onClick={closeNavbar}>Account</NavLink>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button>
                    </li>
                  </ul>
                </div>
              ) : (
                <NavLink to="/login" onClick={closeNavbar}>
                  <button className="btn btn-premium-auth">
                    <FiLogIn className="me-2" /> Login
                  </button>
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
