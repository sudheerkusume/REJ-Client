// import React, { useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { recruiterAuth } from "../context/RecruiterAuthContext";

// const RecruiterDashboard = () => {
//     const [recruiterToken, setRecruiterToken] = useContext(recruiterAuth);
//     const navigate = useNavigate();

//     const [applications, setApplications] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         if (!recruiterToken) {
//             navigate("/recruiter");
//             return;
//         }

//         axios
//             .get("http://localhost:5000/recruiter/applications", {
//                 headers: {
//                     Authorization: `Bearer ${recruiterToken}`
//                 }
//             })
//             .then((res) => {
//                 setApplications(res.data || []);
//                 setLoading(false);
//             })
//             .catch((err) => {
//                 console.error(err);
//                 setRecruiterToken("");
//                 localStorage.removeItem("recruiterToken");
//                 navigate("/recruiter");
//             });
//     }, [recruiterToken, navigate, setRecruiterToken]);

//     const handleLogout = () => {
//         setRecruiterToken("");
//         localStorage.removeItem("recruiterToken");
//         navigate("/recruiter");
//     };

//     if (loading) {
//         return (
//             <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
//                 <div className="spinner-border text-primary" />
//             </div>
//         );
//     }

//     return (
//         <div className="container-fluid p-4">
//             <div className="d-flex justify-content-between align-items-center mb-4">
//                 <h2 className="fw-bold">Recruiter Dashboard</h2>
//                 <button className="btn btn-danger btn-sm" onClick={handleLogout}>
//                     Logout
//                 </button>
//             </div>

//             <div className="card shadow-sm rounded-4">
//                 <div className="card-header bg-white fw-bold">
//                     Job Applications
//                 </div>

//                 <div className="table-responsive">
//                     <table className="table table-hover align-middle mb-0">
//                         <thead className="bg-light">
//                             <tr>
//                                 <th>Candidate</th>
//                                 <th>Email</th>
//                                 <th>Job</th>
//                                 <th>Status</th>
//                                 <th>Applied Date</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {applications.length === 0 && (
//                                 <tr>
//                                     <td colSpan="5" className="text-center text-muted py-4">
//                                         No applications found
//                                     </td>
//                                 </tr>
//                             )}

//                             {applications.map((app) => (
//                                 <tr key={app._id}>
//                                     <td>{app.userId?.name}</td>
//                                     <td>{app.userId?.email}</td>
//                                     <td>{app.jobId?.title}</td>
//                                     <td>
//                                         <span className="badge bg-primary-subtle text-primary">
//                                             {app.status}
//                                         </span>
//                                     </td>
//                                     <td>
//                                         {new Date(app.appliedAt).toLocaleDateString()}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>

//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default RecruiterDashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    FiGrid,
    FiUsers,
    FiBriefcase,
    FiPlusCircle,
    FiLogOut,
    FiSearch,
    FiBell,
    FiMail,
    FiTrendingUp,
    FiCheckCircle,
    FiXCircle,
    FiClock
} from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import logo from '../Accets/image.png';
import "../DashboardStyles.css";

// Import Views
import RecruiterApplication from "./RecruiterApplication";
import RecruiterJobs from "./RecruiterJobs";
import AddJob from "./AddJob";
import RecruiterCandidateProfile from "../pages/RecruiterCandidateProfile";

