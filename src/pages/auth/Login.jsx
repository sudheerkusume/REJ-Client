import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { loginStatus } from "../../App";
import image from "../../Accets/Login_Image.png";

const Login = () => {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [loginType, setLoginType] = useState("user"); // 🔑 NEW
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [token, setToken] = useContext(loginStatus);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // 🔥 SWITCH API BASED ON ROLE
            const url =
                loginType === "user"
                    ? "https://rej-server.onrender.com/users/login"
                    : "https://rej-server.onrender.com/recruiter/login";

            const res = await axios.post(url, form);

            // 🔐 STORE TOKEN BASED ON ROLE
            if (loginType === "user") {
                localStorage.setItem("userToken", res.data.token);
                setToken(res.data.token);
                navigate("/account");
            } else {
                localStorage.setItem("recruiterToken", res.data.token);
                navigate("/recruiter/dashboard");
            }

        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="auth-split-wrapper">
            {/* Left Side */}
            <div className="auth-left" style={{ backgroundImage: `url(${image})` }}>
                <div className="auth-left-content">
                    <h1>Welcome <br /><span>Back!</span></h1>
                    <p className="lead mt-3">
                        Login to continue
                    </p>
                </div>
            </div>

            {/* Right Side */}
            <div className="auth-right">
                <div className="auth-form-container">
                    <h2 className="mb-4 fw-bold text-dark">
                        {loginType === "user" ? "User Login" : "Recruiter Login"}
                    </h2>

                    {/* 🔁 ROLE SWITCH */}
                    <div className="mb-4 d-flex gap-3">
                        <button
                            type="button"
                            className={`btn ${loginType === "user" ? "btn-dark" : "btn-outline-dark"}`}
                            onClick={() => setLoginType("user")}
                        >
                            User
                        </button>

                        <button
                            type="button"
                            className={`btn ${loginType === "recruiter" ? "btn-dark" : "btn-outline-dark"}`}
                            onClick={() => setLoginType("recruiter")}
                        >
                            Recruiter
                        </button>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                className="auth-input"
                                required
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-4">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                className="auth-input"
                                required
                                value={form.password}
                                onChange={handleChange}
                            />
                        </div>

                        <button className="auth-btn">Login</button>
                    </form>

                    {loginType === "user" && (
                        <p className="auth-footer">
                            Don’t have an account?
                            <span onClick={() => navigate("/signup")}> Sign Up</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
