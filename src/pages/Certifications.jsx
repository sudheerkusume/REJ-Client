import api from "../config/api";
import React, { useEffect, useState } from "react";
import { BsClock, BsAward, BsLaptop, BsStarFill, BsArrowRight } from "react-icons/bs";

const Certifications = () => {
    const [certs, setCerts] = useState([]);

    useEffect(() => {
        api
            .get("/Certifications")
            .then((res) => setCerts(res.data))
            .catch((err) => console.log(err));
    }, []);

    return (
        <section className="cert-section">
            <div className="container">
                <div className="text-center mb-5" data-aos="fade-up">
                    <span className="recruit-badge">GROWTH</span>
                    <h2 className="recruit-title mt-3">
                        Real Estate <span className="highlight-red">Certifications Programs</span>
                    </h2>
                    <p className="recruit-desc mt-3 mx-auto">
                        Elevate your career with industry-recognized certifications designed for real estate professionals.
                    </p>
                </div>

                <div className="row g-4">
                    {certs.map((cert, index) => (
                        <div className="col-md-6 col-lg-4" key={cert.id} data-aos="fade-up" data-aos-delay={index * 100}>
                            <div className="cert-card h-100">
                                <div className="cert-img-wrapper">
                                    <img src={cert.image} alt={cert.title} className="cert-img" />
                                    <span className="cert-category-badge">{cert.category}</span>
                                </div>

                                <div className="cert-body">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="cert-provider text-muted text-uppercase small fw-bold">
                                            {cert.certificationProvider}
                                        </span>
                                        <div className="cert-rating">
                                            <BsStarFill className="text-warning me-1" />
                                            <span>{cert.rating}</span>
                                        </div>
                                    </div>

                                    <h5 className="cert-title">{cert.title}</h5>

                                    <div className="cert-meta my-3">
                                        <div className="cert-meta-item">
                                            <BsAward className="me-2 text-danger" /> {cert.level}
                                        </div>
                                        <div className="cert-meta-item">
                                            <BsClock className="me-2 text-danger" /> {cert.duration}
                                        </div>
                                        <div className="cert-meta-item">
                                            <BsLaptop className="me-2 text-danger" /> {cert.mode}
                                        </div>
                                    </div>

                                    <hr className="cert-divider" />

                                    <div className="d-flex justify-content-between align-items-center mt-auto">
                                        <div>
                                            {/* <span className="text-muted small text-decoration-line-through">₹{cert.price + 2000}</span> */}
                                            <span className="cert-price">₹{cert.price.toLocaleString()}</span>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-outline-dark rounded-pill btn-sm px-3 fw-medium">
                                                Syllabus
                                            </button>
                                            <button className="btn btn-danger rounded-pill btn-sm px-3 fw-medium d-flex align-items-center">
                                                Enroll <BsArrowRight className="ms-1" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Certifications;