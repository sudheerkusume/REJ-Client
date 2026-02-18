import React, { useEffect, useState } from "react";
import axios from "axios";

const AddJobs = ({ onJobAdded, onClose }) => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);

    const [job, setJob] = useState({
        companyId: "",
        company: "",
        category: "",
        image: "",
        image2: "",
        title: "",
        location: "",
        type: "",
        experience: "",
        salary: "",
        qualification: "",
        description: "",
        responsibilities: "",
        skills: ""
    });

    /* ================= FETCH COMPANIES ================= */
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get("https://rej-server.onrender.com/companies");
                setCompanies(res.data || []);
            } catch (err) {
                console.error("Company fetch error:", err);
            }
        };
        fetchCompanies();
    }, []);

    /* ================= INPUT HANDLER ================= */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setJob(prev => ({ ...prev, [name]: value }));
    };

    /* ================= SUBMIT ================= */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🔴 REQUIRED VALIDATION (IMPORTANT)
        if (!job.companyId) {
            alert("Please select a company");
            return;
        }
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
            await axios.post("https://rej-server.onrender.com/jobCategories", payload);
            alert("✅ Job added successfully");

            // Reset form
            setJob({
                companyId: "",
                company: "",
                category: "",
                image: "",
                image2: "",
                title: "",
                location: "",
                type: "",
                experience: "",
                salary: "",
                qualification: "",
                description: "",
                responsibilities: "",
                skills: ""
            });

            // If opened from modal, notify parent & close
            if (onJobAdded) onJobAdded();
            if (onClose) onClose();
        } catch (err) {
            console.error("Add job error:", err.response?.data || err);
            alert(err.response?.data?.message || "❌ Failed to add job");
        } finally {
            setLoading(false);
        }
    };

    /* ================= UI ================= */
    return (
        <div className="animate-fade-in">
            <div className="dash-card">
                <div className="dash-section-title">
                    <span>Add New Job</span>
                </div>

                <form onSubmit={handleSubmit} className="premium-form-grid">

                    {/* COMPANY */}
                    <div>
                        <label className="small fw-bold text-muted">Company *</label>
                        <select
                            className="premium-input"
                            value={job.companyId}
                            onChange={(e) => {
                                const selected = companies.find(c => c._id === e.target.value);
                                setJob(prev => ({
                                    ...prev,
                                    companyId: e.target.value,
                                    company: selected?.name || ""
                                }));
                            }}
                            required
                        >
                            <option value="">Select Company</option>
                            {companies.map(c => (
                                <option key={c._id} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* CATEGORY */}
                    <div>
                        <label className="small fw-bold text-muted">Category</label>
                        <input
                            name="category"
                            value={job.category}
                            onChange={handleChange}
                            className="premium-input"
                            placeholder="Engineering, Design..."
                        />
                    </div>

                    {/* TITLE */}
                    <div className="full-width">
                        <label className="small fw-bold text-muted">Job Title *</label>
                        <input
                            name="title"
                            value={job.title}
                            onChange={handleChange}
                            className="premium-input"
                            placeholder="Senior Developer"
                            required
                        />
                    </div>

                    {/* LOCATION */}
                    <div>
                        <label className="small fw-bold text-muted">Location</label>
                        <input
                            name="location"
                            value={job.location}
                            onChange={handleChange}
                            className="premium-input"
                        />
                    </div>

                    {/* TYPE */}
                    <div>
                        <label className="small fw-bold text-muted">Job Type *</label>
                        <input
                            name="type"
                            value={job.type}
                            onChange={handleChange}
                            className="premium-input"
                            placeholder="Full Time / Remote"
                            required
                        />
                    </div>

                    {/* EXPERIENCE */}
                    <div>
                        <label className="small fw-bold text-muted">Experience</label>
                        <input
                            name="experience"
                            value={job.experience}
                            onChange={handleChange}
                            className="premium-input"
                        />
                    </div>

                    {/* SALARY */}
                    <div>
                        <label className="small fw-bold text-muted">Salary</label>
                        <input
                            name="salary"
                            value={job.salary}
                            onChange={handleChange}
                            className="premium-input"
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
                        />
                    </div>

                    {/* ICON IMAGE */}
                    <div className="full-width">
                        <label className="small fw-bold text-muted">Icon Image URL</label>
                        <input
                            name="image"
                            value={job.image}
                            onChange={handleChange}
                            className="premium-input"
                        />
                    </div>

                    {/* BANNER IMAGE */}
                    <div className="full-width">
                        <label className="small fw-bold text-muted">Banner Image URL</label>
                        <input
                            name="image2"
                            value={job.image2}
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
                        />
                    </div>

                    {/* RESPONSIBILITIES */}
                    <div className="full-width">
                        <label className="small fw-bold text-muted">Responsibilities (comma separated)</label>
                        <input
                            name="responsibilities"
                            value={job.responsibilities}
                            onChange={handleChange}
                            className="premium-input"
                        />
                    </div>

                    {/* SKILLS */}
                    <div className="full-width">
                        <label className="small fw-bold text-muted">Skills (comma separated)</label>
                        <input
                            name="skills"
                            value={job.skills}
                            onChange={handleChange}
                            className="premium-input"
                        />
                    </div>

                    <div className="full-width mt-3 d-flex gap-3">
                        {onClose && (
                            <button type="button" className="premium-btn w-50" onClick={onClose}
                                style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
                                Cancel
                            </button>
                        )}
                        <button className="premium-btn w-100" disabled={loading}>
                            {loading ? "Publishing..." : "✨ Publish Job Posting"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddJobs;
