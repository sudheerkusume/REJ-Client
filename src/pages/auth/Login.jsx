import React, { useState } from "react";
import api from "../../config/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import image from "../../Accets/Login_Image.png";

const Login = () => {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await api.post(
                "/auth/login",
                form
            );

            const { token, role, user } = res.data;

            // Set unified auth context
            login(token, role, user);

            // Navigate based on role
            switch (role) {
                case "user":
                    navigate("/account");
                    break;
                case "recruiter":
                    navigate("/recruiter/dashboard");
                    break;
                case "company":
                    navigate("/company/dashboard");
                    break;
                default:
                    navigate("/account");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
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
                    <h2 className="mb-4 fw-bold text-dark">Login</h2>

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

                        <button className="auth-btn" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Don't have an account?
                        <span onClick={() => navigate("/signup")}> Sign Up</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
