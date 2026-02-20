import React, { useEffect, useState } from "react";
import api from "../config/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BsGrid, BsListTask, BsBookmark, BsBoxArrowRight, BsBriefcase, BsCheckCircle, BsXCircle } from "react-icons/bs";
import "./Account.css";

const Account = () => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [applications, setApplications] = useState([]);
    const [savedJobs, setSavedJobs] = useState([]);
    const [loadingSaved, setLoadingSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    // Tab State
    const [activeTab, setActiveTab] = useState("overview");



    //  ==============Fetch saved Jobs======================
    const fetchSavedJobs = async () => {
        try {
            setLoadingSaved(true);
            const res = await api.get("/saved-jobs");
            setSavedJobs(res.data);
        } catch (err) {
            console.error("Failed to fetch saved jobs", err);
        } finally {
            setLoadingSaved(false);
        }
    };
    /* ================= AUTH + PROFILE ================= */
    useEffect(() => {
        const getToken = () => token || localStorage.getItem("authToken") || localStorage.getItem("userToken");
        const storedToken = getToken();

        if (!storedToken) {
            navigate("/login");
            return;
        }

        const fetchProfile = async () => {
            try {
                // Try unified endpoint first
                const res = await api.get("/auth/me");
                setUser(res.data);
            } catch (err) {
                // Fallback to legacy endpoint
                try {
                    const res = await api.get("/user/profile");
                    setUser(res.data);
                } catch {
                    logout();
                    navigate("/login");
                }
            }
        };

        fetchProfile();
    }, [token, navigate, logout]);

    /* ================= FETCH APPLICATIONS ================= */
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await api.get("/my-applications");
                setApplications(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [token]);

    /* ================= WITHDRAW APPLICATION ================= */
    const handleWithdraw = async (applicationId) => {
        const confirm = window.confirm(
            "Are you sure you want to withdraw this application?"
        );
        if (!confirm) return;

        try {
            await api.delete(`/my-applications/${applicationId}`);

            // Remove from UI immediately
            setApplications((prev) =>
                prev.filter((app) => app._id !== applicationId)
            );
        } catch (err) {
            alert("Failed to withdraw application");
        }
    };

    /* ================= LOGOUT ================= */
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    /*Helper for Initials*/
    const getInitials = (email) => {
        if (!email) return "U";
        return email.charAt(0).toUpperCase();
    };

    /*Helper Status Class*/
    const getStatusClass = (status) => {
        if (!status) return "";
        const s = status.toLowerCase();
        if (s.includes("accept") || s.includes("hired")) return "status-accepted";
        if (s.includes("reject")) return "status-rejected";
        return "status-pending";
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="account-page-wrapper">
            <div className="account-container">
                <div className="lux-dashboard-layout">

                    {/* LEFT SIDEBAR */}
                    <div className="lux-sidebar">
                        {user && (
                            <div className="user-mini-profile">
                                <div className="user-avatar-circle">
                                    {getInitials(user.email)}
                                </div>
                                <h3 className="user-name-display">{user.email.split('@')[0]}</h3>
                                <span className="user-role-display">{user.role}</span>
                            </div>
                        )}

                        <div className="lux-nav-menu">
                            <div
                                className={`lux-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                <BsGrid /> Overview
                            </div>
                            <div
                                className={`lux-nav-item ${activeTab === 'applications' ? 'active' : ''}`}
                                onClick={() => setActiveTab('applications')}
                            >
                                <BsListTask /> My Applications
                            </div>
                            <div
                                className={`lux-nav-item ${activeTab === 'saved' ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveTab("saved");
                                    fetchSavedJobs();
                                }}
                            >
                                <BsBookmark /> Saved Jobs
                            </div>
                            <div className="lux-nav-item text-danger mt-3" onClick={handleLogout}>
                                <BsBoxArrowRight /> Log Out
                            </div>
                        </div>
                    </div>

                    {/* MAIN CONTENT AREA */}
                    <div className="lux-content-area">
                        {/* HEADER */}
                        <div className="dashboard-header animate__animated animate__fadeInDown">
                            <h1 className="dashboard-title">Welcome back, {user?.email.split('@')[0]}!</h1>
                            <p className="dashboard-subtitle">Here is what's happening with your job search applications today.</p>
                        </div>

                        {/* STATS ROW (Always Visible or just on Overview) */}
                        <div className="stats-row animate__animated animate__fadeInUp">
                            <div className="stat-card">
                                <div className="stat-icon-wrapper bg-blue-light">
                                    <BsBriefcase />
                                </div>
                                <div className="stat-info">
                                    <h4>{applications.length}</h4>
                                    <p>Total Applied</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon-wrapper bg-green-light">
                                    <BsCheckCircle />
                                </div>
                                <div className="stat-info">
                                    <h4>{applications.filter(a => a.status === 'Accepted').length}</h4>
                                    <p>Poppinsviews</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon-wrapper bg-purple-light">
                                    <BsBookmark />
                                </div>
                                <div className="stat-info">
                                    <h4>{savedJobs.length}</h4>
                                    <p>Saved Jobs</p>
                                </div>
                            </div>
                        </div>

                        {/* CONTENT PANEL */}
                        <div className="content-panel animate__animated animate__fadeInUp" style={{ animationDelay: '0.1s' }}>
                            <div className="panel-header">
                                <h3 className="panel-title">
                                    {activeTab === "saved"
                                        ? "Saved Jobs"
                                        : activeTab === "overview"
                                            ? "Recent Applications"
                                            : "All Applications"}
                                </h3>
                            </div>
                            {activeTab === "saved" && (
                                loadingSaved ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" />
                                    </div>
                                ) : savedJobs.length === 0 ? (
                                    <div className="lux-empty-state">
                                        <BsBookmark size={48} className="opacity-25 mb-3" />
                                        <h5>No saved jobs</h5>
                                        <p className="text-muted small">
                                            Save jobs to view them later.
                                        </p>
                                        <button
                                            className="btn btn-dark btn-sm rounded-pill px-4 mt-2"
                                            onClick={() => navigate("/jobs")}
                                        >
                                            Browse Jobs
                                        </button>
                                    </div>
                                ) : (
                                    <div className="lux-table-wrapper">
                                        <table className="lux-table">
                                            <thead>
                                                <tr>
                                                    <th>Job Role</th>
                                                    <th>Location</th>
                                                    <th>Saved On</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {savedJobs.map(item => (
                                                    <tr key={item._id}>
                                                        <td>
                                                            <strong>{item.jobId?.title}</strong>
                                                            <div className="text-muted small">
                                                                {item.jobId?.company}
                                                            </div>
                                                        </td>
                                                        <td className="text-muted small">
                                                            {item.jobId?.location || "Remote"}
                                                        </td>
                                                        <td className="text-muted small">
                                                            {new Date(item.createdAt).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )
                            )}

                            {applications.length === 0 ? (
                                <div className="lux-empty-state">
                                    <div className="mb-3 text-muted opacity-25">
                                        <BsGrid size={48} />
                                    </div>
                                    <h5>No applications yet</h5>
                                    <p className="text-muted small">Start exploring the job board to find your next role.</p>
                                    <button
                                        className="btn btn-dark btn-sm rounded-pill px-4 mt-2"
                                        onClick={() => navigate('/jobs')}
                                    >
                                        Browse Jobs
                                    </button>
                                </div>
                            ) : (
                                <div className="lux-table-wrapper">
                                    <table className="lux-table">
                                        <thead>
                                            <tr>
                                                <th>Company & Role</th>
                                                <th>Location</th>
                                                <th>Date Applied</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {applications.map(app => (
                                                <tr key={app._id}>
                                                    <td>
                                                        <div className="job-cell">
                                                            <div className="company-logo-tiny">
                                                                {app.companyId?.name?.charAt(0) || "C"}
                                                            </div>
                                                            <div className="job-info">
                                                                <h5>{app.jobId?.title}</h5>
                                                                <span>{app.companyId?.name}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-muted small">{app.jobId?.location || "Remote"}</td>
                                                    <td className="text-muted small">
                                                        {new Date(app.appliedAt).toLocaleDateString()}
                                                    </td>
                                                    <td>
                                                        <span className={`status-pill ${getStatusClass(app.status)}`}>
                                                            {app.status || "Pending"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn-action-icon"
                                                            title="Withdraw Application"
                                                            onClick={() => handleWithdraw(app._id)}
                                                        >
                                                            <BsXCircle />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
