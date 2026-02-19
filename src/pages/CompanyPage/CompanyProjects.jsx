import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../config/api";
import { BsArrowRight } from "react-icons/bs";

const CompanyProjects = ({ company }) => {
    const [standaloneProjects, setStandaloneProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!company?._id) return;

        const fetchStandalone = async () => {
            try {
                const res = await api.get(`/projects/company/${company._id}`);
                setStandaloneProjects(res.data || []);
            } catch (err) {
                console.error("Error fetching standalone projects:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStandalone();
    }, [company]);

    if (!company) return null;

    // Merge nested projects (legacy) with standalone projects
    // Legacy projects use 'id', new ones use '_id'
    const nestedProjects = company.projects || [];

    // Combine them. We prioritize standalone projects if necessary, but here we just list both.
    // Note: Legacy projects are objects with { id, title, desc, img ... }
    // New projects are objects with { _id, title, description, gallery ... }
    const allProjects = [
        ...nestedProjects.map(p => ({
            ...p,
            isLegacy: true,
            displayId: p.id || p._id, // fallback
            displayTitle: p.title,
            displayDesc: p.desc || p.description,
            displayImg: p.img || (p.gallery && p.gallery[0])
        })),
        ...standaloneProjects.map(p => ({
            ...p,
            isLegacy: false,
            displayId: p._id,
            displayTitle: p.title,
            displayDesc: p.description || p.desc,
            displayImg: (p.gallery && p.gallery.length > 0) ? p.gallery[0] : (p.img || p.thumbnail)
        }))
    ];

    return (
        <section className="py-5 bg-light mb-5">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="premium-section-title">Highlighted  Projects</h2>
                    <p className="text-muted">Discover our architectural masterpieces and urban milestones.</p>
                </div>

                <div className="row g-4">
                    {loading ? (
                        <div className="col-12 text-center py-5">
                            <div className="spinner-border text-danger" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : allProjects.length > 0 ? (
                        allProjects.map((proj, i) => (
                            <div className="col-lg-4 col-md-6" key={proj.displayId || i}>
                                <div className="project-card-premium h-100">
                                    <div className="project-img-wrapper">
                                        <img
                                            src={proj.displayImg || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"}
                                            alt={proj.displayTitle}
                                            className="w-100 h-100 object-fit-cover"
                                        />
                                        <span className="project-badge">{proj.category || "Residential"}</span>
                                    </div>
                                    <div className="project-content p-4">
                                        <h4 className="fw-bold">{proj.displayTitle}</h4>
                                        <p className="text-muted small">
                                            {proj.displayDesc?.length > 100
                                                ? proj.displayDesc.substring(0, 100) + "..."
                                                : proj.displayDesc}
                                        </p>
                                        <Link
                                            to={`/companies/${company._id}/projects/${proj.displayId}`}
                                            className="text-danger fw-bold text-decoration-none small d-flex align-items-center gap-2"
                                        >
                                            View Details <BsArrowRight />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <p className="text-muted">No highlighted projects available at the moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CompanyProjects;