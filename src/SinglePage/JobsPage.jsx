import api from "../config/api";
import { formatSalary } from "../utils/formatSalary";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowForward, IoIosArrowDown, } from "react-icons/io";
import { IoFilter, IoClose } from "react-icons/io5";
import { BsGeoAlt, BsBuilding, BsClock, BsCash, BsBriefcase, BsLayoutTextWindowReverse, BsSearch } from "react-icons/bs";
import { MdVerified } from "react-icons/md";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [openSections, setOpenSections] = useState({});
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    Location: [],
    Company: [],
    JobType: [],
    Experience: [],
  });

  const [selectedFilters, setSelectedFilters] = useState({
    Location: [],
    Company: [],
    JobType: [],
    Experience: [],
  });

  useEffect(() => {
    api
      .get("/jobCategories")
      .then((res) => {
        setJobs(res.data);

        const newFilters = {
          Location: [...new Set(res.data.map((j) => j.location))],
          Company: [...new Set(res.data.map((j) => j.company))],
          JobType: [...new Set(res.data.map((j) => j.type))],
          Experience: [...new Set(res.data.map((j) => j.experience))],
        };

        setFilters(newFilters);

        const defaultOpen = {};
        Object.keys(newFilters).forEach((key) => (defaultOpen[key] = true));
        setOpenSections(defaultOpen);
      })
      .catch((err) => console.log(err));
  }, []);

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFilterChange = (type, value) => {
    setSelectedFilters((prev) => {
      const updated = prev[type].includes(value)
        ? prev[type].filter((v) => v !== value)
        : [...prev[type], value];

      return { ...prev, [type]: updated };
    });
  };

  const applyFilters = (job) => {
    const title = job.title || "";
    const company = job.company || "";
    const location = job.location || "";

    const matchesSearch =
      searchTerm === "" ||
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      matchesSearch &&
      (selectedFilters.Location.length === 0 ||
        selectedFilters.Location.includes(job.location)) &&
      (selectedFilters.Company.length === 0 ||
        selectedFilters.Company.includes(job.company)) &&
      (selectedFilters.JobType.length === 0 ||
        selectedFilters.JobType.includes(job.type)) &&
      (selectedFilters.Experience.length === 0 ||
        selectedFilters.Experience.includes(job.experience))
    );
  };

  const filteredJobs = jobs.filter(applyFilters);

  return (
    <div className="listing-hub-container">
      <div className="container">
        {/* ENHANCED SEARCH HERO SECTION */}
        <div className="listing-hero-v2" data-aos="fade-down">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <h1 className="fw-light mb-1">Explore <strong>Elite Roles</strong></h1>
              <p className="text-muted small mb-4">India's most prestigious developer network is hiring now.</p>

              <div className="search-bar-rounded mb-3">
                <BsSearch className="text-muted" />
                <input
                  type="text"
                  placeholder="Search job titles, companies, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="d-flex flex-wrap gap-2">
                <div className="listing-stat-pill">
                  <strong>{jobs.length}</strong> Total Roles
                </div>
                <div className="listing-stat-pill">
                  <div style={{ width: 6, height: 6, background: '#10b981', borderRadius: '50%' }}></div>
                  <strong>Active</strong> Hiring
                </div>
              </div>
            </div>

            <div className="col-lg-5 mt-4 mt-lg-0">
              <div className="ps-0 ps-lg-4">
                <p className="small fw-bold text-uppercase letter-spacing-1 text-muted mb-3">Trusted Partners</p>
                <div className="trusted-strip-v2">
                  <span className="company-logo-text">ALPHA</span>
                  <span className="company-logo-text">LUXE</span>
                  <span className="company-logo-text">HORIZON</span>
                  <span className="company-logo-text">PRESTIGE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Sidebar Filters */}
          <div className={`col-lg-3 ${mobileFilterOpen ? 'active' : ''} filter-glass-sidebar`}>
            <div className="d-flex justify-content-between align-items-center d-lg-none mb-4">
              <h5 className="m-0">Filters</h5>
              <button className="btn btn-light rounded-circle p-2" onClick={() => setMobileFilterOpen(false)}>
                <IoClose size={24} />
              </button>
            </div>

            {Object.entries(filters).map(([filterType, values]) => (
              <div key={filterType} className="mb-4 border-bottom pb-4 last-child-no-border">
                <div
                  className="filter-section-title cursor-poPoppins"
                  onClick={() => toggleSection(filterType)}
                >
                  {filterType.replace(/([A-Z])/g, " $1")}
                  {openSections[filterType] ? <IoIosArrowDown /> : <IoIosArrowForward />}
                </div>

                <div
                  style={{
                    maxHeight: openSections[filterType] ? "400px" : "0",
                    overflow: "hidden",
                    transition: "0.4s ease",
                  }}
                >
                  <div className="mt-2">
                    {values.map((value, index) => (
                      <label key={`${filterType}-${value}`} className="lux-checkbox-item">
                        <input
                          type="checkbox"
                          checked={selectedFilters[filterType]?.includes(value)}
                          onChange={() => handleFilterChange(filterType, value)}
                        />
                        <span>{value}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <button className="btn btn-outline-danger w-100 rounded-pill mt-3 d-lg-none" onClick={() => setMobileFilterOpen(false)}>
              Apply Filters
            </button>
          </div>

          {/* Job Listings Area */}
          <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="small text-muted">Found <strong>{filteredJobs.length}</strong> matches for your search</div>
              <div className="d-lg-none">
                <button className="btn btn-dark btn-sm rounded-pill px-4" onClick={() => setMobileFilterOpen(true)}>
                  <IoFilter className="me-2" /> Filters
                </button>
              </div>
            </div>

            <div className="row g-4">
              {filteredJobs.map((job, index) => (
                <div className="col-md-6" key={job._id || index} data-aos="fade-up" data-aos-delay={index * 50}>
                  <Link to={`/jobs/${job._id}`} className="text-decoration-none">
                    <div className="lux-listing-card">
                      <div className="lux-card-top">
                        <div className="company-logo-mini">
                          {job.logo ? (
                            <img src={job.logo} alt={job.company || "Company"} />
                          ) : (
                            <span>{job.company?.charAt(0) || "C"}</span>
                          )}
                        </div>
                        {index % 4 === 0 ? (
                          <span className="lux-badge-urgent">Urgent</span>
                        ) : (
                          <span className="lux-badge-new">Hiring Now</span>
                        )}
                      </div>

                      <h3 className="lux-job-title">{job.title}</h3>

                      <div className="lux-company-name mb-3">
                        <MdVerified className="text-primary opacity-75" />
                        <span className="fw-bold">{job.company}</span>
                      </div>

                      <div className="lux-meta-grid mb-4">
                        <div className="lux-meta-item">
                          <BsGeoAlt size={16} />
                          {job.location}
                        </div>
                        <div className="lux-meta-item">
                          <BsClock size={16} />
                          {job.type}
                        </div>
                        <div className="lux-meta-item">
                          <BsBriefcase size={16} />
                          {job.experience}
                        </div>
                        <div className="lux-meta-item">
                          <BsLayoutTextWindowReverse size={16} />
                          Ref: #{2024 + index}
                        </div>
                      </div>

                      {/* Preferred Areas Tags */}
                      {job.preferredAreas?.length > 0 && (
                        <div className="d-flex flex-wrap gap-1 mb-3">
                          {job.preferredAreas.slice(0, 3).map((area, i) => (
                            <span key={i} className="badge rounded-pill"
                              style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '10px', fontWeight: 600, padding: '4px 10px' }}>
                              📍 {area}
                            </span>
                          ))}
                          {job.preferredAreas.length > 3 && (
                            <span className="badge rounded-pill"
                              style={{ background: '#f1f5f9', color: '#64748b', fontSize: '10px', fontWeight: 600, padding: '4px 10px' }}>
                              +{job.preferredAreas.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      <div className="lux-card-footer border-top pt-3 mt-auto">
                        <div className="lux-salary d-flex flex-column">
                          <span className="small text-muted fw-normal">Package</span>
                          <span>{formatSalary(job.salary)}</span>
                        </div>
                        <button className="btn-apply-lux">View Job Details</button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}

              {filteredJobs.length === 0 && (
                <div className="col-12 text-center py-5 bg-white rounded-5 shadow-sm border">
                  <BsSearch size={50} className="text-muted opacity-25 mb-4" />
                  <h3 className="fw-light">No exact matches found</h3>
                  <p className="text-muted mx-auto mb-4" style={{ maxWidth: '400px' }}>We couldn't find any roles matching your current filters. Try broadening your search.</p>
                  <button
                    className="btn btn-dark rounded-pill px-5 py-2 fw-bold"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedFilters({ Location: [], Company: [], JobType: [], Experience: [] })
                    }}
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
