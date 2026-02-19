// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const AddRecruiter = () => {
//     const navigate = useNavigate();

//     const [loading, setLoading] = useState(false);

//     const [form, setForm] = useState({
//         name: "",
//         email: "",
//         phone: "",
//         department: "",
//         password: "",
//         confirmPassword: "",
//         permissions: {
//             postJobs: true,
//             viewApplications: true,
//             manageJobs: false,
//             manageRecruiters: false,
//         },
//     });

//     // 🔐 Admin authentication check

//     // Handle input change
//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     // Handle permission toggle
//     const handlePermission = (key) => {
//         setForm({
//             ...form,
//             permissions: {
//                 ...form.permissions,
//                 [key]: !form.permissions[key],
//             },
//         });
//     };

//     // Submit form
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (form.password !== form.confirmPassword) {
//             alert("Passwords do not match");
//             return;
//         }

//         try {
//             setLoading(true);

//             // ✅ USE ADMIN TOKEN
//             const token = localStorage.getItem("adminToken");

//             if (!token) {
//                 alert("Admin not logged in");
//                 navigate("/admin/login");
//                 return;
//             }

//             await axios.post(
//                 "http://localhost:5000/admin/create-recruiter",
//                 form,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );

//             navigate("/admin/dashboard");

//             setForm({
//                 name: "",
//                 email: "",
//                 phone: "",
//                 department: "",
//                 password: "",
//                 confirmPassword: "",
//                 permissions: {
//                     postJobs: true,
//                     viewApplications: true,
//                     manageJobs: false,
//                     manageRecruiters: false,
//                 },
//             });

//         } catch (err) {
//             alert(err.response?.data?.message || "Error creating recruiter");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="container mt-4">
//             <div className="card p-4 shadow-sm">
//                 <h4 className="mb-4">Add New Recruiter</h4>

//                 <form onSubmit={handleSubmit}>
//                     <input
//                         className="form-control mb-3"
//                         placeholder="Full Name"
//                         name="name"
//                         value={form.name}
//                         onChange={handleChange}
//                         required
//                     />

//                     <input
//                         className="form-control mb-3"
//                         placeholder="Email"
//                         type="email"
//                         name="email"
//                         value={form.email}
//                         onChange={handleChange}
//                         required
//                     />

//                     <input
//                         className="form-control mb-3"
//                         placeholder="Phone"
//                         name="phone"
//                         value={form.phone}
//                         onChange={handleChange}
//                         required
//                     />

//                     <select
//                         className="form-control mb-3"
//                         name="department"
//                         value={form.department}
//                         onChange={handleChange}
//                         required
//                     >
//                         <option value="">Select Department</option>
//                         <option>HR</option>
//                         <option>Sales</option>
//                         <option>Marketing</option>
//                         <option>Technical</option>
//                     </select>

//                     <label className="fw-bold mb-2">Permissions</label>

//                     {Object.keys(form.permissions).map((key) => (
//                         <div className="form-check" key={key}>
//                             <input
//                                 className="form-check-input"
//                                 type="checkbox"
//                                 checked={form.permissions[key]}
//                                 onChange={() => handlePermission(key)}
//                             />
//                             <label className="form-check-label">
//                                 {key.replace(/([A-Z])/g, " $1")}
//                             </label>
//                         </div>
//                     ))}

//                     <input
//                         type="password"
//                         className="form-control mt-3"
//                         placeholder="Password"
//                         name="password"
//                         value={form.password}
//                         onChange={handleChange}
//                         required
//                     />

//                     <input
//                         type="password"
//                         className="form-control mt-3"
//                         placeholder="Confirm Password"
//                         name="confirmPassword"
//                         value={form.confirmPassword}
//                         onChange={handleChange}
//                         required
//                     />

//                     <button
//                         className="btn btn-primary mt-4 w-100"
//                         disabled={loading}
//                     >
//                         {loading ? "Creating..." : "Create Recruiter"}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddRecruiter;

import React, { useEffect, useState, useContext } from "react";
import api from "../config/api";
import { useNavigate } from "react-router-dom";
import { loginStatus } from "../App";

const AddRecruiter = () => {
    const navigate = useNavigate();

    // ✅ USE CONTEXT TOKEN (SAME AS ADMIN LOGIN)
    const [token] = useContext(loginStatus);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        department: "",
        password: "",
        confirmPassword: "",
        permissions: {
            postJobs: true,
            viewApplications: true,
            manageJobs: false,
            manageRecruiters: false,
        },
    });

    // 🔐 ADMIN AUTH CHECK
    useEffect(() => {
        if (!token) {
            alert("Admin not logged in");
            navigate("/admin/login");
        }
    }, [token, navigate]);

    // Handle input change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle permission toggle
    const handlePermission = (key) => {
        setForm({
            ...form,
            permissions: {
                ...form.permissions,
                [key]: !form.permissions[key],
            },
        });
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            await api.post("/admin/create-recruiter", form);

            alert("Recruiter created successfully");
            navigate("/dashboard");

            setForm({
                name: "",
                email: "",
                phone: "",
                department: "",
                password: "",
                confirmPassword: "",
                permissions: {
                    postJobs: true,
                    viewApplications: true,
                    manageJobs: false,
                    manageRecruiters: false,
                },
            });

        } catch (err) {
            alert(err.response?.data?.message || "Error creating recruiter");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card p-4 shadow-sm">
                <h4 className="mb-4">Add New Recruiter</h4>

                <form onSubmit={handleSubmit}>
                    <input
                        className="form-control mb-3"
                        placeholder="Full Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="form-control mb-3"
                        placeholder="Email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="form-control mb-3"
                        placeholder="Phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />

                    <select
                        className="form-control mb-3"
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Department</option>
                        <option>HR</option>
                        <option>Sales</option>
                        <option>Marketing</option>
                        <option>Technical</option>
                    </select>

                    <label className="fw-bold mb-2">Permissions</label>

                    {Object.keys(form.permissions).map((key) => (
                        <div className="form-check" key={key}>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={form.permissions[key]}
                                onChange={() => handlePermission(key)}
                            />
                            <label className="form-check-label">
                                {key.replace(/([A-Z])/g, " $1")}
                            </label>
                        </div>
                    ))}

                    <input
                        type="password"
                        className="form-control mt-3"
                        placeholder="Password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        className="form-control mt-3"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                    <button
                        className="btn btn-primary mt-4 w-100"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Recruiter"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddRecruiter;
