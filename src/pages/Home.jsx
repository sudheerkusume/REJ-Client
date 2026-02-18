// import React from 'react'
// import Banner1 from '../Accets/bannerA.jpeg'
// import Banner2 from '../Accets/bub.jpeg'
// import Banner3 from '../Accets/bannerF.jpeg'
// import Banner4 from '../Accets/bannerB.jpeg'
// import Banner5 from '../Accets/bannerC.jpeg'
// import Banner6 from '../Accets/bannerD.jpeg'
// const Home = () => {
//   return (
//     <div>
//       <div
//         id="realEstateCarousel"
//         className="carousel slide"
//         data-bs-ride="carousel"
//       >

//         {/* Carousel Indicators */}
//         <div className="carousel-indicators">
//           <button
//             type="button"
//             data-bs-target="#realEstateCarousel"
//             data-bs-slide-to="0"
//             className="active"
//             aria-current="true"
//           ></button>

//           <button
//             type="button"
//             data-bs-target="#realEstateCarousel"
//             data-bs-slide-to="1"
//           ></button>

//           <button
//             type="button"
//             data-bs-target="#realEstateCarousel"
//             data-bs-slide-to="2"
//           ></button>

//          <button
//             type="button"
//             data-bs-target="#realEstateCarousel"
//             data-bs-slide-to="3"
//           ></button>
//          <button
//             type="button"
//             data-bs-target="#realEstateCarousel"
//             data-bs-slide-to="4"
//           ></button>

//          <button
//             type="button"
//             data-bs-target="#realEstateCarousel"
//             data-bs-slide-to="5"
//           ></button>


//         </div>

//         {/* Carousel Slides */}
//         <div className="carousel-inner">
//           <div className="carousel-item active">
//             <img src={Banner1} className="d-block w-100 banner-img" alt="Dream House 1" />
//           </div>

//           <div className="carousel-item">
//             <img src={Banner2} className="d-block w-100 banner-img" alt="Dream House 2" />
//           </div>

//           <div className="carousel-item">
//             <img src={Banner3} className="d-block w-100 banner-img" alt="Dream House 3" />
//           </div>

//           <div className="carousel-item">
//             <img src={Banner4} className="d-block w-100 banner-img" alt="Dream House 4" />
//           </div>

//           <div className="carousel-item">
//             <img src={Banner5} className="d-block w-100 banner-img" alt="Dream House 5" />
//           </div>

//           <div className="carousel-item">
//             <img src={Banner6} className="d-block w-100 banner-img" alt="Dream House 6" />
//           </div>

//         </div>

//         {/* Controls */}
//         <button
//           className="carousel-control-prev"
//           type="button"
//           data-bs-target="#realEstateCarousel"
//           data-bs-slide="prev"
//         >
//           <span className="carousel-control-prev-icon"></span>
//         </button>

//         <button
//           className="carousel-control-next"
//           type="button"
//           data-bs-target="#realEstateCarousel"
//           data-bs-slide="next"
//         >
//           <span className="carousel-control-next-icon"></span>
//         </button>
//       </div>
//       <section className='container py-5 text-center'>
//         <h2 className='mb-4' style={{fontWeight:'450', color:'gray' }}>
//           Click to unlock your <b>Dream Real Estate Jobs</b> below
//         </h2>
//       </section>
//     </div>
//   )
// }

// export default Home

import React from "react";
import Banner1 from "../Accets/landing-page.png";
import Banner2 from "../Accets/bub.jpeg";
import Banner3 from "../Accets/bannerF.jpeg";
import Banner4 from "../Accets/bannerB.jpeg";
import Banner5 from "../Accets/bannerC.jpeg";
import Banner6 from "../Accets/bannerD.jpeg";

