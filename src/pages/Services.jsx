import api from "../config/api";
import React, { useEffect, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import {
    FaGavel,
    FaChartLine,
    FaPaintBrush,
    FaHandHoldingUsd,
    FaCity,
} from "react-icons/fa";

const iconMap = {
    "Property Management": <FaCity />,
    "Legal Assistance": <FaGavel />,
    "Market Analysis": <FaChartLine />,
    "Poppinsior Design": <FaPaintBrush />,
    "Investment Consulting": <FaHandHoldingUsd />,
};

const Services = () => {
    const [services, setServices] = useState([]);
    const [activeService, setActiveService] = useState(null);

    useEffect(() => {
        api
            .get("/Services")
            .then((res) => {
                setServices(res.data);
                if (res.data.length > 0) {
                    setActiveService(res.data[0]);
                }
            })
            .catch((err) => console.log(err));
    }, []);

    if (!activeService) return <div>Loading...</div>;

    return (
        <section className="services-section">
            <div className="container">
                <div className="text-center mb-5" data-aos="fade-up">
                    <span className="recruit-badge">EXCLUSIVE</span>
                    <h2 className="recruit-title mt-3">
                        Our Premium <span className="highlight-red">Services</span>
                    </h2>
                </div>

                <div className="row align-items-center">
                    {/* List */}
                    <div className="col-lg-5 mb-4 mb-lg-0" data-aos="fade-right">
                        <div className="service-list">
                            {services.map((service) => (
                                <div
                                    key={service._id} // ✅ FIX
                                    className={`service-list-item ${activeService._id === service._id ? "active" : ""
                                        }`}
                                    onMouseEnter={() => setActiveService(service)}
                                >
                                    <div className="d-flex align-items-center justify-content-between w-100">
                                        <span className="service-list-title">
                                            {service.title}
                                        </span>
                                        <BsArrowRight className="service-arrow" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 ms-3 d-none d-lg-block">
                            <p className="text-muted" style={{ maxWidth: "400px" }}>
                                {activeService.desc}
                            </p>
                            <button className="recruit-btn mt-2">Learn More</button>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="col-lg-7" data-aos="fade-left">
                        <div className="service-preview">
                            {activeService.img && (
                                <img
                                    src={activeService.img}
                                    alt={activeService.title}
                                    className="service-preview-img"
                                    key={activeService._id}
                                />
                            )}

                            <div className="service-preview-overlay">
                                <div className="service-icon-box">
                                    {iconMap[activeService.title] || <FaCity />}
                                </div>
                                <h3>{activeService.title}</h3>
                            </div>
                        </div>

                        <div className="d-block d-lg-none mt-4 p-3 bg-light rounded-4">
                            <p className="mb-0 text-secondary">{activeService.desc}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;
