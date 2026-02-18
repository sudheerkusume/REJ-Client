import React, { useState } from "react";
import axios from "axios";
import "../DashboardStyles.css";

const AddJob = () => {
    const token = localStorage.getItem("recruiterToken");
    const [loading, setLoading] = useState(false);

    const [job, setJob] = useState({
        category: "",
        image: "https://cdn-icons-png.flaticon.com/512/2910/2910760.png", // Default icon
        image2: "https://img.freepik.com/free-vector/modern-business-buildings-background_23-2148151525.jpg", // Default banner
        title: "",
        location: "",
        type: "Full Time",
        experience: "",
        salary: "",
        qualification: "",
        description: "",
        responsibilities: "",
        skills: ""
    });

    /* ================= INPUT HANDLER ================= */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setJob(prev => ({ ...prev, [name]: value }));
    };

    /* ================= SUBMIT ================= */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!job.title || !job.type) {
            alert("Job title and job type are required");
            return;
        }

        const payload = {
            ...job,
            responsibilities: job.responsibilities
                ? job.responsibilities.split(",").map(i => i.trim()).filter(Boolean)
                : [],
            skills: job.skills
                ? job.skills.split(",").map(i => i.trim()).filter(Boolean)
                : []
        };

        try {
            setLoading(true);
            await axios.post("https://rej-server.onrender.com/recruiter/jobs", payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert("✅ Job posted successfully!");

            // Reset form
            setJob({
                category: "",
                image: "https://cdn-icons-png.flaticon.com/512/2910/2910760.png",
                image2: "https://img.freepik.com/free-vector/modern-business-buildings-background_23-2148151525.jpg",
                title: "",
                location: "",
                type: "Full Time",
                experience: "",
                salary: "",
                qualification: "",
                description: "",
                responsibilities: "",
                skills: ""
            });
        } catch (err) {
            console.error("Add job error:", err.response?.data || err);
            alert(err.response?.data?.message || "❌ Failed to post job");
        } finally {
            setLoading(false);
        }
    };

    /* ================= UI ================= */
    return (
        <div className="animate-fade-in">
            <div className="dash-card">
                <div className="dash-section-title">
                    <span>Create New Job Posting</span>
                </div>

                <form onSubmit={handleSubmit} className="premium-form-grid">

                    {/* TITLE */}
                    <div className="full-width">
                        <label className="small fw-bold text-muted">Job Title *</label>
                        <input
                            name="title"
                            value={job.title}
                            onChange={handleChange}
                            className="premium-input"
                            placeholder="e.g. Senior Real Estate Consultant"
                            required
                        />
                    </div>

                    {/* CATEGORY */}
                    <div>
                        <label className="small fw-bold text-muted">Category</label>
                        <input
                            name="category"
                            value={job.category}
                            onChange={handleChange}
                            className="premium-input"
                            placeholder="Residential, Commercial, etc."
                        />
                    </div>

                    {/* TYPE */}
                    <div>
                        <label className="small fw-bold text-muted">Job Type *</label>
                        <select
                            name="type"
                            value={job.type}
                            onChange={handleChange}
                            className="premium-input"
                            required
                        >
                            <option value="Full Time">Full Time</option>
                            <option value="Part Time">Part Time</option>
                            <option value="Remote">Remote</option>
                            <option value="Contract">Contract</option>
                        </select>
                    </div>

                    {/* LOCATION */}
                    <div>
                        <label className="small fw-bold text-muted">Location</label>
                        <input
                            name="location"
                            value={job.location}
                            onChange={handleChange}
                            className="premium-input"
                            placeholder="City, Country"
                        />
                    </div>

                    {/* EXPERIENCE */}
                    <div>
                        <label className="small fw-bold text-muted">Experience Required</label>
                        <input
                            name="experience"
                            value={job.experience}
                            onChange={handleChange}
                            className="premium-input"
                            placeholder="e.g. 2-5 Years"
                        />
                    </div>

                    {/* SALARY */}
                    <div>
                        <label className="small fw-bold text-muted">Offered Salary</label>
                        <input
                            name="salary"
                            value={job.salary}
                            onChange={handleChange}
                            className="premium-input"
                            placeholder="e.g. $50k - $80k"
                        />
                    </div>

                    {/* QUALIFICATION */}
                    <div>
                        <label className="small fw-bold text-muted">Qualification</label>
                        <input
                            name="qualification"
                            value={job.qualification}
                            onChange={handleChange}
                            className="premium-input"
                            placeholder="Degree/Certification"
                        />
                    </div>

                    {/* ICON IMAGE */}
                    <div className="full-width">
                        <label className="small fw-bold text-muted">Company Icon URL (Optional)</label>
                        <input
                            name="image"
                            value={job.image}
                            onChange={handleChange}
                            className="premium-input"
                        />
                    </div>

                    {/* DESCRIPTION */}
                    <div className="full-width">
                        <label className="small fw-bold text-muted">Job Description</label>
                        <textarea
                            name="description"
                            rows="4"
                            value={job.description}
                            onChange={handleChange}
                            className="premium-input"
                            placeholder="Describe the role and your company..."
                        />
                    </div>

                    {/* RESPONSIBILITIES */}
                    <div className="full-width">
                        <label className="small fw-bold text-muted">Key Responsibilities (comma separated)</label>
                        <input
                            name="responsibilities"
                            value={job.responsibilities}
                            onChange={handleChange}
                            className="premium-input"
                            placeholder="Goal setting, Client management, Reporting..."
                        />
                    </div>

                    {/* SKILLS */}
                    <div className="full-width">
                        <label className="small fw-bold text-muted">Required Skills (comma separated)</label>
                        <input
                            name="skills"
                            value={job.skills}
                            onChange={handleChange}
                            className="premium-input"
                            placeholder="Negotiation, CRM, Marketing..."
                        />
                    </div>

                    <div className="full-width mt-3">
                        <button className="premium-btn w-100" disabled={loading}>
                            {loading ? "Posting..." : "🚀 Publish Job Opportunity"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddJob;

