import React, { useContext, useEffect, useState } from "react";
import api from "../config/api";
import { loginStatus } from "../App";
import { FiSearch, FiFilter, FiUser, FiMail, FiMapPin, FiCalendar, FiClock } from "react-icons/fi";
import "../DashboardStyles.css";

const ViewApplication = () => {
    const [token] = useContext(loginStatus);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    /* ================= FETCH APPLICATIONS ================= */
    useEffect(() => {
        if (!token) return;

        api.get("/admin/applications")
            .then(res => {
                setApplications(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [token]);

    /* ================= UPDATE STATUS ================= */
    const updateStatus = async (id, status) => {
        try {
            await api.put(
                `/admin/application-status/${id}`,
                { status }
            );
            setApplications(prev => prev.map(app => app._id === id ? { ...app, status } : app));
            alert(`Status updated to ${status} and email sent!`);
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch =
            (app.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (app.jobId?.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (app.companyId?.name?.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === "All" || app.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "Applied": return "badge-applied-premium";
            case "Shortlisted": return "badge-shortlisted-premium";
            case "Selected": return "badge-selected-premium";
            case "Rejected": return "badge-rejected-premium";
            default: return "";
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid animate-fade-in">
            {/* Header Section */}
            <div className="admin-view-header">
                <div className="admin-view-title">
                    <h3>Candidates</h3>
                    <p>Manage and track all incoming job applications</p>
                </div>

                <div className="search-filter-premium">
                    <div className="position-relative">
                        <FiSearch className="position-absolute" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            className="search-input-premium"
                            placeholder="Search candidates, jobs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="position-relative">
                        <FiFilter className="position-absolute" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <select
                            className="status-select-premium ps-5"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ height: '42px' }}
                        >
                            <option value="All">All Status</option>
                            <option value="Applied">Applied</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Selected">Selected</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="premium-table-container">
                {filteredApplications.length === 0 ? (
                    <div className="text-center py-5">
                        <img src="https://cdni.iconscout.com/illustration/premium/thumb/no-data-found-8867280-7265556.png" alt="No data" style={{ width: '200px', opacity: 0.6 }} />
                        <p className="text-muted mt-3">No applications found matching your criteria</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="premium-table">
                            <thead>
                                <tr>
                                    <th>Candidate</th>
                                    <th>Job Details</th>
                                    <th>Location</th>
                                    <th>Applied On</th>
                                    <th>Current Status</th>
                                    <th className="text-end">Update Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApplications.map(app => (
                                    <tr key={app._id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="candidate-avatar">
                                                    {app.userId?.name?.charAt(0) || "U"}
                                                </div>
                                                <div>
                                                    <div className="fw-bold text-dark">{app.userId?.name || "N/A"}</div>
                                                    <div className="text-muted small d-flex align-items-center gap-1">
                                                        <FiMail size={12} /> {app.userId?.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {app.jobId?.creatorRole === "admin" ? (
                                                <span className="badge bg-primary">Admin Job</span>
                                            ) : (
                                                <span className="badge bg-success">
                                                    {app.jobId?.recruiterId?.name}
                                                </span>
                                            )}
                                        </td>

                                        <td>
                                            <div className="fw-600 text-dark">{app.jobId?.title}</div>
                                            <div className="text-muted small">{app.companyId?.name}</div>
                                        </td>
                                        <td>
                                            <div className="text-secondary d-flex align-items-center gap-1 small">
                                                <FiMapPin size={14} /> {app.jobId?.location || "Remote"}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-secondary d-flex align-items-center gap-1 small">
                                                <FiCalendar size={14} /> {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge-premium ${getStatusBadgeClass(app.status)}`}>
                                                <FiClock size={12} /> {app.status}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            <select
                                                className="status-select-premium"
                                                value={app.status}
                                                onChange={(e) =>
                                                    updateStatus(app._id, e.target.value)
                                                }
                                            >
                                                <option value="Applied">Applied</option>
                                                <option value="Shortlisted">Shortlisted</option>
                                                <option value="Selected">Selected</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewApplication;

