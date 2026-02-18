import React from "react";
import {
    BsPatchCheck,
    BsShieldCheck,
    BsLightningCharge,
    BsGlobe,
    BsGem,
    BsRocketTakeoff,
    BsEye
} from "react-icons/bs";

const CompanyAbout = ({ company }) => {
    if (!company) return null;

    return (
        <div className="company-about-content">
            {/* ================= DISTINCTIVE / ORBITAL ================= */}
            <section className="py-5 distinctive-section overflow-hidden">
                <div className="container">
                    <div className="row g-5 align-items-center">
                        <div className="col-lg-6">
                            <div className="section-eyebrow mb-3">
                                <BsPatchCheck className="text-danger me-2" />
                                <span>DISTINCTIVE FEATURES</span>
                            </div>

                            <h2 className="distinctive-title mb-4">
                                What Makes <span className="highlight-red">{company.name}</span> <br />
                                <span className="highlight-dark">Distinctive</span> And <span className="highlight-red">Popular</span>?
                            </h2>

                            <div className="distinctive-features-list">
                                {company.chooseUs?.map((item, i) => (
                                    <div className="distinctive-feature-item" key={i}>
                                        <div className="feature-number">{i + 1}</div>
                                        <div className="feature-text">
                                            <h6>{item.title}</h6>
                                            <p>{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="orbital-graphic-container">
                                <div className="orbit orbit-1"></div>
                                <div className="orbit orbit-2"></div>
                                <div className="orbit orbit-3"></div>

                                <div className="orbital-center">
                                    <img src={company.logo} alt={company.name} className="orbital-logo" />
                                </div>

                                <div className="orbit-dot dot-1"><BsShieldCheck /></div>
                                <div className="orbit-dot dot-2"><BsLightningCharge /></div>
                                <div className="orbit-dot dot-3"><BsGlobe /></div>
                                <div className="orbit-dot dot-4"><BsGem /></div>
                                <div className="orbit-dot dot-5"><BsRocketTakeoff /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= SERVICES ================= */}
            <section className="py-5 bg-white">
                <div className="container">
                    <h2 className="premium-section-title">Our Services</h2>
                    <div className="row g-4 d-flex justify-content-center">
                        {company.services?.map((service, i) => (
                            <div className="col-md-3" key={i}>
                                <div className="service-card p-4 text-center border rounded-4 shadow-sm h-100">
                                    <BsPatchCheck className="text-danger mb-3 fs-3" />
                                    <h5 className="fw-bold mb-0">{service}</h5>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= VISION & MISSION ================= */}
            <section className="py-5 mt-4">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="feature-block-box vision-block">
                                <div className="block-icon"><BsEye /></div>
                                <h3 className="block-title">Our Vision</h3>
                                <p className="block-desc">{company.vision || "To be the most trusted and innovative real estate partner, creating sustainable spaces that inspire."}</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="feature-block-box mission-block">
                                <div className="block-icon"><BsRocketTakeoff /></div>
                                <h3 className="block-title">Our Mission</h3>
                                <p className="block-desc">{company.mission || "Our mission is to deliver exceptional value through transparent practices and cutting-edge design."}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= GALLERY ================= */}
            <section className="py-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="premium-section-title">Corporate Gallery</h2>
                    </div>
                    <div className="gallery-grid-premium">
                        {company.gallery?.map((img, i) => (
                            <div className="gallery-item" key={i}>
                                <img src={img} alt="Gallery" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= LEADERSHIP TEAM ================= */}
            <section className="py-5 bg-light mb-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="premium-section-title">Leadership Team</h2>
                    </div>
                    <div className="row g-4 justify-content-center">
                        {company.team?.map((m, i) => (
                            <div className="col-md-3 col-6" key={i}>
                                <div className="team-member-card text-center">
                                    <div className="member-img-wrapper mx-auto" style={{ width: '150px', height: '150px' }}>
                                        <img src={m.img} alt={m.name} className="img-fluid rounded-circle" />
                                    </div>
                                    <h5 className="member-name mt-3">{m.name}</h5>
                                    <p className="member-role">{m.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CompanyAbout;