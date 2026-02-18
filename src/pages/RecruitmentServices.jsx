import React from "react";
import { BsArrowRight } from "react-icons/bs";

const roles = [
    {
        title: "Hardware Engineers",
        img: "https://randomuser.me/api/portraits/men/32.jpg",
        desc: "Access our AI-powered talent pool to hire skilled hardware engineers faster and smarter.",
    },
    {
        title: "Software Architects",
        img: "https://randomuser.me/api/portraits/men/45.jpg",
        desc: "AI-driven recruitment solutions to identify top software architects with precision.",
    },
    {
        title: "Project Managers",
        img: "https://randomuser.me/api/portraits/women/65.jpg",
        desc: "Real-time AI recruitment to match experienced project managers for your business needs.",
    },
    {
        title: "Requirements Engineer",
        img: "https://randomuser.me/api/portraits/women/44.jpg",
        desc: "Enhanced job search and screening to recruit requirement engineers with the right expertise.",
    },
];


const RecruitmentServices = () => {
    return (
        <section className="recruit-section">
            <div className="container">

                {/* Heading */}
                <div className="text-center mb-5" data-aos="fade-up">
                    <span className="recruit-badge">
                        OPEN POSITIONS
                    </span>

                    <h2 className="recruit-title mt-3">
                        Find Your Next <span className="highlight-red">Great Talent</span> in Real Estate & IT
                    </h2>

                    <p className="recruit-desc mt-3 mx-auto">
                        We maintain a constant recruitment process for talents across multiple areas of expertise, ensuring you get the best fit for your team.
                    </p>
                </div>

                {/* Cards */}
                <div className="row g-4">
                    {roles.map((role, index) => (
                        <div className="col-12 col-sm-6 col-lg-3" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                            <div className="recruit-card">
                                <div className="recruit-img-box">
                                    <img
                                        src={role.img}
                                        alt={role.title}
                                        className="recruit-img"
                                    />
                                </div>

                                <h5 className="recruit-role-title">
                                    {role.title}
                                </h5>
                                <p className="recruit-role-desc">
                                    {role.desc}
                                </p>


                                <button className="recruit-btn" aria-label={`Recruit ${role.title}`}>
                                    Recruit Now <BsArrowRight />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default RecruitmentServices;
