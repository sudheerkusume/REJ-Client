import React, { useEffect, useState } from "react";
import api from "../config/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    FiGrid,
    FiBriefcase,
    FiFolder,
    FiUser,
    FiLogOut,
    FiSearch,
    FiBell,
    FiMail,
    FiPlusCircle,
    FiMapPin,
    FiUsers,
    FiClock
} from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { BsArrowRight, BsGeoAlt } from "react-icons/bs";
import { Link } from "react-router-dom";
import logo from "../Accets/image.png";
import "../DashboardStyles.css";

const CompanyDashboard = () => {
    const navigate = useNavigate();
    const { logout: authLogout, user: authUser } = useAuth();
    const [view, setView] = useState("dashboard");
    const [company, setCompany] = useState(null);
    const [projects, setProjects] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("authToken") || localStorage.getItem("companyToken");
        if (!token) return navigate("/login");

        const fetchData = async () => {
            try {
                // Fetch company profile
                const companyRes = await api.get(`/companies/${authUser?.id}`);
                setCompany(companyRes.data);

                // Fetch company projects
                const projectsRes = await api.get(`/projects/company/${authUser?.id}`);
                setProjects(projectsRes.data || []);

                // Fetch jobs and filter by company
                const jobsRes = await api.get("/jobCategories");
                const allJobs = jobsRes.data || [];
                const companyJobs = allJobs.filter(
                    job => job.companyId === authUser?.id || job.company === companyRes.data?.name
                );
                setJobs(companyJobs);
            } catch (err) {
                console.error("Error fetching company data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate, authUser]);

    const handleLogout = () => {
        authLogout();
        navigate("/login");
    };

    const companyName = company?.name || authUser?.name || "Company";

    const sidebarItems = [
        { key: "dashboard", label: "Dashboard", icon: <FiGrid /> },
        { key: "projects", label: "My Projects", icon: <FiFolder /> },
        { key: "jobs", label: "Job Postings", icon: <FiBriefcase /> },
        { key: "profile", label: "Company Profile", icon: <FiUser /> },
    ];

    const renderView = () => {
        switch (view) {
            case "dashboard":
                return renderOverview();
            case "projects":
                return renderProjects();
            case "jobs":
                return renderJobs();
            case "profile":
                return renderProfile();
            default:
                return null;
        }
    };

    /* ================= OVERVIEW ================= */
    const renderOverview = () => {
        const statCards = [
            { label: "Total Projects", value: projects.length, icon: <FiFolder />, color: "#4f46e5", bg: "#eef2ff" },
            { label: "Total Jobs", value: jobs.length, icon: <FiBriefcase />, color: "#ca8a04", bg: "#fefce8" },
            { label: "Team Members", value: company?.team?.length || 0, icon: <FiUsers />, color: "#16a34a", bg: "#f0fdf4" },
        ];

        return (
            <div className="animate-fade-in">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 className="fw-bold text-dark mb-1">Welcome, {companyName}</h2>
                        <p className="text-muted mb-0">Here's an overview of your company's activity.</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="row g-4 mb-5">
                    {statCards.map((card, idx) => (
                        <div className="col-12 col-sm-6 col-xl-4" key={idx}>
                            <div className="card border-0 shadow-sm rounded-4 p-4 h-100 transition-hover">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div className="p-3 rounded-3" style={{ backgroundColor: card.bg, color: card.color, fontSize: "24px" }}>
                                        {card.icon}
                                    </div>
                                </div>
                                <h1 className="fw-bold text-dark mb-1">{card.value}</h1>
                                <div className="text-muted small fw-medium">{card.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions + Recent Projects */}
                <div className="row g-4">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                <h5 className="fw-bold mb-0">Recent Projects</h5>
                                <button className="btn btn-link text-decoration-none text-primary fw-bold small p-0" onClick={() => setView("projects")}>
                                    View All
                                </button>
                            </div>

                            {projects.length === 0 ? (
                                <div className="text-center py-5">
                                    <FiClock size={48} className="text-muted opacity-25 mb-3" />
                                    <h6 className="fw-bold">No Projects Yet</h6>
                                    <p className="text-muted small">Your projects will appear here once added.</p>
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {projects.slice(0, 3).map((proj) => (
                                        <div className="col-md-4" key={proj._id}>
                                            <div className="border rounded-3 overflow-hidden h-100">
                                                <img
                                                    src={proj.gallery?.[0] || proj.img || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400"}
                                                    alt={proj.title}
                                                    className="w-100"
                                                    style={{ height: "140px", objectFit: "cover" }}
                                                />
                                                <div className="p-3">
                                                    <h6 className="fw-bold mb-1">{proj.title}</h6>
                                                    <p className="text-muted small mb-0">
                                                        {proj.description?.substring(0, 60) || proj.desc?.substring(0, 60) || "No description"}...
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-4 p-4 bg-primary text-white overflow-hidden position-relative mb-4">
                            <div className="position-relative" style={{ zIndex: 1 }}>
                                <h5 className="fw-bold mb-3">Manage Your Company</h5>
                                <p className="small opacity-75 mb-4">Update your profile, add projects, and post new job openings.</p>
                                <button
                                    className="btn btn-light rounded-pill px-4 py-2 fw-bold text-primary w-100 shadow-sm"
                                    onClick={() => setView("profile")}
                                >
                                    View Profile
                                </button>
                            </div>
                            <div className="position-absolute bottom-0 end-0 opacity-10" style={{ transform: "translate(20%, 20%)" }}>
                                <FiBriefcase size={200} />
                            </div>
                        </div>

                        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                            <h6 className="fw-bold mb-3">Quick Actions</h6>
                            <div className="d-flex flex-column gap-2">
                                <button onClick={() => setView("projects")} className="btn btn-outline-light text-dark text-start border d-flex align-items-center gap-3 p-3 rounded-3 transition-hover">
                                    <div className="p-2 rounded-circle bg-light text-primary"><FiFolder /></div>
                                    <div>
                                        <div className="fw-bold small">My Projects</div>
                                        <div className="text-muted" style={{ fontSize: "11px" }}>View all projects</div>
                                    </div>
                                </button>
                                <button onClick={() => setView("jobs")} className="btn btn-outline-light text-dark text-start border d-flex align-items-center gap-3 p-3 rounded-3 transition-hover">
                                    <div className="p-2 rounded-circle bg-light text-success"><FiBriefcase /></div>
                                    <div>
                                        <div className="fw-bold small">Job Postings</div>
                                        <div className="text-muted" style={{ fontSize: "11px" }}>Manage job listings</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    /* ================= PROJECTS ================= */
    const renderProjects = () => (
        <div className="animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark mb-1">My Projects</h2>
                    <p className="text-muted mb-0">{projects.length} project{projects.length !== 1 ? "s" : ""} listed</p>
                </div>
            </div>

            {projects.length === 0 ? (
                <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
                    <FiFolder size={48} className="text-muted opacity-25 mb-3 mx-auto" />
                    <h5 className="fw-bold">No Projects Yet</h5>
                    <p className="text-muted small">Your company projects will appear here.</p>
                </div>
            ) : (
                <div className="row g-4">
                    {projects.map((proj) => (
                        <div className="col-lg-4 col-md-6" key={proj._id}>
                            <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 transition-hover">
                                <img
                                    src={proj.gallery?.[0] || proj.img || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"}
                                    alt={proj.title}
                                    className="w-100"
                                    style={{ height: "200px", objectFit: "cover" }}
                                />
                                <div className="p-4">
                                    <span className="badge bg-primary-subtle text-primary rounded-pill mb-2">{proj.category || "Residential"}</span>
                                    <h5 className="fw-bold">{proj.title}</h5>
                                    <p className="text-muted small">
                                        {(proj.description || proj.desc || "").substring(0, 100)}
                                        {(proj.description || proj.desc || "").length > 100 ? "..." : ""}
                                    </p>
                                    {proj.location && (
                                        <div className="text-muted small d-flex align-items-center gap-1 mb-2">
                                            <FiMapPin size={14} /> {proj.location}
                                        </div>
                                    )}
                                    <Link
                                        to={`/companies/${company?._id}/projects/${proj._id}`}
                                        className="text-primary fw-bold text-decoration-none small d-flex align-items-center gap-2"
                                    >
                                        View Details <BsArrowRight />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    /* ================= JOBS ================= */
    const renderJobs = () => (
        <div className="animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark mb-1">Job Postings</h2>
                    <p className="text-muted mb-0">{jobs.length} job{jobs.length !== 1 ? "s" : ""} posted</p>
                </div>
            </div>

            {jobs.length === 0 ? (
                <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
                    <FiBriefcase size={48} className="text-muted opacity-25 mb-3 mx-auto" />
                    <h5 className="fw-bold">No Job Postings</h5>
                    <p className="text-muted small">Your job postings will appear here.</p>
                </div>
            ) : (
                <div className="d-flex flex-column gap-3">
                    {jobs.map((job) => (
                        <div className="card border-0 shadow-sm rounded-4 p-4" key={job._id || job.id}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="fw-bold mb-2">{job.title}</h5>
                                    <div className="d-flex gap-3">
                                        <small className="text-muted d-flex align-items-center gap-1">
                                            <BsGeoAlt className="text-primary" /> {job.location || "Remote"}
                                        </small>
                                        <small className="text-muted d-flex align-items-center gap-1">
                                            <FiBriefcase className="text-primary" /> {job.type || "Full Time"}
                                        </small>
                                        {job.salary && (
                                            <small className="text-muted">{job.salary}</small>
                                        )}
                                    </div>
                                </div>
                                <Link
                                    to={`/jobs/${job._id || job.id}`}
                                    className="btn btn-outline-primary rounded-pill px-4 py-2 fw-bold small"
                                >
                                    View <BsArrowRight className="ms-1" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    /* ================= PROFILE ================= */
    const renderProfile = () => {
        if (!company) {
            return (
                <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
                    <FiUser size={48} className="text-muted opacity-25 mb-3 mx-auto" />
                    <h5 className="fw-bold">Profile Not Found</h5>
                    <p className="text-muted small">Unable to load company profile.</p>
                </div>
            );
        }

        return (
            <div className="animate-fade-in">
                <h2 className="fw-bold text-dark mb-4">Company Profile</h2>

                {/* Basic Info */}
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                    <div className="d-flex align-items-center gap-4 mb-4">
                        {company.logo ? (
                            <img src={company.logo} alt={company.name} className="rounded-circle" style={{ width: "80px", height: "80px", objectFit: "cover" }} />
                        ) : (
                            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: "80px", height: "80px", fontSize: "32px" }}>
                                {company.name?.charAt(0)}
                            </div>
                        )}
                        <div>
                            <h3 className="fw-bold mb-1">{company.name}</h3>
                            {company.tagline && <p className="text-muted mb-1">{company.tagline}</p>}
                            <div className="d-flex gap-3 text-muted small">
                                {company.industry && <span>{company.industry}</span>}
                                {company.location && <span><FiMapPin size={14} className="me-1" />{company.location}</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services */}
                {company.services?.length > 0 && (
                    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                        <h5 className="fw-bold mb-3">Services</h5>
                        <div className="d-flex flex-wrap gap-2">
                            {company.services.map((service, i) => (
                                <span key={i} className="badge bg-light text-dark border px-3 py-2 rounded-pill fw-medium">{service}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Vision & Mission */}
                {(company.vision || company.mission) && (
                    <div className="row g-4 mb-4">
                        {company.vision && (
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                                    <h5 className="fw-bold mb-2">Vision</h5>
                                    <p className="text-muted mb-0">{company.vision}</p>
                                </div>
                            </div>
                        )}
                        {company.mission && (
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                                    <h5 className="fw-bold mb-2">Mission</h5>
                                    <p className="text-muted mb-0">{company.mission}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Team */}
                {company.team?.length > 0 && (
                    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                        <h5 className="fw-bold mb-3">Leadership Team</h5>
                        <div className="row g-3">
                            {company.team.map((member, i) => (
                                <div className="col-md-3 col-6" key={i}>
                                    <div className="text-center">
                                        {member.img ? (
                                            <img src={member.img} alt={member.name} className="rounded-circle mb-2" style={{ width: "70px", height: "70px", objectFit: "cover" }} />
                                        ) : (
                                            <div className="rounded-circle bg-light text-primary d-flex align-items-center justify-content-center mx-auto mb-2 fw-bold" style={{ width: "70px", height: "70px" }}>
                                                {member.name?.charAt(0)}
                                            </div>
                                        )}
                                        <h6 className="fw-bold mb-0 small">{member.name}</h6>
                                        <span className="text-muted" style={{ fontSize: "12px" }}>{member.role}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Gallery */}
                {company.gallery?.length > 0 && (
                    <div className="card border-0 shadow-sm rounded-4 p-4">
                        <h5 className="fw-bold mb-3">Gallery</h5>
                        <div className="row g-3">
                            {company.gallery.map((img, i) => (
                                <div className="col-md-4 col-6" key={i}>
                                    <img src={img} alt="Gallery" className="w-100 rounded-3" style={{ height: "180px", objectFit: "cover" }} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
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
                        <img src={logo} alt="Logo" className="img-fluid" style={{ maxHeight: "40px" }} />
                    </div>

                    <nav className="flex-grow-1 p-3 mt-2">
                        <div className="nav-group mb-4">
                            <label className="text-uppercase text-muted small fw-bold mb-3 d-block px-3" style={{ letterSpacing: "1px" }}>Menu</label>
                            {sidebarItems.map((item) => (
                                <button
                                    key={item.key}
                                    onClick={() => setView(item.key)}
                                    className={`dash-nav-item mb-2 w-100 text-start border-0 bg-transparent py-2 px-3 rounded-3 d-flex align-items-center gap-3 ${view === item.key ? "active" : ""}`}
                                >
                                    {item.icon} {item.label}
                                </button>
                            ))}
                        </div>
                    </nav>

                    <div className="p-3 border-top">
                        <button onClick={handleLogout} className="dash-nav-item text-danger border-0 bg-transparent py-2 px-3 rounded-3 d-flex align-items-center gap-3 w-100 text-start">
                            <FiLogOut /> Logout
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="col-lg-10 col-md-9 col-12 dash-main bg-light min-vh-100">

                    {/* Header */}
                    <header className="dash-header sticky-top bg-white border-bottom p-3 d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-3 flex-grow-1 mx-3">
                            <div className="position-relative flex-grow-1" style={{ maxWidth: "400px" }}>
                                <FiSearch className="position-absolute text-muted" style={{ left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="form-control border-0 bg-light rounded-pill ps-5 py-2"
                                    style={{ fontSize: "14px" }}
                                />
                            </div>
                        </div>

                        <div className="d-flex align-items-center gap-3 pe-3">
                            <button className="btn btn-light rounded-circle p-2 position-relative">
                                <FiBell className="text-muted" />
                            </button>
                            <button className="btn btn-light rounded-circle p-2">
                                <FiMail className="text-muted" />
                            </button>

                            <div className="vr mx-2"></div>

                            <div className="d-flex align-items-center gap-2">
                                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: "38px", height: "38px" }}>
                                    {companyName.charAt(0)}
                                </div>
                                <div className="d-none d-lg-block">
                                    <div className="fw-bold small">{companyName}</div>
                                    <div className="text-muted" style={{ fontSize: "10px" }}>Company Panel</div>
                                </div>
                                <IoIosArrowDown className="text-muted small" />
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="p-4">
                        {renderView()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CompanyDashboard;
