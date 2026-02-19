import React, { useEffect, useState } from "react";
import api from "../config/api";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMail, FiMapPin, FiPhone, FiDownload, FiCheckCircle, FiUser } from "react-icons/fi";
import "../DashboardStyles.css";

const RecruiterCandidateProfile = ({ id: propId, setView }) => {
    const { id: paramId } = useParams();
    const id = propId || paramId;
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken") || localStorage.getItem("recruiterToken");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return navigate("/login");

        api.get(`/recruiter/candidate/${id}`)
            .then(res => {
                setUser(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id, token, navigate]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center bg-white rounded-4" style={{ height: "40vh" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mt-5 text-center">
                <h3>Candidate not found</h3>
                <button className="btn btn-primary mt-3" onClick={() => setView ? setView("applications") : navigate(-1)}>Go Back</button>
            </div>
        );
    }

    return (
        <div className="candidate-profile-page animate-fade-in p-1">
            <div className="container-fluid" style={{ maxWidth: '100%' }}>

                {/* Back Button */}
                <button
                    onClick={() => setView ? setView("applications") : navigate(-1)}
                    className="btn btn-white shadow-sm rounded-pill px-4 py-2 border mb-4 d-flex align-items-center gap-2 mb-4 transition-hover bg-white"
                >
                    <FiArrowLeft /> Back to Applications
                </button>

                {/* Profile Header Card */}
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                    <div className="bg-primary p-5 text-white position-relative">
                        <div className="position-absolute bottom-0 start-0 w-100 h-100 opacity-10" style={{ background: 'linear-gradient(45deg, #000, transparent)' }}></div>
                        <div className="d-flex flex-column flex-md-row align-items-center gap-4 position-relative z-index-1">
                            <div className="candidate-large-avatar shadow-lg bg-white text-primary fw-bold d-flex align-items-center justify-content-center" style={{ width: '120px', height: '120px', borderRadius: '30px', fontSize: '48px' }}>
                                {user.name?.charAt(0) || <FiUser />}
                            </div>
                            <div className="text-center text-md-start">
                                <h1 className="fw-bold mb-1">{user.name}</h1>
                                <p className="mb-0 opacity-75 fw-medium d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                                    <FiMapPin /> {user.location || "Location Not Specified"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card-body p-4 p-md-5 bg-white">
                        <div className="row g-4">
                            <div className="col-md-4">
                                <div className="p-3 rounded-4 bg-light border">
                                    <div className="text-muted small fw-bold text-uppercase mb-2">Email Address</div>
                                    <div className="fw-medium text-dark d-flex align-items-center gap-2">
                                        <div className="p-2 rounded-circle bg-white shadow-sm text-primary d-flex"><FiMail size={14} /></div>
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-3 rounded-4 bg-light border">
                                    <div className="text-muted small fw-bold text-uppercase mb-2">Phone Number</div>
                                    <div className="fw-medium text-dark d-flex align-items-center gap-2">
                                        <div className="p-2 rounded-circle bg-white shadow-sm text-success d-flex"><FiPhone size={14} /></div>
                                        {user.phone || "Not Provided"}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-3 rounded-4 bg-light border">
                                    <div className="text-muted small fw-bold text-uppercase mb-2">Availability</div>
                                    <div className="fw-medium text-dark d-flex align-items-center gap-2">
                                        <div className="p-2 rounded-circle bg-white shadow-sm text-warning d-flex"><FiCheckCircle size={14} /></div>
                                        Immediate Joiner
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="row g-4">
                    <div className="col-lg-8">
                        {/* Professional Summary */}
                        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4 bg-white">
                            <h4 className="fw-bold mb-4 d-flex align-items-center gap-2 pb-2 border-bottom">
                                <span className="p-2 rounded-3 bg-primary-subtle text-primary d-flex"><FiUser size={20} /></span>
                                Professional Summary
                            </h4>
                            <p className="text-muted lh-lg" style={{ fontSize: '16px' }}>
                                {user.summary || "No professional summary provided by the candidate."}
                            </p>
                        </div>

                        {/* Skills */}
                        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
                            <h4 className="fw-bold mb-4 d-flex align-items-center gap-2 pb-2 border-bottom">
                                <span className="p-2 rounded-3 bg-success-subtle text-success d-flex"><FiCheckCircle size={20} /></span>
                                Core Competencies
                            </h4>
                            <div className="d-flex flex-wrap gap-2">
                                {user.skills && user.skills.length > 0 ? (
                                    user.skills.map((skill, idx) => (
                                        <span key={idx} className="badge-premium bg-light border text-dark px-3 py-2 rounded-pill fw-medium">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-muted">No specific skills listed.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        {/* Resume Card */}
                        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: '2rem' }}>
                            <div className="text-center py-4">
                                <div className="mb-4 d-inline-block p-4 rounded-circle bg-light text-primary">
                                    <FiDownload size={40} />
                                </div>
                                <h5 className="fw-bold mb-2">Curriculum Vitae</h5>
                                <p className="text-muted small mb-4 px-3">Review the full professional background and achievements of this candidate.</p>

                                {user.resumeUrl ? (
                                    <a
                                        href={user.resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary rounded-pill w-100 py-3 d-flex align-items-center justify-content-center gap-2 shadow-sm fw-bold"
                                    >
                                        <FiDownload /> Download Resume
                                    </a>
                                ) : (
                                    <button disabled className="btn btn-secondary rounded-pill w-100 py-3">
                                        Resume Not Available
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .candidate-profile-page {
                    font-family: 'Poppins', sans-serif;
                }
                .bg-primary-subtle { background-color: #eef2ff !important; }
                .bg-success-subtle { background-color: #f0fdf4 !important; }
                .text-primary { color: #4f46e5 !important; }
                .bg-primary { background-color: #4f46e5 !important; }
                .transition-hover {
                    transition: all 0.2s ease;
                }
                .transition-hover:hover {
                    transform: translateX(-5px);
                    background-color: #f8fafc !important;
                }
                .candidate-large-avatar {
                    border: 4px solid rgba(255,255,255,0.3);
                }
                .badge-premium {
                    font-size: 13px;
                    transition: all 0.2s ease;
                }
                .badge-premium:hover {
                    border-color: #4f46e5 !important;
                    color: #4f46e5 !important;
                }
            `}</style>
        </div>
    );
};

export default RecruiterCandidateProfile;
