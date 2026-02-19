import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiCheck, FiX, FiPlus, FiEye, FiTrash2 } from "react-icons/fi";

/* ─────── CONSTANTS ─────── */
const LOCATIONS = [
    "Hyderabad", "Bengaluru", "Mumbai", "Delhi NCR", "Chennai",
    "Kolkata", "Kochi", "Jaipur", "Ahmedabad", "Ayodhya", "Tirupati", "Shirdi"
];

const CATEGORIES = [
    "Tele Caller", "Channel Partners", "Real Estate Sales", "CRM Executive",
    "Digital Marketing", "HR & Operations", "Accounts & Auditing",
    "Legal", "Architects", "Web Development"
];

const QUALIFICATIONS = [
    "PhD", "Post Graduation", "Graduation", "Diploma",
    "12th / Intermediate", "10th / SSC", "Below 10th", "Others"
];

const EMPLOYMENT_TYPES = ["Full-time", "Part-time"];

const JOB_ROLE_TYPES = [
    { value: "", label: "Select an option" },
    { value: "Office Based", label: "Office Based" },
    { value: "Hybrid", label: "Hybrid" },
    { value: "Site Based", label: "Site Based" },
    { value: "Channel Sales", label: "Channel Sales" }
];

const EXPERIENCE_LEVELS = [
    { value: "", label: "Select an option" },
    { value: "Beginner (0-1 Year)", label: "Beginner (0-1 Year)" },
    { value: "1-3 Years", label: "1-3 Years" },
    { value: "3-5 Years", label: "3-5 Years" },
    { value: "5-7 Years", label: "5-7 Years" },
    { value: "7-10 Years", label: "7-10 Years" },
    { value: "10+ Years", label: "10+ Years" }
];

const COMMISSION_OPTIONS = [
    { value: "", label: "Select an option" },
    { value: "1-2%", label: "1-2%" },
    { value: "2-3%", label: "2-3%" },
    { value: "3-5%", label: "3-5%" },
    { value: "Performance Based", label: "Performance Based" }
];

const BENEFITS_OPTIONS = ["Performance Bonus", "PF", "Insurance", "Cell Phone Reimbursement"];

const SALES_TARGETS = [
    "50-60 calls per day",
    "1-3 site visits per week",
    "3-5 site visits per week"
];

const PROPERTY_TYPES = [
    "Residential", "Commercial", "Industrial",
    "Plots/Land", "Luxury Properties", "Affordable Housing"
];

const LANGUAGES = [
    { key: "english", label: "English" },
    { key: "hindi", label: "हिंदी" },
    { key: "telugu", label: "తెలుగు" },
    { key: "tamil", label: "தமிழ்" },
    { key: "kannada", label: "ಕನ್ನಡ" },
    { key: "malayalam", label: "മലയാളം" },
    { key: "marathi", label: "मराठी" },
    { key: "bengali", label: "বাংলা" },
    { key: "gujarati", label: "ગુજરાતી" },
    { key: "punjabi", label: "ਪੰਜਾਬੀ" },
    { key: "odia", label: "ଓଡ଼ିଆ" },
    { key: "urdu", label: "اردو" }
];

/* Auto-select languages based on location */
const LOCATION_LANGUAGES = {
    "Hyderabad": ["english", "hindi", "telugu"],
    "Bengaluru": ["english", "hindi", "kannada"],
    "Mumbai": ["english", "hindi", "marathi"],
    "Delhi NCR": ["english", "hindi"],
    "Chennai": ["english", "hindi", "tamil"],
    "Kolkata": ["english", "hindi", "bengali"],
    "Kochi": ["english", "hindi", "malayalam"],
    "Jaipur": ["english", "hindi"],
    "Ahmedabad": ["english", "hindi", "gujarati"],
    "Ayodhya": ["english", "hindi"],
    "Tirupati": ["english", "hindi", "telugu"],
    "Shirdi": ["english", "hindi", "marathi"]
};

