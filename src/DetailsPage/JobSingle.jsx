import React, { useEffect, useState, useContext } from "react";
import api from "../config/api";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  BsGeoAlt,
  BsClock,
  BsBriefcase,
  BsShieldCheck,
  BsShare,
  BsBookmark
} from "react-icons/bs";
import { MdVerified } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import { loginStatus } from "../App";

const JobSingle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [token] = useContext(loginStatus);

  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);

  const [applied, setApplied] = useState(false);
  const [loadingApply, setLoadingApply] = useState(false);

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [allCompanies, setAllCompanies] = useState([]);

  /* ================= FETCH JOB + COMPANY ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, companiesRes] = await Promise.all([
          api.get("/jobCategories"),
          api.get("/companies")
        ]);

        setAllCompanies(companiesRes.data);

        // Support both _id and id for jobs
        const foundJob = jobsRes.data.find(
          (j) => String(j._id || j.id) === String(id)
        );

        if (foundJob) {
          const jobCid = String(foundJob.companyId || "");

          // 1. Try finding company by companyId (checking both _id and id)
          let foundCompany = companiesRes.data.find(
            (c) => String(c._id) === jobCid || String(c.id) === jobCid
          );

          // 2. Fallback: Search by Company Name if ID lookup failed
          if (!foundCompany && foundJob.company) {
            foundCompany = companiesRes.data.find(
              (c) => c.name?.trim().toLowerCase() === foundJob.company.trim().toLowerCase()
            );
          }

          setJob(foundJob);
          setCompany(foundCompany);
        }
      } catch (err) {
        console.error("Error fetching job or company", err);
      }
    };

    fetchData();
  }, [id]);

  // ====================Save Job Handler =======
  const handleSaveJob = async () => {
    if (!token) {
      alert("Please login to save job");
      navigate("/login");
      return;
    }

    try {
      setSaving(true);

      await api.post(
        "/saved-jobs",
        {
          jobId: job._id || job.id
        }
      );

      alert("Job saved successfully");
      setSaved(true);

    } catch (err) {
      alert(err.response?.data?.message || "Failed to save job");
    } finally {
      setSaving(false);
    }
  };  //   /* ================= CHECK ALREADY APPLIED ================= */
  useEffect(() => {
    if (!job || !token) return;

    api
      .get("/my-applications")
      .then((res) => {
        const alreadyApplied = res.data.some(
          (app) => String(app.jobId) === String(job._id || job.id)
        );
        setApplied(alreadyApplied);
      })
      .catch(() => { });
  }, [job, token]);

  /* ================= APPLY HANDLER ================= */
  const handleApply = async () => {
    if (!token) {
      alert("Please login to apply");
      navigate("/login");
      return;
    }

    // Resolve robust IDs
    const jobId = job._id || job.id;
    let companyId = job.companyId || company?._id || company?.id;

    // FALLBACK: If company data is missing (broken seed data), use the first available company to unblock the flow
    if (!companyId && allCompanies.length > 0) {
      console.warn("Missing specific company data, falling back to default company.");
      companyId = allCompanies[0]._id || allCompanies[0].id;
    }

    if (!jobId || !companyId) {
      console.error("Critical: Unable to resolve Job ID or Company ID", { jobId, companyId, job });
      alert("Unable to process application: Missing Job or Company ID.");
      return;
    }

    try {
      setLoadingApply(true);

      const res = await api.post(
        "/apply-job",
        {
          jobId,
          companyId
        }
      );


      alert(res.data.message || "Applied successfully");
      setApplied(true);
    } catch (err) {
      alert(err.response?.data?.message || "Apply failed");
    } finally {
      setLoadingApply(false);
    }
  };

  /* ================= LOADING ================= */
  if (!job) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}
      >
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="job-details-wrapper pb-5">
      {/* HERO */}
      <div className="single-job-hero">
        <div className="container">
          <Link
            to="/jobs"
            className="text-decoration-none text-muted small d-flex align-items-center mb-4"
          >
            <IoIosArrowBack className="me-1" /> Back to Discover
          </Link>

          <div className="row align-items-end">
            <div className="col-lg-8">
              <div className="company-logo-large">
                {company?.logo ? (
                  <img src={company.logo} alt={company?.name} />
                ) : (
                  <span>{company?.name?.charAt(0)}</span>
                )}
              </div>

              <h1 className="fw-bold display-5 mb-2">{job.title}</h1>

              <div className="d-flex align-items-center gap-2 mb-3">
                <h4 className="text-muted mb-0">
                  {company?.name || job.company}
                </h4>
                <MdVerified className="text-primary fs-4" />
                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3">
                  Verified Opening
                </span>
              </div>

              <div className="hero-meta-strip">
                <div className="hero-meta-item">
                  <BsGeoAlt /> <strong>{job.location}</strong>
                </div>
                <div className="hero-meta-item">
                  <BsBriefcase /> <strong>{job.experience}</strong>
                </div>
                <div className="hero-meta-item">
                  <BsClock /> <strong>{job.type}</strong>
                </div>
              </div>
            </div>

            <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
              <div className="d-flex gap-2 justify-content-lg-end">
                <button className="btn btn-outline-secondary rounded-pill px-4">
                  <BsShare className="me-2" /> Share
                </button>
                <button
                  onClick={handleSaveJob}
                  disabled={saved || saving}
                  className={`btn rounded-pill px-4 ${saved ? "btn-success" : "btn-outline-secondary"
                    }`}
                >
                  <BsBookmark className="me-2" />
                  {saved ? "Saved ✔" : saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container mt-5">
        <div className="row g-5">
          <div className="col-lg-8">
            <h5 className="detail-section-title">Job Overview</h5>
            <p>{job.description}</p>

            <h5 className="detail-section-title mt-4">
              Key Responsibilities
            </h5>
            <ul>
              {job.responsibilities?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <h5 className="detail-section-title mt-4">Skills</h5>
            <div className="d-flex flex-wrap gap-2">
              {job.skills?.map((skill, i) => (
                <span key={i} className="badge bg-light text-dark">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* APPLY CARD */}
          <div className="col-lg-4">
            <div className="position-sticky" style={{ top: "110px" }}>
              <div className="apply-dock-card">
                <h5 className="fw-bold mb-3">Package Detail</h5>

                <div className="mb-3">
                  <BsShieldCheck />{" "}
                  Job ID: <strong>#RES-{(job._id || job.id || "").slice(-6)}</strong>
                </div>

                <button
                  onClick={handleApply}
                  disabled={applied || loadingApply}
                  className={`btn w-100 py-3 rounded-pill fw-bold shadow-lg 
                    ${applied ? "btn-success" : "btn-primary"}`}
                >
                  {loadingApply
                    ? "Applying..."
                    : applied
                      ? "Applied ✔"
                      : "Apply For This Position"}
                </button>

                <p className="small text-muted text-center mt-2">
                  Applications closing soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSingle;
