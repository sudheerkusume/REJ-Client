import api from "../config/api";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

const Jobs = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/jobCategories")
      .then((res) => {
        const grouped = res.data.reduce((acc, job) => {
          if (!acc[job.category]) {
            acc[job.category] = {
              category: job.category,
              image: job.image,
              count: 0
            };
          }
          acc[job.category].count += 1;
          return acc;
        }, {})
        setCategories(Object.values(grouped));
      });
  }, []);

  return (
    <section className="container py-5">
      <div className="rooms-section mt-5">
        {/* Heading */}
        <div className="text-center mb-5" data-aos="fade-up">
          <h6 className="text-muted text-uppercase">Career Opportunities</h6>
          <h2 className="animated-marker">
            Our Jobs
            <svg
              className="svg-marker"
              viewBox="0 0 201 14"
              preserveAspectRatio="none"
            >
              <path
                d="M3 10.5732c55.565 6.61382 168.107 -0.117058 197.753 4.63415"
                stroke="#e63946"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </h2>
        </div>
        {/* Cards */}
        <div className="container p-4 ">
          <div className="row justify-content-center">
            {categories.slice(0, 8).map((cat, index) => (
              <div
                className=" col-md-3 col-sm-6 mb-4 "
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 70}
              >
                <div className="room-card job-card text-center mb-3">
                  <div className="job-icon-wrapper">
                    <img
                      src={cat.image || "/job-icons/default-job.png"}
                      alt={cat.category}
                      className="job-icon"
                    />
                  </div>
                  <div className="card-body py-3">
                    <h6 className="room-title mb-1">{cat.category}</h6>
                    <p className="text-muted small mb-0">
                      {cat.tagline || "Join our growing team"}
                    </p>
                    <p className="small text-muted"> {cat.count} jobs </p>
                    <Link
                      to={`/jobs/category/${encodeURIComponent(cat.category)}`}
                      className="btn-book-now"
                    >
                      View Job
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Load More */}
        <div className="text-center ">
          <button
            className="btn btn-load-more"
            onClick={() => navigate("/jobs")}
          >
            View All Jobs <IoIosArrowForward className="ms-2" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Jobs;
