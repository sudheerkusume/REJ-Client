import React from "react";
import { Link } from "react-router-dom";
import { BsArrowRightCircle, BsGeoAlt, BsBriefcase } from "react-icons/bs";

const CompanyJobs = ({ company, jobs }) => {
    if (!company) return null;

    // Filter jobs by companyId or company name as a fallback
    const companyJobs = jobs.filter(
        job => job.companyId === company._id || job.company === company.name
    );

    return (
        <section className="py-5 mb-5">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="premium-section-title">
                        Career Opportunities at {company.name}
                    </h2>
                    <p className="text-muted">Join our visionary team and build the future of real estate.</p>
                </div>

                {companyJobs.length === 0 ? (
                    <div className="text-center py-5 border rounded-4 bg-light">
                        <BsBriefcase className="fs-1 text-muted mb-3" />
                        <p className="text-muted fw-semibold">No current openings available.</p>
                        <p className="small text-muted">Check back later or follow us for updates.</p>
                    </div>
                ) : (
                    <div className="row g-4 justify-content-center">
                        {companyJobs.map(job => (
                            <div className="col-md-10" key={job._id || job.id}>
                                <div className="opening-card-mini p-4 border rounded-4 shadow-sm d-flex justify-content-between align-items-center bg-white">
                                    <div>
                                        <h4 className="fw-bold mb-2">{job.title}</h4>
                                        <div className="d-flex gap-3">
                                            <small className="text-muted">
                                                <BsGeoAlt className="me-1 text-danger" />
                                                {job.location}
                                            </small>
                                            <small className="text-muted">
                                                <BsBriefcase className="me-1 text-danger" />
                                                {job.type || "Full Time"}
                                            </small>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/jobs/${job.id || job._id}`}
                                        className="apply-btn d-flex align-items-center gap-2 text-decoration-none"
                                    >
                                        Apply Now <BsArrowRightCircle />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default CompanyJobs;
