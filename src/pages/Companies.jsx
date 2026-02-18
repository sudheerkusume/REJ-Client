// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { BsBookmark, BsGeoAlt } from "react-icons/bs";
// import video from '../Accets/video.mp4'

// const Companies = () => {
//   const [companies, setCompanies] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:4000/companies")
//       .then(res => setCompanies(res.data))
//       .catch(err => console.log(err));
//   }, []);

//   return (
//     <section className="companies-section pt-0">
//       {/* Video Hero - Full Width or Inset depending on preference, here moved outside container */}
//       <div className="companies-video-hero-wrapper px-md-4">
//         <div className="companies-video-hero">
//           <video
//             className="hero-video"
//             autoPlay
//             muted
//             loop
//             playsInline
//           >
//             <source src={video} type="video/mp4" />
//           </video>

//           <div className="hero-overlay"></div>

//           <div className="hero-content">
//             <h1 className="hero-script">Real Estate</h1>
//             <h2 className="hero-title">TOP COMPANIES</h2>

//             <p className="hero-subtitle">
//               Discover trusted employers shaping the real estate industry.
//             </p>

//             <div className="hero-actions">
//               <button className="hero-btn light">View Companies</button>
//               <button className="hero-btn dark">Post a Job</button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container mt-5">
//         {/* Cards */}
//         <div className="row g-4 justify-content-center">
//           {companies.map((company) => (
//             <div className="col-md-6 col-lg-4" key={company.id}>
//               <div className="company-job-card">

//                 {/* Header: Logo & Save */}
//                 <div className="card-top">
//                   <div className="logo-wrapper">
//                     <img
//                       src={company.logo || "https://placehold.co/60x60/png"}
//                       alt={company.name}
//                       className="company-logo"
//                     />
//                   </div>
//                   <button className="save-btn">
//                     Save <BsBookmark className="ms-1" />
//                   </button>
//                 </div>

//                 {/* Body */}
//                 <div className="card-body-content">
//                   <div className="company-info-row">
//                     <span className="company-name">{company.name}</span>
//                     <span className="time-ago">5 days ago</span>
//                   </div>

//                   <h4 className="industry-title">{company.industry}</h4>

//                   <div className="tag-row">
//                     <span className="tag">Full-Time</span>
//                     <span className="tag">Real Estate</span>
//                   </div>
//                 </div>

//                 <div className="card-divider"></div>

//                 {/* Footer */}
//                 <div className="card-footer">
//                   <div className="footer-left">
//                     <span className="jobs-count">
//                       {company.totalJobs || 0} Open Jobs
//                     </span>
//                     <div className="location">
//                       {company.location || "India"}
//                     </div>
//                   </div>

//                   <Link
//                     to={`/companies/${company.id}`}
//                     className="apply-btn"
//                   >
//                     Know more
//                   </Link>
//                 </div>

//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Companies;
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsBookmark, BsGeoAlt, BsGlobe, BsBuilding } from "react-icons/bs";
import video from '../Accets/video.mp4';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://rej-server.onrender.com/companies")
      .then(res => setCompanies(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-danger" role="status" />
        <p className="mt-3">Loading companies...</p>
      </div>
    );
  }

  return (
    <section className="companies-section pt-0">
      {/* Video Hero */}
      <div className="companies-video-hero-wrapper px-md-4">
        <div className="companies-video-hero">
          <video className="hero-video" autoPlay muted loop playsInline>
            <source src={video} type="video/mp4" />
          </video>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-script">Real Estate</h1>
            <h2 className="hero-title">TOP COMPANIES</h2>
            <p className="hero-subtitle">
              Discover trusted employers shaping the real estate industry.
            </p>
            <div className="hero-actions">
              <button className="hero-btn light">View Companies</button>
              <button className="hero-btn dark">Post a Job</button>
            </div>
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="container mt-5">
        <div className="row g-4 justify-content-center">
          {companies.map(company => (
            <div className="col-md-6 col-lg-4" key={company._id}>
              <div className="premium-company-card">
                {/* Popup Logo */}
                <div className="company-logo-popup">
                  <img
                    src={company.logo || "https://placehold.co/60x60/png"}
                    alt={company.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/60x60/png";
                    }}
                  />
                </div>

                {/* Header Section */}
                <div className="company-card-top-header">
                  <span className="company-name-elite">{company.name}</span>
                  <span className="company-industry-elite">{company.industry || "Real Estate"}</span>
                </div>

                {/* Detail List (Vertical) */}
                <div className="company-detail-list">
                  <div className="detail-row-modern">
                    <div className="detail-row-icon"><BsGeoAlt /></div>
                    <div className="detail-row-content">
                      <span className="detail-row-label">Location</span>
                      <span className="detail-row-value">{company.location || "Not specified"}</span>
                    </div>
                  </div>

                  <div className="detail-row-modern">
                    <div className="detail-row-icon"><BsGlobe /></div>
                    <div className="detail-row-content">
                      <span className="detail-row-label">Website</span>
                      <span className="detail-row-value">{company.website ? company.website.replace(/^https?:\/\/(www\.)?/, '') : "Not provided"}</span>
                    </div>
                  </div>

                  {/* <div className="detail-row-modern">
                    <div className="detail-row-icon"><BsBuilding /></div>
                    <div className="detail-row-content">
                      <span className="detail-row-label">Established</span>
                      <span className="detail-row-value">{company.established || "Not specified"}</span>
                    </div>
                  </div> */}
                </div>

                {/* Footer (Actions) */}
                <div className="company-card-action-bar">
                  <Link to={`/companies/${company._id}`} className="know-more-btn-modern">
                    Know More
                  </Link>
                  <div className="save-action-ghost" title="Save Company">
                    <BsBookmark />
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

export default Companies;
