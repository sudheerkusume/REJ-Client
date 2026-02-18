import React, { useState } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import image from "../../Accets/Login_Image.png"
const Signup = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "applicant" // default role
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (role) => {
        setForm({ ...form, role });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const res = await axios.post(
                "https://rej-server.onrender.com/users/signup",
                form
            );

            setSuccess(res.data.message);
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="auth-split-wrapper">
            {/* Left Side - Visual */}
            <div className="auth-left" style={{ backgroundImage: `url(${image})` }}>
                <div className="auth-left-content">
                    <h1>Register for <br /><span>Real Estate Jobs</span></h1>
                    <p className="lead mt-3">Join us! To apply for your Poppinsested Real Estate Jobs and build your career.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="auth-right">
                <div className="auth-form-container">

                    {/* Role Toggle */}
                    <div className="role-toggle-wrapper">
                        <div
                            className={`role-toggle-option ${form.role === 'applicant' ? 'active' : ''}`}
                            onClick={() => handleRoleChange('applicant')}
                        >
                            Applicant
                            <span className="d-block small text-muted">Job Seeker</span>
                            {form.role === 'applicant' && <FaCheckCircle className="role-check-icon" />}
                        </div>
                        <div
                            className={`role-toggle-option ${form.role === 'company' ? 'active' : ''}`}
                            onClick={() => handleRoleChange('company')}
                        >
                            Company
                            <span className="d-block small text-muted">Real Estate Company</span>
                            {form.role === 'company' && <FaCheckCircle className="role-check-icon" />}
                        </div>
                    </div>

                    <div className="text-center mb-4">
                        <small className="text-muted">Selected: {form.role === 'applicant' ? 'Applicant' : 'Company'}</small>
                    </div>

                    {error && <div className="alert alert-danger rounded-3">{error}</div>}
                    {success && <div className="alert alert-success rounded-3">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 auth-input-group">
                            <label>Your Full Name*</label>
                            <input
                                type="text"
                                name="name"
                                className="auth-input"
                                placeholder="Enter Your Name"
                                required
                                value={form.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4 auth-input-group">
                            <label>Your Email*</label>
                            <input
                                type="email"
                                name="email"
                                className="auth-input"
                                placeholder="Enter Your Email"
                                required
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-5 auth-input-group">
                            <label>Password*</label>
                            <input
                                type="password"
                                name="password"
                                className="auth-input"
                                placeholder="Enter Password (min. 6 characters)"
                                required
                                value={form.password}
                                onChange={handleChange}
                            />
                        </div>

                        <button className="auth-btn">
                            Register
                        </button>
                    </form>

                    <p className="auth-footer">
                        Already have an account?
                        <span onClick={() => navigate("/login")}>Login Now</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