import { BsArrowRight, BsPlayFill, BsStars, BsShieldCheck, BsPeopleFill } from "react-icons/bs";
import { FaUserTie, FaBuilding } from "react-icons/fa";
import { MdVerified, MdOutlineVilla, MdWorkOutline } from "react-icons/md";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
const Home = () => {
  const featuredJobs = [
    {
      id: 1,
      title: "Senior Real Estate Agent",
      company: "LuxeRealty",
      location: "Los Angeles, CA",
      salary: "$120k - $150k",
      type: "Full-time",
      image: Banner1,
    },
    {
      id: 2,
      title: "Property Manager",
      company: "Urban Home",
      location: "New York, NY",
      salary: "$85k - $110k",
      type: "On-site",
      image: Banner2,
    },
    {
      id: 3,
      title: "Mortgage Consultant",
      company: "FinanceKey",
      location: "Remote",
      salary: "$90k + Comm.",
      type: "Remote",
      image: Banner3,
    },
  ];
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-wrapper">
        <div className="container">
          <div className="row align-items-center">
            {/* LEFT CONTENT */}
            <div className="col-lg-5 hero-left">
              <h1>
                Discover the <br />
                <span>Perfect Career</span> <br />
                in Real Estate
              </h1>

              <p>
                Explore verified real-estate job opportunities that match your
                skills, experience, and career goals.
              </p>

              <div className="hero-actions">
                <button className="btn btn-dark px-4 py-2 rounded-pill">
                  View Listings
                </button>
                <button className="circle-btn">
                  <BsArrowRight />
                </button>
              </div>

              <div className="hero-stats">
                <div className="d-flex align-items-center gap-2">
                  <div className="d-flex">
                    {/* Fake avatars */}
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#ccc', border: '2px solid white' }}></div>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#888', border: '2px solid white', marginLeft: -10 }}></div>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#555', border: '2px solid white', marginLeft: -10 }}></div>
                  </div>
                  <div>
                    <strong>1000+</strong>
                    <span style={{ fontSize: 12 }}>Jobs Posted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT CAROUSEL WITH FLOATING CARDS */}
            <div className="col-lg-7 hero-right-wrapper">

              {/* Floating Card 1: Matches "Video Tour" */}
              <div className="floating-card fc-1" style={{ cursor: "pointer" }} onClick={() => setIsVideoOpen(true)}>
                <div className="play-button">
                  <BsPlayFill size={20} />
                </div>
                <div className="float-card-Content">
                  <h5>Office Tour</h5>
                  <p>Watch Video</p>
                </div>
              </div>

              {/* Floating Card 2: Matches "Get Amount" - adapted for Salary */}
              <div className="floating-card fc-2">
                <div className="d-flex align-items-center justify-content-center"
                  style={{ width: 40, height: 40, background: '#e0f2fe', borderRadius: '50%', color: '#0284c7' }}>
                  <MdWorkOutline size={20} />
                </div>
                <div className="float-card-Content">
                  <h5>500+</h5>
                  <p>Daily Applications</p>
                </div>
              </div>

              {/* Floating Card 3: Matches "House Value" - adapted for Rating */}
              <div className="floating-card fc-3">
                <div className="d-flex align-items-center justify-content-center"
                  style={{ width: 40, height: 40, background: '#dcfce7', borderRadius: '50%', color: '#166534' }}>
                  <BsShieldCheck size={20} />
                </div>
                <div className="float-card-Content">
                  <h5>Verified</h5>
                  <p>Companies Only</p>
                </div>
              </div>

              <div
                id="realEstateCarousel"
                className="carousel slide hero-carousel"
                data-bs-ride="carousel"
              >
                <div className="carousel-inner">
                  {[Banner1, Banner2, Banner3, Banner4, Banner5, Banner6].map(
                    (img, index) => (
                      <div
                        className={`carousel-item ${index === 0 ? "active" : ""}`}
                        key={index}
                      >
                        <img src={img} className="d-block w-100" alt="banner" />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED JOBS SECTION (Matching "Featured Property") */}
      <section className="container py-5" style={{ marginTop: '40px' }}>
        <div className="section-eyebrow">
          <BsStars color="#dc2626" size={20} />
          <span>TOP OPPORTUNITIES</span>
        </div>

        <div className="d-flex justify-content-between align-items-end mb-5">
          <h2 className="fw-bold m-0" style={{ fontSize: '36px', color: '#111' }}>Featured Jobs</h2>
          <a href="#" className="text-dark fw-bold text-decoration-none">View All Opportunities &rarr;</a>
        </div>

        <div className="row">
          {featuredJobs.map((job) => (
            <div className="col-lg-4 mb-4" key={job.id}>
              <div className="featured-card">
                <div className="featured-img-box">
                  <img src={job.image} alt={job.title} />
                  <div className="f-badges">
                    <span className="f-badge"><MdOutlineVilla /> {job.type}</span>
                    <span className="f-badge"><MdVerified color="#dc2626" /> Verified</span>
                  </div>
                </div>
                <div className="featured-content">
                  <span className="featured-price">{job.salary}</span>
                  <h4 className="featured-title">{job.title}</h4>
                  <p className="featured-desc">{job.company} • {job.location}</p>

                  <hr style={{ opacity: 0.1, margin: '15px 0' }} />

                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-2 text-muted" style={{ fontSize: 13 }}>
                      <span><FaUserTie /> Expert</span>
                      <span><FaBuilding /> Office</span>
                    </div>
                    <button className="btn btn-sm btn-outline-dark rounded-pill px-3">Apply</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT / WHY CHOOSE US (Matching "About Us") */}
      <section className="container py-5 mb-5">
        <div className="row">
          <div className="col-lg-6 mb-4">
            <div className="section-eyebrow">
              <MdVerified color="#dc2626" size={20} />
              <span>WHO WE ARE</span>
            </div>
            <h2 className="fw-bold mb-4" style={{ fontSize: '42px', color: '#111', lineHeight: 1.2 }}>
              We help you find the <span style={{ fontStyle: 'italic', fontFamily: 'serif', color: '#dc2626' }}>perfect</span> job to build your career.
            </h2>
            <p className="text-secondary" style={{ maxWidth: '500px', fontSize: '16px' }}>
              We believe that finding a job in real estate should be an enjoyable and stress-free experience. Our platform connects dedicated professionals with top agencies.
            </p>
          </div>

          <div className="col-lg-6">
            <div className="row g-4">
              <div className="col-md-6">
                <div className="why-card">
                  <div className="why-icon" style={{ color: '#dc2626' }}><BsStars /></div>
                  <h5 className="why-title">Experienced</h5>
                  <p className="why-desc">Over 10 years of experience connecting professionals with the best opportunities in the market.</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="why-card">
                  <div className="why-icon" style={{ color: '#dc2626' }}><BsPeopleFill /></div>
                  <h5 className="why-title">Extensive Network</h5>
                  <p className="why-desc">We have a wide network that includes the best agencies and companies across the country.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isVideoOpen && (
            <motion.div
              className="video-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="video-modal"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  className="close-btn"
                  onClick={() => setIsVideoOpen(false)}
                >
                  ✖
                </button>

                <video
                  src="/realestate-video.mp4"   // or Cloudinary link
                  controls
                  autoPlay
                  style={{ width: "100%", borderRadius: "15px" }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </section>
    </>
  );
};

export default Home;
