import React, { useEffect, useState } from "react";
import api from "../config/api";
import {
    FiCheck, FiX, FiPlus, FiEye, FiTrash2,
    FiInfo, FiMapPin, FiCreditCard, FiTarget,
    FiFileText, FiImage, FiAward, FiBriefcase
} from "react-icons/fi";

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
                const res = await api.get("/companies");
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
            await api.post("/jobCategories", payload);
            alert("✅ Job added successfully");

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

                {/* ═══ SECTION: BASIC INFORMATION ═══ */}
                <div className="aj-section-group">
                    <div className="aj-section-header">
                        <FiInfo className="aj-section-icon" />
                        <h3>Basic Information</h3>
                    </div>
                    <div className="aj-grid-3">
                        <div className="aj-input-wrapper">
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
                        <div className="aj-input-wrapper">
                            <label className="aj-label">Category *</label>
                            <select className="aj-select" name="category" value={form.category} onChange={handleChange}>
                                <option value="">Select Category</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="aj-input-wrapper">
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

                    <div className="aj-highlight-box mt-3">
                        <label className="aj-label">Job Title *</label>
                        <input
                            className="aj-input aj-input-lg"
                            name="title" value={form.title} onChange={handleChange}
                            placeholder="e.g. Senior Real Estate Consultant" required
                        />
                    </div>
                </div>

                {/* ═══ SECTION: LOCATION & COMPENSATION ═══ */}
                <div className="aj-section-group">
                    <div className="aj-section-header">
                        <FiMapPin className="aj-section-icon" />
                        <h3>Location & Compensation</h3>
                    </div>
                    <div className="aj-grid-3">
                        <div className="aj-input-wrapper">
                            <label className="aj-label">Job Location *</label>
                            <select className="aj-select" name="location" value={form.location} onChange={handleChange} required>
                                <option value="">Select Location</option>
                                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                        <div className="aj-input-wrapper">
                            <label className="aj-label">Job Role Type</label>
                            <select className="aj-select" name="jobRoleType" value={form.jobRoleType} onChange={handleChange}>
                                {JOB_ROLE_TYPES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </div>
                        <div className="aj-input-wrapper">
                            <label className="aj-label">Fixed Salary *</label>
                            <input className="aj-input" name="salary" value={form.salary} onChange={handleChange}
                                placeholder="₹ 3 LPA, ₹ 25k/mo" required />
                        </div>
                        <div className="aj-input-wrapper">
                            <label className="aj-label">Commission</label>
                            <select className="aj-select" name="commission" value={form.commission} onChange={handleChange}>
                                {COMMISSION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </div>
                        <div className="aj-input-wrapper" style={{ gridColumn: 'span 2' }}>
                            <label className="aj-label">+ Incentives</label>
                            <input className="aj-input" name="incentives" value={form.incentives} onChange={handleChange}
                                placeholder="e.g. Lead conversion bonus, performance bonus" />
                        </div>
                    </div>
                </div>

                {/* ═══ SECTION: REQUIREMENTS & SKILLS ═══ */}
                <div className="aj-section-group">
                    <div className="aj-section-header">
                        <FiAward className="aj-section-icon" />
                        <h3>Candidate Requirements</h3>
                    </div>
                    <div className="aj-grid-2">
                        <div className="aj-input-wrapper">
                            <label className="aj-label">Experience Required *</label>
                            <select className="aj-select" name="experience" value={form.experience} onChange={handleChange} required>
                                {EXPERIENCE_LEVELS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </div>
                        <div className="aj-input-wrapper">
                            <label className="aj-label">Education</label>
                            <div className="aj-tags-row mb-2">
                                {form.qualification.map(q => (
                                    <span key={q} className="aj-tag aj-tag-green">
                                        {q} <FiX className="ms-1" size={14} style={{ cursor: 'pointer' }} onClick={() => toggleArrayItem('qualification', q)} />
                                    </span>
                                ))}
                            </div>
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
                    </div>

                    <div className="aj-skill-section mt-4">
                        <label className="aj-label">Required Skills</label>
                        <div className="aj-skill-input-row">
                            <input
                                className="aj-input" style={{ flex: 1 }}
                                placeholder="Add custom skill..." value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={handleSkillInputKeyDown}
                            />
                            <button type="button" className="aj-btn-add-skill"
                                onClick={() => { if (skillInput.trim()) { addSkill(skillInput.trim()); setSkillInput(""); } }}>
                                Add Skill
                            </button>
                        </div>

                        {form.category && (
                            <div className="aj-suggestions mt-3">
                                <span className="aj-hint-text">Suggestions:</span>
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

                        {form.skills.length > 0 && (
                            <div className="aj-tags-row mt-3">
                                {form.skills.map(skill => (
                                    <span key={skill} className="aj-tag aj-tag-green">
                                        {skill} <FiX onClick={() => removeSkill(skill)} size={14} style={{ cursor: 'pointer' }} />
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ═══ SECTION: TARGETS & BENEFITS ═══ */}
                <div className="aj-section-group">
                    <div className="aj-section-header">
                        <FiTarget className="aj-section-icon" />
                        <h3>Targets & Perks</h3>
                    </div>
                    <div className="aj-grid-2">
                        <div className="aj-input-wrapper">
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
                        <div className="aj-input-wrapper">
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

                {/* ═══ SECTION: LANGUAGES & ASSETS ═══ */}
                <div className="aj-section-group">
                    <div className="aj-section-header">
                        <FiBriefcase className="aj-section-icon" />
                        <h3>Market Focus & Assets</h3>
                    </div>
                    <div className="aj-grid-2">
                        <div className="aj-input-wrapper">
                            <label className="aj-label">Language Requirements</label>
                            <div className="aj-card-grid aj-card-grid-4">
                                {LANGUAGES.map(lang => (
                                    <div key={lang.key}
                                        className={`aj-card-option ${form.languages.includes(lang.key) ? 'aj-card-selected' : ''}`}
                                        onClick={() => toggleArrayItem('languages', lang.key)}
                                    >
                                        <span className="aj-card-label">{lang.label}</span>
                                        {form.languages.includes(lang.key) && <FiCheck size={14} className="aj-card-check" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="aj-input-wrapper">
                            <label className="aj-label">Property Types Focus</label>
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
                    </div>
                </div>

                {/* ═══ SECTION: DESCRIPTION ═══ */}
                <div className="aj-section-group">
                    <div className="aj-section-header">
                        <FiFileText className="aj-section-icon" />
                        <h3>Job Description</h3>
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

                {/* ═══ SECTION: VISUALS ═══ */}
                <div className="aj-section-group">
                    <div className="aj-section-header">
                        <FiImage className="aj-section-icon" />
                        <h3>Media Assets</h3>
                    </div>
                    <div className="aj-grid-2">
                        <div className="aj-input-wrapper">
                            <label className="aj-label">Icon / Logo URL</label>
                            <input className="aj-input" name="image" value={form.image} onChange={handleChange}
                                placeholder="https://example.com/logo.png" />
                        </div>
                        <div className="aj-input-wrapper">
                            <label className="aj-label">Banner Image URL</label>
                            <input className="aj-input" name="image2" value={form.image2} onChange={handleChange}
                                placeholder="https://example.com/banner.jpg" />
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
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

                :root {
                    --nm-bg: #f0f4f8;
                    --nm-light: #ffffff;
                    --nm-dark: #d1d9e6;
                    --nm-accent: #4f46e5;
                    --nm-text: #4a5568;
                    --nm-text-light: #718096;
                    
                    /* Shadows */
                    --nm-outset: 8px 8px 16px var(--nm-dark), -8px -8px 16px var(--nm-light);
                    --nm-inset: inset 6px 6px 12px var(--nm-dark), inset -6px -6px 12px var(--nm-light);
                    --nm-outset-sm: 4px 4px 8px var(--nm-dark), -4px -4px 8px var(--nm-light);
                    --nm-inset-sm: inset 3px 3px 6px var(--nm-dark), inset -3px -3px 6px var(--nm-light);
                }

                .aj-root {
                    font-family: 'Outfit', sans-serif;
                    color: var(--nm-text);
                    background-color: var(--nm-bg);
                    padding: 30px;
                    border-radius: 24px;
                }
                .aj-root * { box-sizing: border-box; }

                .aj-form {
                    display: flex;
                    flex-direction: column;
                    gap: 35px;
                }

                /* ── Groups & Headers ── */
                .aj-section-group {
                    background: var(--nm-bg);
                    padding: 30px;
                    border-radius: 24px;
                    box-shadow: var(--nm-outset);
                    border: 1px solid rgba(255,255,255,0.8);
                }

                .aj-section-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 25px;
                }
                .aj-section-icon {
                    font-size: 20px;
                    color: var(--nm-accent);
                    background: var(--nm-bg);
                    padding: 10px;
                    border-radius: 14px;
                    box-shadow: var(--nm-outset-sm);
                }
                .aj-section-header h3 {
                    font-size: 18px;
                    font-weight: 700;
                    margin: 0;
                    letter-spacing: -0.5px;
                    color: var(--nm-text);
                }

                .aj-section {
                    display: flex; flex-direction: column; gap: 12px;
                }

                /* ── Grid Layouts ── */
                .aj-grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                }
                .aj-grid-3 {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 24px;
                }

                /* ── Labels ── */
                .aj-label {
                    display: block;
                    font-size: 14px; 
                    font-weight: 600;
                    color: var(--nm-text-light); 
                    margin-bottom: 8px;
                    margin-left: 14px;
                    text-transform: capitalize;
                }

                /* ── Inputs & Selects ── */
                .aj-input {
                    width: 100%;
                    padding: 14px 22px;
                    border: none;
                    border-radius: 50px;
                    font-size: 15px; 
                    font-weight: 500;
                    color: #1a202c;
                    background: var(--nm-bg);
                    outline: none;
                    box-shadow: var(--nm-inset);
                    transition: all 0.3s ease;
                    font-family: inherit;
                }
                .aj-input:focus {
                    box-shadow: var(--nm-inset), 0 0 0 2px rgba(79, 70, 229, 0.1);
                }
                .aj-input::placeholder { color: #a0aec0; }
                .aj-input-lg {
                    font-size: 18px;
                    font-weight: 700;
                    padding: 18px 28px;
                    color: var(--nm-accent);
                }

                .aj-select {
                    width: 100%;
                    padding: 14px 22px;
                    border: none;
                    border-radius: 50px;
                    font-size: 15px; 
                    font-weight: 500;
                    color: #1a202c;
                    background: var(--nm-bg);
                    outline: none;
                    box-shadow: var(--nm-outset-sm);
                    transition: all 0.3s ease;
                    font-family: inherit;
                    cursor: pointer;
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23718096' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 18px center;
                    background-size: 18px;
                }

                /* ── Highlighted Title Box ── */
                .aj-highlight-box {
                    background: var(--nm-bg);
                    border-radius: 20px;
                    padding: 24px;
                    box-shadow: var(--nm-outset-sm);
                }

                /* ── Card Option Selectors ── */
                .aj-card-grid {
                    display: grid; gap: 14px;
                }
                .aj-card-grid-2 { grid-template-columns: 1fr 1fr; }
                .aj-card-grid-3 { grid-template-columns: 1fr 1fr 1fr; }
                .aj-card-grid-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }

                /* ── Utilities ── */
                .mt-2 { margin-top: 10px; }
                .mt-3 { margin-top: 15px; }
                .mt-4 { margin-top: 20px; }
                .mb-2 { margin-bottom: 10px; }
                .ms-1 { margin-left: 5px; }

                .aj-card-option {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 14px 18px;
                    border-radius: 16px;
                    border: none;
                    background: var(--nm-bg);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: var(--nm-outset-sm);
                    user-select: none;
                }
                .aj-card-option:hover {
                    box-shadow: 6px 6px 12px var(--nm-dark), -6px -6px 12px var(--nm-light);
                    transform: translateY(-2px);
                }
                .aj-card-option:active {
                    box-shadow: var(--nm-inset-sm);
                    transform: translateY(0);
                }
                .aj-card-selected {
                    background: var(--nm-accent) !important;
                    color: #fff !important;
                    box-shadow: inset 4px 4px 8px rgba(0,0,0,0.2), inset -4px -4px 8px rgba(255,255,255,0.1) !important;
                }
                .aj-card-selected .aj-card-label { color: #fff; }

                .aj-card-label {
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--nm-text);
                }
                .aj-card-check {
                    flex-shrink: 0;
                    color: #fff;
                }

                /* ── Tags / Chips ── */
                .aj-tags-row {
                    display: flex; flex-wrap: wrap; gap: 10px;
                }
                .aj-tag {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 6px 16px;
                    border-radius: 50px;
                    font-size: 13px; font-weight: 600;
                    box-shadow: var(--nm-outset-sm);
                    background: var(--nm-bg);
                }
                .aj-tag-green {
                    color: #10b981;
                }
                .aj-tag-remove {
                    background: var(--nm-bg); 
                    border: none;
                    width: 20px; height: 20px;
                    display: flex; align-items: center; justify-content: center;
                    border-radius: 50%;
                    box-shadow: var(--nm-outset-sm);
                    color: #ef4444; 
                    cursor: pointer;
                    font-size: 14px; font-weight: 800;
                    transition: all 0.2s;
                }
                .aj-tag-remove:hover { 
                    box-shadow: var(--nm-inset-sm);
                    color: #b91c1c; 
                }

                /* ── Skill Suggestions ── */
                .aj-skill-input-row {
                    display: flex; gap: 12px;
                    align-items: center;
                }
                .aj-btn-add-skill {
                    padding: 14px 24px;
                    background: var(--nm-bg); 
                    color: var(--nm-accent);
                    border: none; 
                    border-radius: 50px;
                    font-size: 14px; 
                    font-weight: 700;
                    cursor: pointer; 
                    white-space: nowrap;
                    box-shadow: var(--nm-outset-sm);
                    transition: all 0.2s;
                    font-family: inherit;
                }
                .aj-btn-add-skill:hover { box-shadow: 6px 6px 12px var(--nm-dark), -6px -6px 12px var(--nm-light); }
                .aj-btn-add-skill:active { box-shadow: var(--nm-inset-sm); }

                .aj-skill-suggest {
                    display: inline-flex; align-items: center; gap: 6px;
                    padding: 6px 14px;
                    border-radius: 50px;
                    font-size: 12px; 
                    font-weight: 600;
                    border: none; 
                    cursor: pointer;
                    background: var(--nm-bg);
                    box-shadow: var(--nm-outset-sm);
                    color: var(--nm-text-light);
                    transition: all 0.2s;
                    font-family: inherit;
                }
                .aj-skill-suggest:not(.aj-skill-added):hover {
                    box-shadow: 6px 6px 12px var(--nm-dark), -6px -6px 12px var(--nm-light);
                    color: var(--nm-accent);
                }
                .aj-skill-added {
                    box-shadow: var(--nm-inset-sm);
                    color: #10b981;
                    cursor: not-allowed;
                }

                /* ── Hint Text ── */
                .aj-hint-text {
                    font-size: 12px; color: var(--nm-text-light);
                    margin: 0 0 8px 14px;
                    font-style: italic;
                }
                .aj-auto-hint {
                    font-size: 12px; color: var(--nm-accent);
                    margin: 8px 0 0 14px;
                    font-weight: 600;
                }

                /* ── Radio Group ── */
                .aj-radio-group {
                    display: flex; flex-direction: column; gap: 12px;
                    padding: 10px;
                }
                .aj-radio-item {
                    display: flex; align-items: center; gap: 12px;
                    cursor: pointer; font-size: 14px; color: var(--nm-text);
                    padding: 8px 14px;
                    border-radius: 12px;
                    transition: all 0.2s;
                }
                .aj-radio-item:hover { background: rgba(0,0,0,0.02); }
                .aj-radio-item input[type="radio"] {
                    width: 20px; height: 20px;
                    appearance: none;
                    background: var(--nm-bg);
                    box-shadow: var(--nm-outset-sm);
                    border-radius: 50%;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.2s;
                }
                .aj-radio-item input[type="radio"]:checked {
                    box-shadow: var(--nm-inset-sm);
                }
                .aj-radio-item input[type="radio"]:checked::after {
                    content: '';
                    position: absolute;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    width: 10px; height: 10px;
                    background: var(--nm-accent);
                    border-radius: 50%;
                }

                /* ── Description Textarea ── */
                .aj-desc-wrapper {
                    position: relative;
                }
                .aj-textarea {
                    width: 100%;
                    padding: 20px 24px;
                    border: none;
                    border-radius: 20px;
                    font-size: 15px; 
                    font-weight: 400;
                    color: #1a202c;
                    background: var(--nm-bg);
                    outline: none;
                    box-shadow: var(--nm-inset);
                    transition: all 0.3s ease;
                    font-family: inherit;
                    resize: vertical;
                    min-height: 200px;
                    line-height: 1.7;
                }
                .aj-textarea:focus {
                    box-shadow: var(--nm-inset), 0 0 0 2px rgba(79, 70, 229, 0.1);
                }
                .aj-textarea::placeholder { color: #a0aec0; }
                .aj-word-count {
                    position: absolute; bottom: 15px; right: 20px;
                    font-size: 11px; 
                    font-weight: 600;
                    color: var(--nm-text-light);
                    background: var(--nm-bg); 
                    padding: 4px 10px;
                    border-radius: 50px; 
                    box-shadow: var(--nm-outset-sm);
                }

                /* ── Footer ── */
                .aj-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 30px;
                    margin-top: 20px;
                    border-top: 2px solid var(--nm-dark);
                    flex-wrap: wrap;
                    gap: 20px;
                }
                .aj-footer-left { display: flex; gap: 14px; }
                .aj-footer-right { display: flex; gap: 14px; flex-wrap: wrap; }

                .aj-btn {
                    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
                    padding: 14px 28px;
                    border-radius: 50px;
                    font-size: 15px; 
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    font-family: inherit;
                    white-space: nowrap;
                    border: none;
                }
                .aj-btn:active {
                    transform: scale(0.95);
                }
                
                .aj-btn-outline {
                    background: var(--nm-bg);
                    color: var(--nm-text);
                    box-shadow: var(--nm-outset-sm);
                }
                .aj-btn-outline:hover { 
                    box-shadow: 6px 6px 12px var(--nm-dark), -6px -6px 12px var(--nm-light);
                    color: var(--nm-accent);
                }
                .aj-btn-outline:active {
                    box-shadow: var(--nm-inset-sm);
                }

                .aj-btn-discard {
                    background: var(--nm-bg);
                    color: #ef4444;
                    box-shadow: var(--nm-outset-sm);
                }
                .aj-btn-discard:hover { 
                    box-shadow: 6px 6px 12px var(--nm-dark), -6px -6px 12px var(--nm-light);
                    background: #fee2e2;
                }
                .aj-btn-discard:active {
                    box-shadow: var(--nm-inset-sm);
                }

                .aj-btn-submit {
                    background: var(--nm-accent);
                    color: #fff;
                    box-shadow: 6px 6px 12px var(--nm-dark), -6px -6px 12px var(--nm-light);
                }
                .aj-btn-submit:hover { 
                    transform: translateY(-2px);
                    box-shadow: 8px 8px 16px var(--nm-dark), -8px -8px 16px var(--nm-light);
                    background: #4338ca;
                }
                .aj-btn-submit:active {
                    box-shadow: inset 4px 4px 8px rgba(0,0,0,0.2);
                    transform: translateY(0);
                }
                .aj-btn-submit:disabled { 
                    opacity: 0.6; 
                    cursor: not-allowed;
                    box-shadow: none;
                }

                /* ── Responsive ── */
                @media (max-width: 768px) {
                    .aj-grid-2, .aj-grid-3 { grid-template-columns: 1fr; }
                    .aj-card-grid-3 { grid-template-columns: 1fr 1fr; }
                    .aj-card-grid-4 { grid-template-columns: 1fr 1fr; }
                    .aj-footer { flex-direction: column-reverse; align-items: stretch; }
                    .aj-footer-left, .aj-footer-right { justify-content: center; }
                    .aj-skill-input-row { flex-direction: column; }
                    .aj-btn-add-skill { width: 100%; }
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