/* Category-based skill suggestions */
const CATEGORY_SKILLS = {
    'Tele Caller': [
        'Communication Skills', 'Telephone Etiquette', 'Cold Calling',
        'Lead Generation', 'Customer Service', 'Persistence',
        'Time Management', 'Sales Techniques', 'CRM Software', 'Follow-up Skills'
    ],
    'Channel Partners': [
        'Networking', 'Relationship Building', 'Sales Strategy',
        'Market Analysis', 'Negotiation', 'Client Management',
        'Revenue Growth', 'Presentation Skills'
    ],
    'Real Estate Sales': [
        'Property Knowledge', 'Client Relationship', 'Negotiation',
        'Market Research', 'Sales Closing', 'Site Visits',
        'Documentation', 'Follow-up Skills'
    ],
    'CRM Executive': [
        'CRM Software', 'Data Entry', 'Client Communication',
        'Report Generation', 'Lead Management', 'Follow-up Skills',
        'Excel', 'Data Analysis'
    ],
    'Digital Marketing': [
        'SEO', 'Social Media', 'Google Ads', 'Content Writing',
        'Analytics', 'Email Marketing', 'Lead Generation', 'Canva'
    ],
    'HR & Operations': [
        'Recruitment', 'Employee Relations', 'Payroll', 'Compliance',
        'Training', 'Communication', 'MS Office', 'Policy Making'
    ],
    'default': [
        'Communication', 'Sales', 'CRM', 'Excel', 'Negotiation',
        'Presentation', 'Team Work', 'Problem Solving'
    ]
};


