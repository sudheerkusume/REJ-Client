import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const JobsByCity = () => {
  const { cityName } = useParams();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get("https://rej-server.onrender.com/jobCategories").then((res) => {
      const filtered = res.data.filter(
        (job) =>
          job.location.toLowerCase() ===
          decodeURIComponent(cityName).toLowerCase()
      );
      setJobs(filtered);
    });
  }, [cityName]);

  return (
    <section className="jobs-page py-5" style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold display-6">Jobs in <span className="text-primary" style={{ borderBottom: '3px solid #00aa6c' }}>{decodeURIComponent(cityName)}</span></h2>
          <p className="text-muted mt-2">Explore the best opportunities in your city</p>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-5">
            <div className="mb-3" style={{ fontSize: 60 }}>🏙️</div>
            <h4 className="text-muted">No jobs available in this location yet.</h4>
            <Link to="/jobs" className="btn btn-primary mt-3 rounded-pill px-4">Browse All Jobs</Link>
          </div>
        ) : (
          <div className="row g-4">
            {jobs.map((job) => (
              <div key={job._id} className="col-lg-3 col-md-6 job-item-wrapper">
                <Link to={`/jobs/${job._id}`} className="text-decoration-none text-dark">
                  <div className="job-saas-card h-100">
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="bg-white rounded-circle shadow-sm p-2 d-flex align-items-center justify-content-center" style={{ width: 50, height: 50 }}>
                          <img src={job.image} alt={job.title} style={{ width: 30, height: 30, objectFit: 'contain' }}
                            onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/3004/3004038.png"} />
                        </div>
                        <span className="badge bg-white text-dark shadow-sm rounded-pill px-3 py-2 border">
                          {job.type || "Full Time"}
                        </span>
                      </div>

                      <h5 className="mb-1 text-truncate" title={job.title}>{job.title}</h5>
                      <p className="text-muted small mb-3">{job.company}</p>

                      <div className="job-tags mb-3">
                        <span>📍 {job.location}</span>
                        <span>💰 {job.salary || "N/A"}</span>
                      </div>
                    </div>

                    <div className="job-explore border-top pt-3">
                      <span>View Details</span>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default JobsByCity;
