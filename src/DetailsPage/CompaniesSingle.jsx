import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../config/api";
import {
    BsPeople,
    BsBriefcase,
    BsBuilding,
    BsArrowUpRight,
    BsGlobe
} from "react-icons/bs";

/* ===== SUB COMPONENTS ===== */
import CompanyAbout from "../pages/CompanyPage/CompanyAbout";
import CompanyProjects from "../pages/CompanyPage/CompanyProjects";
import CompanyJobs from "../pages/CompanyPage/CompanyJobs";

/* ===== STYLES / ASSETS ===== */
import BannerImage from "../Accets/bannerA.jpeg";

const CompaniesSingle = () => {
    const { id } = useParams();

    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState("about"); // Default view is about

    /* ================= FETCH DATA ================= */
    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchData = async () => {
            try {
                const [companiesRes, jobsRes] = await Promise.all([
                    api.get("/companies"),
                    api.get("/jobCategories")
                ]);

                const selectedCompany = companiesRes.data.find(
                    c => c._id === id
                );

                setCompany(selectedCompany || null);
                setJobs(jobsRes.data || []);
            } catch (error) {
                console.error("Error loading company:", error);
                setCompany(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    /* ================= VIEW SWITCHER ================= */
    const renderContent = () => {
        switch (view) {
            case "about":
                return <CompanyAbout company={company} />;
            case "projects":
                return <CompanyProjects company={company} />;
            case "jobs":
                return <CompanyJobs company={company} jobs={jobs} />;
            default:
                return <CompanyAbout company={company} />;
        }
    };

    /* ================= LOADING ================= */
    if (loading) {
        return (
            <div className="p-5 text-center" style={{ minHeight: "80vh" }}>
                <div className="spinner-border text-danger mb-3" />
                <div className="fw-bold">Fetching Company Profile...</div>
            </div>
        );
    }

    /* ================= NOT FOUND ================= */
    if (!company) {
        return (
            <div className="text-center p-5" style={{ minHeight: "60vh", display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h2 className="fw-bold text-dark">Company not found</h2>
                <p className="text-muted">The company profile you are looking for does not exist or has been removed.</p>
                <Link to="/companies" className="apply-btn mt-3 mx-auto" style={{ width: 'fit-content' }}>
                    Back to Directory
                </Link>
            </div>
        );
    }

    const companyJobsCount = jobs.filter(
        j => j.companyId === company._id || j.company === company.name
    ).length;

    return (
        <div className="company-details-page">

            {/* ================= HERO ================= */}
            <section
                className="company-hero-cinematic"
                style={{ backgroundImage: `url(${BannerImage})` }}
            >
                <div className="hero-overlay-dark"></div>
                <div className="container">
                    <div className="hero-glass-card">
                        <span className="glass-badge">Corporate Profile</span>

                        <h1 className="cinematic-name" data-text={company.name}>{company.name}</h1>
                        <p className="cinematic-tagline">{company.tagline || "Redefining Urban Living with Visionary Excellence."}</p>

                        <div className="hero-btn-group">
                            {company.website && (
                                <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="apply-btn d-flex align-items-center gap-2"
                                >
                                    Visit Website <BsArrowUpRight />
                                </a>
                            )}

                            <button className="btn btn-light fw-semibold px-4 py-2 rounded-pill shadow-sm">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= INFO BAR ================= */}
            <div className="container" style={{ marginTop: "-50px", position: "relative", zIndex: 10 }}>
                <div className="info-bar-box shadow-lg">
                    <div className="info-item">
                        <div className="info-item-icon"><BsBuilding /></div>
                        <div className="info-item-text">
                            <p>Headquarters</p>
                            <h6>{company.location}</h6>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="info-item-icon"><BsPeople /></div>
                        <div className="info-item-text">
                            <p>Global Team</p>
                            <h6>{company.employees}+ Professionals</h6>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="info-item-icon"><BsBriefcase /></div>
                        <div className="info-item-text">
                            <p>Current Openings</p>
                            <h6>{companyJobsCount} Roles Available</h6>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="info-item-icon"><BsGlobe /></div>
                        <div className="info-item-text">
                            <p>Industry</p>
                            <h6>{company.industry}</h6>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= NAVIGATION ================= */}
            <div className="container mt-4 mb-2">
                <div className="company-nav d-flex gap-5 border-bottom justify-content-center">
                    <button
                        className={`company-nav-btn ${view === "about" ? "active" : ""}`}
                        onClick={() => setView("about")}
                    >
                        About Us
                    </button>

                    <button
                        className={`company-nav-btn ${view === "projects" ? "active" : ""}`}
                        onClick={() => setView("projects")}
                    >
                        Projects
                    </button>

                    <button
                        className={`company-nav-btn ${view === "jobs" ? "active" : ""}`}
                        onClick={() => setView("jobs")}
                    >
                        Positions
                    </button>
                </div>
            </div>

            {/* ================= VIEW RENDER ================= */}
            <div className="container">
                <div className="fade-in-content">
                    {renderContent()}
                </div>
            </div>

            {/* ================= FLOATING JOBS BUTTON ================= */}
            {view !== "jobs" && companyJobsCount > 0 && (
                <button
                    className="floating-jobs-btn"
                    onClick={() => {
                        setView("jobs");
                        window.scrollTo({ top: 400, behavior: "smooth" });
                    }}
                >
                    <BsBriefcase className="me-2" />
                    Openings ({companyJobsCount})
                </button>
            )}

        </div>
    );
};

export default CompaniesSingle;