const RecruiterDashboard = () => {
    const navigate = useNavigate();
    const [view, setView] = useState("dashboard"); // dashboard, applications, jobs, addjob, candidate-profile
    const [selectedCandidateId, setSelectedCandidateId] = useState(null);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [recruiterName, setRecruiterName] = useState("Recruiter");

    const onViewProfile = (id) => {
        setSelectedCandidateId(id);
        setView("candidate-profile");
    };

    useEffect(() => {
        const token = localStorage.getItem("recruiterToken");
        if (!token) return navigate("/recruiter");

        // Fetch Stats
        axios
            .get("https://rej-server.onrender.com/recruiter/dashboard-stats", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                setStats(res.data);
                setLoading(false);
            })
            .catch(() => navigate("/recruiter"));

        // Fetch Profile for Name
        axios
            .get("https://rej-server.onrender.com/recruiter/profile", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => setRecruiterName(res.data.name))
            .catch(() => { });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("recruiterToken");
        navigate("/recruiter");
    };

    const statCards = [
        { label: "Total Applications", value: stats.total || 0, icon: <FiUsers />, color: "#4f46e5", bg: "#eef2ff" },
        { label: "Shortlisted", value: stats.shortlisted || 0, icon: <FiTrendingUp />, color: "#ca8a04", bg: "#fefce8" },
        { label: "Selected", value: stats.selected || 0, icon: <FiCheckCircle />, color: "#16a34a", bg: "#f0fdf4" },
        { label: "Rejected", value: stats.rejected || 0, icon: <FiXCircle />, color: "#dc2626", bg: "#fef2f2" },
    ];

    const renderView = () => {
        switch (view) {
            case "dashboard":
                return (
                    <div className="animate-fade-in">
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <div>
                                <h2 className="fw-bold text-dark mb-1">Recruiter Dashboard</h2>
                                <p className="text-muted mb-0">Welcome back! Here's what's happening with your recruitment today.</p>
                            </div>
                            <button
                                className="btn btn-primary rounded-pill px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
                                onClick={() => setView("addjob")}
                            >
                                <FiPlusCircle /> Post New Job
                            </button>
                        </div>

                        {/* Stats Grid */}
                        <div className="row g-4 mb-5">
                            {statCards.map((card, idx) => (
                                <div className="col-12 col-sm-6 col-xl-3" key={idx}>
                                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100 transition-hover">
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <div className="p-3 rounded-3" style={{ backgroundColor: card.bg, color: card.color, fontSize: '24px' }}>
                                                {card.icon}
                                            </div>
                                            <div className="text-success small fw-bold bg-success-subtle px-2 py-1 rounded-pill">
                                                <FiTrendingUp /> +12%
                                            </div>
                                        </div>
                                        <h1 className="fw-bold text-dark mb-1">{card.value}</h1>
                                        <div className="text-muted small fw-medium">{card.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="row g-4">
                            <div className="col-lg-8">
                                <div className="card border-0 shadow-sm rounded-4 p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                        <h5 className="fw-bold mb-0">System Overview</h5>
                                        <button className="btn btn-link text-decoration-none text-primary fw-bold small p-0">View All</button>
                                    </div>

                                    <div className="text-center py-5">
                                        <div className="mb-4">
                                            <FiClock size={48} className="text-primary-subtle" />
                                        </div>
                                        <h6 className="fw-bold">No Recent Activity</h6>
                                        <p className="text-muted small">New applications will appear here once candidates apply.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="card border-0 shadow-sm rounded-4 p-4 bg-primary text-white overflow-hidden position-relative mb-4">
                                    <div className="position-relative z-index-1">
                                        <h5 className="fw-bold mb-3">Ready to Hire?</h5>
                                        <p className="small opacity-75 mb-4">Post a new job opportunity and find the best talent for your team.</p>
                                        <button
                                            className="btn btn-light rounded-pill px-4 py-2 fw-bold text-primary w-100 mb-2 shadow-sm"
                                            onClick={() => setView("addjob")}
                                        >
                                            Get Started
                                        </button>
                                    </div>
                                    <div className="position-absolute bottom-0 end-0 opacity-10" style={{ transform: 'translate(20%, 20%)' }}>
                                        <FiBriefcase size={200} />
                                    </div>
                                </div>
                                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                                    <h6 className="fw-bold mb-3">Quick Actions</h6>
                                    <div className="d-flex flex-column gap-2">
                                        <button onClick={() => setView("jobs")} className="btn btn-outline-light text-dark text-start border d-flex align-items-center gap-3 p-3 rounded-3 transition-hover">
                                            <div className="p-2 rounded-circle bg-light text-primary"><FiBriefcase /></div>
                                            <div>
                                                <div className="fw-bold small">Manage Jobs</div>
                                                <div className="text-muted" style={{ fontSize: '11px' }}>View active postings</div>
                                            </div>
                                        </button>
                                        <button onClick={() => setView("applications")} className="btn btn-outline-light text-dark text-start border d-flex align-items-center gap-3 p-3 rounded-3 transition-hover">
                                            <div className="p-2 rounded-circle bg-light text-success"><FiUsers /></div>
                                            <div>
                                                <div className="fw-bold small">Direct Applicants</div>
                                                <div className="text-muted" style={{ fontSize: '11px' }}>Track candidate progress</div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case "applications":
                return <RecruiterApplication onViewProfile={onViewProfile} />;
            case "jobs":
                return <RecruiterJobs />;
            case "addjob":
                return <AddJob />;
            case "candidate-profile":
                return <RecruiterCandidateProfile id={selectedCandidateId} setView={setView} />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh", background: "#f8fafc" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid dashboard-layout p-0">
            <div className="row g-0 h-100">

                {/* Sidebar */}
                <aside className="col-lg-2 col-md-3 d-none d-md-flex flex-column dash-sidebar bg-white border-end">
                    <div className="p-4 border-bottom">
                        <img src={logo} alt="Logo" className="img-fluid" style={{ maxHeight: '40px' }} />
                    </div>

                    <nav className="flex-grow-1 p-3 mt-2">
                        <div className="nav-group mb-4">
                            <label className="text-uppercase text-muted small fw-bold mb-3 d-block px-3" style={{ letterSpacing: '1px' }}>Menu</label>
                            <button
                                onClick={() => setView("dashboard")}
                                className={`dash-nav-item mb-2 w-100 text-start border-0 bg-transparent py-2 px-3 rounded-3 d-flex align-items-center gap-3 ${view === "dashboard" ? "active" : ""}`}
                            >
                                <FiGrid /> Dashboard
                            </button>
                            <button
                                onClick={() => setView("applications")}
                                className={`dash-nav-item mb-2 w-100 text-start border-0 bg-transparent py-2 px-3 rounded-3 d-flex align-items-center gap-3 ${view === "applications" ? "active" : ""}`}
                            >
                                <FiUsers /> Applications
                            </button>
                            <button
                                onClick={() => setView("jobs")}
                                className={`dash-nav-item mb-2 w-100 text-start border-0 bg-transparent py-2 px-3 rounded-3 d-flex align-items-center gap-3 ${view === "jobs" ? "active" : ""}`}
                            >
                                <FiBriefcase /> My Jobs
                            </button>
                            <button
                                onClick={() => setView("addjob")}
                                className={`dash-nav-item mb-2 w-100 text-start border-0 bg-transparent py-2 px-3 rounded-3 d-flex align-items-center gap-3 ${view === "addjob" ? "active" : ""}`}
                            >
                                <FiPlusCircle /> Post a Job
                            </button>

                        </div>
                    </nav>

                    <div className="p-3 border-top">
                        <button onClick={handleLogout} className="dash-nav-item text-danger border-0 bg-transparent py-2 px-3 rounded-3 d-flex align-items-center gap-3 w-100 text-start">
                            <FiLogOut /> Logout
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="col-lg-10 col-md-9 col-12 dash-main bg-light min-vh-100">

                    {/* Header */}
                    <header className="dash-header sticky-top bg-white border-bottom p-3 d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-3 flex-grow-1 mx-3">
                            <div className="position-relative flex-grow-1" style={{ maxWidth: '400px' }}>
                                <FiSearch className="position-absolute text-muted" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="text"
                                    placeholder="Search everything..."
                                    className="form-control border-0 bg-light rounded-pill ps-5 py-2"
                                    style={{ fontSize: '14px' }}
                                />
                            </div>
                        </div>

                        <div className="d-flex align-items-center gap-3 pe-3">
                            <button className="btn btn-light rounded-circle p-2 position-relative">
                                <FiBell className="text-muted" />
                                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style={{ marginTop: '5px', marginLeft: '-5px' }}></span>
                            </button>
                            <button className="btn btn-light rounded-circle p-2">
                                <FiMail className="text-muted" />
                            </button>

                            <div className="vr mx-2"></div>

                            <div className="d-flex align-items-center gap-2 cursor-poPoppins">
                                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '38px', height: '38px' }}>
                                    {recruiterName.charAt(0)}
                                </div>
                                <div className="d-none d-lg-block">
                                    <div className="fw-bold small">{recruiterName}</div>
                                    <div className="text-muted" style={{ fontSize: '10px' }}>Recruiter Panel</div>
                                </div>
                                <IoIosArrowDown className="text-muted small" />
                            </div>
                        </div>
                    </header>

                    {/* Content Body */}
                    <div className="p-4">
                        {renderView()}
                    </div>
                </main>
            </div>

            <style>{`
                .dashboard-layout {
                    min-height: 100vh;
                    background-color: #f8fafc;
                }
                .dash-sidebar {
                    height: 100vh;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }
                .dash-nav-item {
                    color: #64748b;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }
                .dash-nav-item:hover, .dash-nav-item.active {
                    color: #4f46e5;
                    background-color: #f1f5f9 !important;
                }
                .transition-hover {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .transition-hover:hover {
                    transform: translateY(-5px);
                }
                .cursor-poPoppins {
                    cursor: poPoppins;
                }
                .bg-success-subtle {
                    background-color: #dcfce7 !important;
                }
                .z-index-1 {
                    z-index: 1;
                }
                .animate-fade-in {
                    animation: fadeIn 0.4s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default RecruiterDashboard;
