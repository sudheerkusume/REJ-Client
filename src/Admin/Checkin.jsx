import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginStatus } from '../App';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

const Checkin = () => {
    const [details, setDetails] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();
    const [token, setToken] = useContext(loginStatus);
    const { login } = useAuth();

    const Changedata = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    const Submithandler = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", details);
            const { token: newToken, role, user } = res.data;

            if (role !== "admin") {
                alert("This portal is for admin access only");
                return;
            }

            // Set unified auth
            login(newToken, role, user);

            // Set legacy token for backward compat
            localStorage.setItem("adminToken", newToken);
            setToken(newToken);
        } catch (err) {
            console.error(err);
            alert("Invalid credentials");
        }
    };

    // Safe redirect
    useEffect(() => {
        if (token) {
            navigate("/dashboard");
        }
    }, [token, navigate]);

    return (
        <div className='admin-login-wrapper'>
            <div className='admin-glass-card'>
                <h1 className='admin-title'>Admin Portal</h1>
                <p className='admin-subtitle'>Secure access to your dashboard</p>

                <form onSubmit={Submithandler} className='admin-form'>

                    <div className='admin-input-group'>
                        <span className='admin-input-icon'>✉️</span>
                        <input
                            type="email"
                            name="email"
                            onChange={Changedata}
                            placeholder="Email Address"
                            className='admin-input'
                            required
                        />
                    </div>

                    <div className='admin-input-group'>
                        <span className='admin-input-icon'>🔒</span>
                        <input
                            type="password"
                            name="password"
                            onChange={Changedata}
                            placeholder="Password"
                            className='admin-input'
                            required
                        />
                    </div>

                    <button type="submit" className='admin-login-btn'>
                        Sign In
                    </button>
                </form>

                <div className='admin-security-badge'>
                    <span className='icon'>🔐</span>
                    <span>Secured with end-to-end encryption</span>
                </div>
            </div>
        </div>
    );
};

export default Checkin;
