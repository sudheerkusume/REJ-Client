import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import api from "../config/api";
import Logo from "../Accets/image.png";

const Header = () => {
  const { token, role, logout } = useAuth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = token || localStorage.getItem("authToken") || localStorage.getItem("userToken");
    if (!storedToken) {
      setUser(null);
      return;
    }

    api.get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        // Fallback to legacy endpoint
        api.get("/user/profile")
          .then((res) => setUser(res.data))
          .catch(() => setUser(null));
      });
  }, [token]);

  const handleLogout = () => {
    logout();
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
                      <NavLink className="dropdown-item" to={role === "company" ? "/company/dashboard" : "/account"} onClick={closeNavbar}>
                        {role === "company" ? "Company Dashboard" : "Account"}
                      </NavLink>
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
