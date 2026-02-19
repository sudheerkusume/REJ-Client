import React, { useEffect, useState } from "react";
import api from "../config/api";
import { FiSearch, FiMapPin, FiBriefcase, FiCalendar, FiTrash2, FiEdit3 } from "react-icons/fi";
import "../DashboardStyles.css";

const RecruiterJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const loadJobs = async () => {
        try {
            const res = await api.get("/recruiter/jobs");
            setJobs(res.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error loading jobs:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadJobs();
    }, []);

    const deleteJob = async (id) => {
        if (!window.confirm("Are you sure you want to delete this job posting?")) return;
        try {
            await api.delete(`/recruiter/jobs/${id}`);
            setJobs(jobs.filter(j => j._id !== id));
            alert("Job deleted successfully!");
        } catch (err) {
            alert("Failed to delete job");
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "40vh" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid animate-fade-in">
            <div className="admin-view-header">
                <div className="admin-view-title">
                    <h3 className="fw-bold">My Job Postings</h3>
                    <p className="text-muted">Overview of all active and past job listings</p>
                </div>

                <div className="search-filter-premium">
                    <div className="position-relative" style={{ minWidth: '300px' }}>
                        <FiSearch className="position-absolute" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            className="search-input-premium"
                            placeholder="Search jobs by title or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="premium-table-container mt-4">
                {filteredJobs.length === 0 ? (
                    <div className="text-center py-5">
                        <img src="https://cdni.iconscout.com/illustration/premium/thumb/no-data-found-8867280-7265556.png" alt="No data" style={{ width: '200px', opacity: 0.6 }} />
                        <p className="text-muted mt-3">No jobs found matching your search</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="premium-table">
                            <thead>
                                <tr>
                                    <th>Job Title</th>
                                    <th>Location & Type</th>
                                    <th>Category</th>
                                    <th>Applicants</th>
                                    <th>Posted Date</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredJobs.map(job => (
                                    <tr key={job._id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-light p-2 rounded-3 text-primary shadow-sm">
                                                    <FiBriefcase size={20} />
                                                </div>
                                                <div className="fw-600 text-dark">{job.title}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-secondary small d-flex align-items-center gap-1">
                                                <FiMapPin size={12} /> {job.location || "Remote"}
                                            </div>
                                            <div className="badge bg-light text-muted fw-normal mt-1 border">{job.type}</div>
                                        </td>
                                        <td>
                                            <span className="text-secondary small">{job.category || "General"}</span>
                                        </td>
                                        <td>
                                            <div className="fw-bold text-primary">{job.applicationCount || 0} Applicants</div>
                                        </td>
                                        <td>
                                            <div className="text-secondary small d-flex align-items-center gap-1">
                                                <FiCalendar size={12} /> {new Date(job.createdAt || Date.now()).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <button className="btn btn-light-hover p-2 rounded-3 text-muted border shadow-sm" title="Edit">
                                                    <FiEdit3 size={18} />
                                                </button>
                                                <button
                                                    className="btn btn-light-hover p-2 rounded-3 text-danger border shadow-sm"
                                                    title="Delete"
                                                    onClick={() => deleteJob(job._id)}
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </div>
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

export default RecruiterJobs;