/* ═══════════════════════════════════════════════════ */
/*                    ADD JOBS COMPONENT               */
/* ═══════════════════════════════════════════════════ */
const AddJobs = ({ onJobAdded, onClose }) => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [skillInput, setSkillInput] = useState("");

    const [form, setForm] = useState({
        companyId: "",
        company: "",
        category: "",
        title: "",
        location: "",
        salary: "",
        type: "Full-time",
        jobRoleType: "",
        experience: "",
        qualification: [],
        skills: [],
        description: "",
        responsibilities: [],
        commission: "",
        incentives: "",
        salesTargets: "",
        benefits: [],
        languages: [],
        propertyTypes: [],
        image: "",
        image2: ""
    });

    /* ─── Fetch Companies ─── */
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

    /* ─── Auto-select languages on location change ─── */
    useEffect(() => {
        if (form.location && LOCATION_LANGUAGES[form.location]) {
            setForm(prev => ({ ...prev, languages: LOCATION_LANGUAGES[form.location] }));
        }
    }, [form.location]);

    /* ─── Get suggested skills based on category ─── */
    const suggestedSkills = CATEGORY_SKILLS[form.category] || CATEGORY_SKILLS['default'];

    /* ─── Handlers ─── */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const toggleArrayItem = (field, item) => {
        setForm(prev => ({
            ...prev,
            [field]: prev[field].includes(item)
                ? prev[field].filter(i => i !== item)
                : [...prev[field], item]
        }));
    };

    const addSkill = (skill) => {
        if (skill && !form.skills.includes(skill)) {
            setForm(prev => ({ ...prev, skills: [...prev.skills, skill] }));
        }
    };

    const removeSkill = (skill) => {
        setForm(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
    };

    const handleSkillInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (skillInput.trim()) {
                addSkill(skillInput.trim());
                setSkillInput("");
            }
        }
    };

    /* ─── Submit ─── */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.companyId) { alert("Please select a company"); return; }
        if (!form.title) { alert("Job title is required"); return; }
        if (!form.type) { alert("Employment type is required"); return; }

        /* Build payload mapping to backend schema fields */
        const payload = {
            companyId: form.companyId,
            company: form.company,
            category: form.category,
            title: form.title,
            location: form.location,
            salary: form.salary + (form.commission ? ` | Commission: ${form.commission}` : '') + (form.incentives ? ` | Incentives: ${form.incentives}` : ''),
            image: form.image,
            image2: form.image2,
            description: form.description,
            responsibilities: form.responsibilities,
            skills: form.skills,
            /* Extended fields — will be saved if schema supports them */
            type: form.type,
            jobRoleType: form.jobRoleType,
            experience: form.experience,
            qualification: form.qualification.join(', '),
            benefits: form.benefits,
            languages: form.languages,
            propertyTypes: form.propertyTypes,
            salesTargets: form.salesTargets
        };

        try {
            setLoading(true);
            await axios.post("https://rej-server.onrender.com/jobCategories", payload);
            alert("✅ Job created successfully!");

            // Reset
            setForm({
                companyId: "", company: "", category: "", title: "", location: "",
                salary: "", type: "Full-time", jobRoleType: "", experience: "",
                qualification: [], skills: [], description: "", responsibilities: [],
                commission: "", incentives: "", salesTargets: "",
                benefits: [], languages: [], propertyTypes: [],
                image: "", image2: ""
            });
            setSkillInput("");

            if (onJobAdded) onJobAdded();
            if (onClose) onClose();
        } catch (err) {
            console.error("Add job error:", err.response?.data || err);
            alert(err.response?.data?.message || "❌ Failed to create job");
        } finally {
            setLoading(false);
        }
    };

    const handleDiscard = () => {
        if (window.confirm("Discard all changes?")) {
            setForm({
                companyId: "", company: "", category: "", title: "", location: "",
                salary: "", type: "Full-time", jobRoleType: "", experience: "",
                qualification: [], skills: [], description: "", responsibilities: [],
                commission: "", incentives: "", salesTargets: "",
                benefits: [], languages: [], propertyTypes: [],
                image: "", image2: ""
            });
            setSkillInput("");
        }
    };

    /* ═════════════ RENDER ═════════════ */
    return (
        <div className="aj-root">
            <form onSubmit={handleSubmit} className="aj-form">

                {/* ═══ COMPANY & CATEGORY ═══ */}
                <div className="aj-section">
                    <div className="aj-grid-2">
                        <div>
                            <label className="aj-label">Company *</label>
                            <select className="aj-select" value={form.companyId}
                                onChange={(e) => {
                                    const sel = companies.find(c => c._id === e.target.value);
                                    setForm(prev => ({ ...prev, companyId: e.target.value, company: sel?.name || "" }));
                                }} required>
                                <option value="">Select Company</option>
                                {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="aj-label">Category *</label>
                            <select className="aj-select" name="category" value={form.category} onChange={handleChange}>
                                <option value="">Select Category</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* ═══ JOB TITLE (highlighted) ═══ */}
                <div className="aj-highlight-box">
                    <div>
                        <label className="aj-label">Job Title *</label>
                        <input
                            className="aj-input"
                            name="title" value={form.title} onChange={handleChange}
                            placeholder="Enter job title" required
                        />
                    </div>
                </div>

                {/* ═══ LOCATION & SALARY ═══ */}
                <div className="aj-section">
                    <div className="aj-grid-2">
                        <div>
                            <label className="aj-label">Job Location *</label>
                            <select className="aj-select" name="location" value={form.location} onChange={handleChange} required>
                                <option value="">Select an option</option>
                                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="aj-label">Fixed Salary *</label>
                            <input className="aj-input" name="salary" value={form.salary} onChange={handleChange}
                                placeholder="e.g. ₹ 3 LPA, ₹ 25,000/month" required />
                        </div>
                    </div>
                </div>

                {/* ═══ JOB ROLE TYPE & EMPLOYMENT TYPE ═══ */}
                <div className="aj-section">
                    <div className="aj-grid-2">
                        <div>
                            <label className="aj-label">Job Role Type</label>
                            <select className="aj-select" name="jobRoleType" value={form.jobRoleType} onChange={handleChange}>
                                {JOB_ROLE_TYPES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="aj-label">Employment Type *</label>
                            <div className="aj-card-grid aj-card-grid-2">
                                {EMPLOYMENT_TYPES.map(t => (
                                    <div key={t}
                                        className={`aj-card-option ${form.type === t ? 'aj-card-selected' : ''}`}
                                        onClick={() => setForm(prev => ({ ...prev, type: t }))}
                                    >
                                        <span className="aj-card-label">{t}</span>
                                        {form.type === t && <FiCheck size={16} className="aj-card-check" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ EDUCATIONAL QUALIFICATION ═══ */}
                <div className="aj-section">
                    <label className="aj-label">Educational Qualification</label>
                    {/* Selected tags */}
                    {form.qualification.length > 0 && (
                        <div className="aj-tags-row">
                            {form.qualification.map(q => (
                                <span key={q} className="aj-tag aj-tag-green">
                                    {q}
                                    <button type="button" className="aj-tag-remove" onClick={() => toggleArrayItem('qualification', q)}>×</button>
                                </span>
                            ))}
                        </div>
                    )}
                    <div className="aj-card-grid aj-card-grid-4">
                        {QUALIFICATIONS.map(q => (
                            <div key={q}
                                className={`aj-card-option ${form.qualification.includes(q) ? 'aj-card-selected' : ''}`}
                                onClick={() => toggleArrayItem('qualification', q)}
                            >
                                <span className="aj-card-label">{q}</span>
                                {form.qualification.includes(q) && <FiCheck size={14} className="aj-card-check" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ═══ EXPERIENCE ═══ */}
                <div className="aj-section">
                    <div className="aj-grid-2">
                        <div>
                            <label className="aj-label">Experience Required *</label>
                            <select className="aj-select" name="experience" value={form.experience} onChange={handleChange} required>
                                {EXPERIENCE_LEVELS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* ═══ REQUIRED SKILLS ═══ */}
                <div className="aj-section">
                    <label className="aj-label">Required Skills</label>
                    <div className="aj-skill-input-row">
                        <input
                            className="aj-input" style={{ flex: 1 }}
                            placeholder="Add custom skill" value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={handleSkillInputKeyDown}
                        />
                        <button type="button" className="aj-btn-add-skill"
                            onClick={() => { if (skillInput.trim()) { addSkill(skillInput.trim()); setSkillInput(""); } }}>
                            Add Skill
                        </button>
                    </div>

                    {/* Suggested skills */}
                    {form.category && (
                        <div style={{ marginTop: '10px' }}>
                            <p className="aj-hint-text">Common Skills for {form.category}:</p>
                            <div className="aj-tags-row">
                                {suggestedSkills.map(skill => {
                                    const isAdded = form.skills.includes(skill);
                                    return (
                                        <button key={skill} type="button"
                                            className={`aj-skill-suggest ${isAdded ? 'aj-skill-added' : ''}`}
                                            onClick={() => isAdded ? removeSkill(skill) : addSkill(skill)}
                                            disabled={isAdded}
                                        >
                                            {isAdded ? <FiCheck size={12} /> : <span>+</span>}
                                            {skill}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Selected skills */}
                    {form.skills.length > 0 && (
                        <div className="aj-tags-row" style={{ marginTop: '10px' }}>
                            {form.skills.map(skill => (
                                <span key={skill} className="aj-tag aj-tag-green">
                                    {skill}
                                    <button type="button" className="aj-tag-remove" onClick={() => removeSkill(skill)}>×</button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* ═══ COMMISSION & INCENTIVES ═══ */}
                <div className="aj-section">
                    <div className="aj-grid-2">
                        <div>
                            <label className="aj-label">Commission Percentage</label>
                            <select className="aj-select" name="commission" value={form.commission} onChange={handleChange}>
                                {COMMISSION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="aj-label">+ Incentives</label>
                            <input className="aj-input" name="incentives" value={form.incentives} onChange={handleChange}
                                placeholder="e.g., Performance bonus, Lead conversion bonus" />
                        </div>
                    </div>
                </div>

                {/* ═══ SALES TARGETS & ADDITIONAL BENEFITS ═══ */}
                <div className="aj-section">
                    <div className="aj-grid-2">
                        <div>
                            <label className="aj-label">Sales Targets</label>
                            <div className="aj-radio-group">
                                {SALES_TARGETS.map(t => (
                                    <label key={t} className="aj-radio-item">
                                        <input type="radio" name="salesTargets" value={t}
                                            checked={form.salesTargets === t}
                                            onChange={handleChange} />
                                        <span>{t}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="aj-label">Additional Benefits</label>
                            <div className="aj-card-grid aj-card-grid-2">
                                {BENEFITS_OPTIONS.map(b => (
                                    <div key={b}
                                        className={`aj-card-option ${form.benefits.includes(b) ? 'aj-card-selected' : ''}`}
                                        onClick={() => toggleArrayItem('benefits', b)}
                                    >
                                        <span className="aj-card-label">{b}</span>
                                        {form.benefits.includes(b) && <FiCheck size={14} className="aj-card-check" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ LANGUAGE REQUIREMENTS ═══ */}
                <div className="aj-section">
                    <label className="aj-label">Language Requirements *</label>
                    <div className="aj-card-grid aj-card-grid-4">
                        {LANGUAGES.map(lang => (
                            <div key={lang.key} title={lang.key}
                                className={`aj-card-option ${form.languages.includes(lang.key) ? 'aj-card-selected' : ''}`}
                                onClick={() => toggleArrayItem('languages', lang.key)}
                            >
                                <span className="aj-card-label">{lang.label}</span>
                                {form.languages.includes(lang.key) && <FiCheck size={14} className="aj-card-check" />}
                            </div>
                        ))}
                    </div>
                    {form.location && (
                        <p className="aj-auto-hint">Languages auto-selected based on location: {form.location}</p>
                    )}
                </div>

                {/* ═══ PROPERTY TYPES ═══ */}
                <div className="aj-section">
                    <label className="aj-label">Property Types</label>
                    <div className="aj-card-grid aj-card-grid-3">
                        {PROPERTY_TYPES.map(pt => (
                            <div key={pt}
                                className={`aj-card-option ${form.propertyTypes.includes(pt) ? 'aj-card-selected' : ''}`}
                                onClick={() => toggleArrayItem('propertyTypes', pt)}
                            >
                                <span className="aj-card-label">{pt}</span>
                                {form.propertyTypes.includes(pt) && <FiCheck size={14} className="aj-card-check" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ═══ JOB DESCRIPTION ═══ */}
                <div className="aj-section">
                    <div>
                        <label className="aj-label">Job Description *</label>
                        <p className="aj-hint-text" style={{ marginTop: '-2px' }}>
                            Provide detailed job responsibilities and requirements
                        </p>
                    </div>
                    <div className="aj-desc-wrapper">
                        <textarea
                            className="aj-textarea"
                            name="description" value={form.description} onChange={handleChange}
                            rows="8"
                            placeholder={`Job Responsibilities:\n• Make outbound calls to potential customers\n• Generate leads and schedule appointments\n• Explain product features and benefits\n\nRequirements:\n• Excellent communication skills\n• Basic computer knowledge`}
                        />
                        <div className="aj-word-count">
                            {form.description.trim().split(/\s+/).filter(Boolean).length} words
                        </div>
                    </div>
                </div>

                {/* ═══ IMAGE URLS (optional) ═══ */}
                <div className="aj-section">
                    <div className="aj-grid-2">
                        <div>
                            <label className="aj-label">Icon Image URL</label>
                            <input className="aj-input" name="image" value={form.image} onChange={handleChange}
                                placeholder="https://..." />
                        </div>
                        <div>
                            <label className="aj-label">Banner Image URL</label>
                            <input className="aj-input" name="image2" value={form.image2} onChange={handleChange}
                                placeholder="https://..." />
                        </div>
                    </div>
                </div>

                {/* ═══ FOOTER ACTIONS ═══ */}
                <div className="aj-footer">
                    <div className="aj-footer-left">
                        <button type="button" className="aj-btn aj-btn-outline" onClick={() => alert("Preview coming soon!")}>
                            <FiEye size={16} /> Preview Job
                        </button>
                    </div>
                    <div className="aj-footer-right">
                        <button type="button" className="aj-btn aj-btn-discard" onClick={handleDiscard}>
                            Discard
                        </button>
                        {onClose && (
                            <button type="button" className="aj-btn aj-btn-outline" onClick={onClose}>
                                Cancel
                            </button>
                        )}
                        <button type="submit" className="aj-btn aj-btn-submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Job"}
                        </button>
                    </div>
                </div>
            </form>

            {/* ═══════ STYLES ═══════ */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

                .aj-root {
                    font-family: 'Inter', sans-serif;
                    color: #1f2937;
                }
                .aj-root * { box-sizing: border-box; }

                .aj-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .aj-section {
                    display: flex; flex-direction: column; gap: 8px;
                }

                /* ── Labels ── */
                .aj-label {
                    display: block;
                    font-size: 13px; font-weight: 500;
                    color: #374151; margin-bottom: 4px;
                }

                /* ── Inputs & Selects ── */
                .aj-input, .aj-select {
                    width: 100%;
                    padding: 10px 14px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 14px; font-weight: 400;
                    color: #111827;
                    background: #fff;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    font-family: inherit;
                }
                .aj-input:focus, .aj-select:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
                }
                .aj-input::placeholder { color: #9ca3af; }
                .aj-select { cursor: pointer; appearance: auto; }

                /* ── Highlighted Title Box ── */
                .aj-highlight-box {
                    background: #eff6ff;
                    border: 1px solid #bfdbfe;
                    border-radius: 10px;
                    padding: 16px;
                }

                /* ── Grid Layouts ── */
                .aj-grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }

                /* ── Card Option Selectors ── */
                .aj-card-grid {
                    display: grid; gap: 8px;
                }
                .aj-card-grid-2 { grid-template-columns: 1fr 1fr; }
                .aj-card-grid-3 { grid-template-columns: 1fr 1fr 1fr; }
                .aj-card-grid-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }

                .aj-card-option {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10px 14px;
                    border-radius: 10px;
                    border: 1px solid #d1d5db;
                    background: #fff;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
                    user-select: none;
                }
                .aj-card-option:hover {
                    border-color: #3b82f6;
                    box-shadow: 0 2px 8px rgba(59,130,246,0.12);
                }
                .aj-card-selected {
                    background: #3b82f6 !important;
                    border-color: #3b82f6 !important;
                    color: #fff !important;
                }
                .aj-card-selected .aj-card-label { color: #fff; }

                .aj-card-label {
                    font-size: 13px;
                    font-weight: 500;
                    color: #111827;
                }
                .aj-card-check {
                    flex-shrink: 0;
                    color: #fff;
                }

                /* ── Tags / Chips ── */
                .aj-tags-row {
                    display: flex; flex-wrap: wrap; gap: 6px;
                }
                .aj-tag {
                    display: inline-flex; align-items: center; gap: 4px;
                    padding: 4px 12px;
                    border-radius: 9999px;
                    font-size: 13px; font-weight: 500;
                }
                .aj-tag-green {
                    background: #dcfce7; color: #15803d;
                }
                .aj-tag-remove {
                    background: none; border: none;
                    color: #ef4444; cursor: pointer;
                    font-size: 14px; font-weight: 700;
                    padding: 0 2px; line-height: 1;
                }
                .aj-tag-remove:hover { color: #b91c1c; }

                /* ── Skill Suggestions ── */
                .aj-skill-input-row {
                    display: flex; gap: 8px;
                }
                .aj-btn-add-skill {
                    padding: 10px 18px;
                    background: #e5e7eb; color: #374151;
                    border: none; border-radius: 8px;
                    font-size: 13px; font-weight: 500;
                    cursor: pointer; white-space: nowrap;
                    transition: background 0.2s;
                    font-family: inherit;
                }
                .aj-btn-add-skill:hover { background: #d1d5db; }

                .aj-skill-suggest {
                    display: inline-flex; align-items: center; gap: 4px;
                    padding: 4px 10px;
                    border-radius: 9999px;
                    font-size: 12px; font-weight: 500;
                    border: none; cursor: pointer;
                    transition: background 0.2s;
                    font-family: inherit;
                }
                .aj-skill-suggest:not(.aj-skill-added) {
                    background: #dbeafe; color: #1d4ed8;
                }
                .aj-skill-suggest:not(.aj-skill-added):hover {
                    background: #bfdbfe;
                }
                .aj-skill-added {
                    background: #dcfce7; color: #15803d;
                    cursor: not-allowed; opacity: 0.8;
                }

                /* ── Hint Text ── */
                .aj-hint-text {
                    font-size: 12px; color: #6b7280;
                    margin: 0 0 4px;
                }
                .aj-auto-hint {
                    font-size: 12px; color: #2563eb;
                    margin: 4px 0 0;
                }

                /* ── Radio Group ── */
                .aj-radio-group {
                    display: flex; flex-direction: column; gap: 8px;
                }
                .aj-radio-item {
                    display: flex; align-items: center; gap: 8px;
                    cursor: pointer; font-size: 13px; color: #374151;
                }
                .aj-radio-item input[type="radio"] {
                    width: 16px; height: 16px;
                    accent-color: #3b82f6;
                    cursor: pointer;
                }

                /* ── Description Textarea ── */
                .aj-desc-wrapper {
                    position: relative;
                }
                .aj-textarea {
                    width: 100%;
                    padding: 14px 16px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 14px; font-weight: 400;
                    color: #111827;
                    background: #fff;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    font-family: inherit;
                    resize: vertical;
                    min-height: 180px;
                    line-height: 1.6;
                }
                .aj-textarea:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
                }
                .aj-textarea::placeholder { color: #9ca3af; }
                .aj-word-count {
                    position: absolute; bottom: 10px; right: 12px;
                    font-size: 11px; color: #9ca3af;
                    background: #fff; padding: 2px 8px;
                    border-radius: 6px; border: 1px solid #e5e7eb;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
                }

                /* ── Footer ── */
                .aj-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 16px;
                    border-top: 1px solid #e5e7eb;
                    flex-wrap: wrap;
                    gap: 12px;
                }
                .aj-footer-left { display: flex; gap: 10px; }
                .aj-footer-right { display: flex; gap: 10px; flex-wrap: wrap; }

                .aj-btn {
                    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-size: 14px; font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-family: inherit;
                    white-space: nowrap;
                }
                .aj-btn-outline {
                    background: #fff;
                    border: 1px solid #d1d5db;
                    color: #374151;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                .aj-btn-outline:hover { background: #f9fafb; }

                .aj-btn-discard {
                    background: #fecaca;
                    border: 1px solid #d1d5db;
                    color: #fff;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                .aj-btn-discard:hover { background: #f9fafb; color: #1f2937; }

                .aj-btn-submit {
                    background: #2563eb;
                    border: 1px solid transparent;
                    color: #fff;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                .aj-btn-submit:hover { background: #1d4ed8; }
                .aj-btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

                /* ── Responsive ── */
                @media (max-width: 768px) {
                    .aj-grid-2 { grid-template-columns: 1fr; }
                    .aj-card-grid-3 { grid-template-columns: 1fr 1fr; }
                    .aj-card-grid-4 { grid-template-columns: 1fr 1fr; }
                    .aj-footer { flex-direction: column-reverse; align-items: stretch; }
                    .aj-footer-left, .aj-footer-right { justify-content: center; }
                    .aj-skill-input-row { flex-direction: column; }
                }
                @media (max-width: 480px) {
                    .aj-card-grid-2 { grid-template-columns: 1fr; }
                    .aj-card-grid-3 { grid-template-columns: 1fr; }
                    .aj-card-grid-4 { grid-template-columns: 1fr 1fr; }
                }
            `}</style>
        </div>
    );
};

export default AddJobs;
