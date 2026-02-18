// import React, { useState, useContext, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { recruiterAuth } from "../context/RecruiterAuthContext";

// const RecruiterCheckin = () => {
//     const [details, setDetails] = useState({
//         email: "",
//         password: ""
//     });

//     const [recruiterToken, setRecruiterToken] = useContext(recruiterAuth);
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         setDetails({ ...details, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const res = await axios.post(
//                 "http://localhost:5000/recruiter/login",
//                 details
//             );

//             setRecruiterToken(res.data.token);
//             localStorage.setItem("recruiterToken", res.data.token);

//         } catch (err) {
//             console.error(err);
//             alert("Invalid recruiter credentials");
//         }
//     };

//     useEffect(() => {
//         if (recruiterToken) {
//             navigate("/recruiter/dashboard");
//         }
//     }, [recruiterToken, navigate]);

//     return (
//         <div className="admin-login-wrapper">
//             <div className="admin-glass-card">
//                 <h1 className="admin-title">Recruiter Portal</h1>
//                 <p className="admin-subtitle">
//                     Manage your job postings & candidates
//                 </p>

//                 <form onSubmit={handleSubmit} className="admin-form">
//                     <div className="admin-input-group">
//                         <span className="admin-input-icon">✉️</span>
//                         <input
//                             type="email"
//                             name="email"
//                             placeholder="Email Address"
//                             onChange={handleChange}
//                             className="admin-input"
//                             required
//                         />
//                     </div>

//                     <div className="admin-input-group">
//                         <span className="admin-input-icon">🔒</span>
//                         <input
//                             type="password"
//                             name="password"
//                             placeholder="Password"
//                             onChange={handleChange}
//                             className="admin-input"
//                             required
//                         />
//                     </div>

//                     <button type="submit" className="admin-login-btn">
//                         Sign In
//                     </button>
//                 </form>

//                 <div className="admin-security-badge">
//                     <span className="icon">🔐</span>
//                     <span>Recruiter access secured</span>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default RecruiterCheckin;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RecruiterCheckin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                "https://rej-server.onrender.com/recruiter/login",
                { email, password }
            );

            localStorage.setItem("recruiterToken", res.data.token);
            navigate("/recruiter/dashboard");
        } catch {
            alert("Invalid recruiter credentials");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow" style={{ width: 380 }}>
                <h4 className="text-center mb-3">Recruiter Login</h4>

                <form onSubmit={handleLogin}>
                    <input
                        className="form-control mb-3"
                        placeholder="Email"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="form-control mb-3"
                        placeholder="Password"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </div>
    );
};

export default RecruiterCheckin;
