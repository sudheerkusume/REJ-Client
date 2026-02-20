import React from 'react';
import { BsCheckCircle, BsPeople, BsLightbulb, BsShieldCheck, BsGlobe } from 'react-icons/bs';
import { FaHandshake } from 'react-icons/fa';

const About = () => {
  return (
    <div className="about-page">
      {/* 1. Hero Section */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="container position-relative z-2 text-center text-white">
          <h5 className="text-uppercase letter-spacing-2 mb-3 text-warning">Welcome to Real Estate Jobs</h5>
          <h1 className="display-3 fw-bold mb-4">Your Gateway to a Thriving <br /> Real Estate Career</h1>
          <p className="lead opacity-75 mx-auto" style={{ maxWidth: '700px' }}>
            We connect ambitious professionals with top-tier real estate companies, bridging the gap between talent and opportunity.
          </p>
        </div>
      </section>

      {/* 2. Who We Are */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-10">
              <h2 className="section-title mb-4">Who We <span className="highlight-red">Are</span></h2>
              <p className="text-muted fs-5 lh-lg mb-5">
                <strong>RealEstateJobs</strong> is a specialized recruitment and career platform dedicated exclusively to the real estate industry.
                We connect skilled professionals with leading real estate developers, brokerage firms, property consultancies,
                construction companies, and proptech startups across India.

                Our mission is to bridge the gap between talent and opportunity in the rapidly growing real estate ecosystem.
                From fresh graduates to experienced professionals, we help candidates discover roles that align with their skills,
                career goals, and industry expertise.
              </p>
            </div>
          </div>

          <div className="row align-items-center mt-4">
            <div className="col-lg-6 mb-4 mb-lg-0" data-aos="fade-right">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070"
                alt="Office Building"
                className="img-fluid rounded-4 shadow-lg about-img-hover"
              />
            </div>
            <div className="col-lg-6 ps-lg-5" data-aos="fade-left">
              <h3 className="mb-4 fw-bold">About <span className="text-danger">RE JOBS</span></h3>
              <p className="text-muted mb-4">
                Welcome to RealEstateJobs.com – India's first and only exclusive job portal exclusively designed for the real estate industry. Whether you are a job seeker looking to build a career or an employer searching for top talent, we are here to connect you with the right opportunities.
              </p>
              <div className="d-flex gap-3">
                <div className="d-flex align-items-center gap-2">
                  <BsCheckCircle className="text-danger fs-4" />
                  <span className="fw-semibold">Exclusive Portal</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <BsCheckCircle className="text-danger fs-4" />
                  <span className="fw-semibold">Verified Jobs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="section-padding bg-light">
        <div className="container">
          {/* Vision */}
          <div className="row align-items-center mb-5 pb-5">
            <div className="col-lg-6 order-2 order-lg-1" data-aos="fade-right">
              <h5 className="text-danger fw-bold text-uppercase mb-2">Our Vision</h5>
              <h2 className="fw-bold mb-4">To become India's most trusted hub</h2>
              <p className="text-muted">
                To become the most trusted and immediate hub for real estate employers to connect with their employees and job seekers.
                We define our vision as being the most reliable platform that bridges the gap, empowering careers and fueling business growth.
              </p>
            </div>
            <div className="col-lg-6 order-1 order-lg-2 mb-4 mb-lg-0 text-center" data-aos="fade-left">
              <div className="vision-img-box">
                <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2070" alt="Vision" className="img-fluid rounded-circle shadow-lg" style={{ width: '350px', height: '350px', objectFit: 'cover' }} />
              </div>
            </div>
          </div>

          {/* Mission */}
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0 text-center" data-aos="fade-right">
              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070" alt="Mission" className="img-fluid rounded-4 shadow-lg" />
            </div>
            <div className="col-lg-6 ps-lg-5" data-aos="fade-left">
              <h5 className="text-danger fw-bold text-uppercase mb-2">Our Mission</h5>
              <h2 className="fw-bold mb-4">Empowering the Ecosystem</h2>
              <p className="text-muted">
                Our mission is to empower people worldwide to find work they love. We strive to simplify the hiring process, ensuring compliance, and creating a safe environment specific to the real estate sector.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Values */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Our Core <span className="highlight-red">Values</span></h2>
          </div>

          <div className="row g-4">
            {[
              { icon: <FaHandshake />, title: 'Service Beyond Self', desc: 'We serve with empathy and prioritize impact through each Poppinsaction.' },
              { icon: <BsGlobe />, title: 'Sustainability', desc: 'We are committed to long-term impact and secure practices.' },
              { icon: <BsPeople />, title: 'Empowerment', desc: 'We believe in encouraging individuals and leading teams to grow.' },
              { icon: <BsShieldCheck />, title: 'Integrity', desc: 'Upholding strict standards of honesty, ethics, and trust.' },
              { icon: <BsCheckCircle />, title: 'Accountability', desc: 'We take full responsibility for our actions and outcomes.' },
              { icon: <BsLightbulb />, title: 'Transparency', desc: 'We value truth, research, and honesty in all Poppinsactions.' },
            ].map((val, i) => (
              <div className="col-md-6 col-lg-4" key={i}>
                <div className="value-card">
                  <div className="value-icon-box">{val.icon}</div>
                  <h5 className="fw-bold mt-3">{val.title}</h5>
                  <p className="text-muted small mb-0">{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. What We Offer */}
      <section className="section-padding bg-dark text-white">
        <div className="container">
          <h2 className="mb-5 border-start border-danger border-5 ps-3">What We Offer</h2>
          <div className="row g-4 mb-5">
            <div className="col-md-6">
              <h5 className="text-white fw-bold">Exclusive Real Estate Focus</h5>
              <p className="text-secondary small">We are dedicated purely to the real estate industry, understanding its unique needs unlike generic portals.</p>
            </div>
            <div className="col-md-6">
              <h5 className="text-white fw-bold">Comprehensive Career Opportunities</h5>
              <p className="text-secondary small">From entry-level to leadership roles, we cover sales, marketing, tech, legal, and more.</p>
            </div>
            <div className="col-md-6">
              <h5 className="text-white fw-bold">Smart & User-Friendly Platform</h5>
              <p className="text-secondary small">Our technology-driven platform ensures relevant matches using advanced filters and algorithms.</p>
            </div>
            <div className="col-md-6">
              <h5 className="text-white fw-bold">Invaluable Resources</h5>
              <p className="text-secondary small">Skill assessments, resume support, and career guidance tailored for real estate professionals.</p>
            </div>
          </div>

          <div className="cta-box text-center p-5 rounded-4 bg-gradient-red">
            <h3 className="fw-bold mb-4">Ready to Start Your Journey?</h3>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <button className="btn btn-light rounded-pill px-4 fw-bold">
                <BsPeople className="me-2" /> Real Estate APPLICANTS
              </button>
              <button className="btn btn-outline-light rounded-pill px-4 fw-bold">
                <FaHandshake className="me-2" /> Real Estate RECRUITERS
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;