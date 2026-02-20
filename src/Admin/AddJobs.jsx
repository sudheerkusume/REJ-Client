import { useEffect, useState } from "react";
import api from "../config/api";
import {
    FiCheck, FiX, FiEye,
    FiInfo, FiMapPin, FiCreditCard, FiTarget,
    FiFileText, FiAward, FiBriefcase
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

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

const CATEGORY_BENEFITS = {
    'Tele Caller': [
        "Mobile Allowance",
        "Performance Bonus",
        "Lead Incentives",
        "Attendance Bonus"
    ],
    'Channel Partners': [
        "High Commission",
        "Travel Allowance",
        "Partner Meetups",
        "Sales Support"
    ],
    'Real Estate Sales': [
        "Petrol Allowance",
        "Site Visit Bonus",
        "Closing Incentives",
        "Mobile Allowance"
    ],
    'CRM Executive': [
        "Medical Insurance",
        "PF & ESI",
        "Yearly Hike",
        "Performance Bonus"
    ],
    'Digital Marketing': [
        "Paid Tools Access",
        "Skill Development",
        "Remote Work Option",
        "Project Bonus"
    ],
    'HR & Operations': [
        "Medical Insurance",
        "PF",
        "Annual Leave",
        "Employee Wellness"
    ],
    'Accounts & Auditing': [
        "Professional Fees",
        "Health Insurance",
        "Paid Time Off",
        "PF"
    ],
    'Legal': [
        "Legal Certification Fees",
        "PF",
        "Yearly Bonus",
        "Professional Insurance"
    ],
    'Architects': [
        "Site Visit Allowance",
        "Software Subscriptions",
        "Project Milestones",
        "PF"
    ],
    'Web Development': [
        "Work From Home",
        "Gadget Allowance",
        "Learning Credits",
        "Yearly Hike"
    ],
    'default': [
        "Performance Bonus",
        "PF",
        "Insurance",
        "Cell Phone Reimbursement"
    ]
};

const CATEGORY_TARGETS = {
    'Tele Caller': [
        "50-70 calls per day",
        "80-100 calls per day",
        "15-20 qualified leads per day",
        "Weekly appointment targets"
    ],

    'Channel Partners': [
        "1-2 bookings per month",
        "₹50L - ₹1Cr monthly business",
        "3-5 site visits per week",
        "Revenue based targets"
    ],

    'Real Estate Sales': [
        "1 booking per month",
        "2-3 bookings per month",
        "₹75L+ monthly sales volume",
        "5-8 site visits per week"
    ],

    'CRM Executive': [
        "Daily follow-up targets",
        "Lead conversion ratio targets",
        "Monthly CRM performance KPI"
    ],

    'Digital Marketing': [
        "Monthly lead generation targets",
        "Campaign ROI targets",
        "Social media growth targets",
        "Website traffic goals"
    ],

    'HR & Operations': [
        "Monthly hiring targets",
        "Employee retention KPI",
        "Operational efficiency targets"
    ],

    'Accounts & Auditing': [
        "Monthly reporting deadlines",
        "Tax filing targets",
        "Audit completion targets"
    ],

    'Legal': [
        "Case handling deadlines",
        "Compliance targets",
        "Documentation completion targets"
    ],

    'Architects': [
        "Project submission deadlines",
        "Site inspection targets",
        "Design approval milestones"
    ],

    'Web Development': [
        "Sprint delivery targets",
        "Project milestone deadlines",
        "Bug resolution KPI"
    ],

    'default': [
        "Performance Based",
        "Monthly Targets",
        "Weekly Targets",
        "KPI Based"
    ]
};




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

const LOCATION_AREAS = {
    "Hyderabad": ["Madhapur", "Gachibowli", "Kondapur", "Kukatpally", "LB Nagar", "Uppal", "Secunderabad", "Hitech City", "Manikonda", "Miyapur"],
    "Bengaluru": ["Whitefield", "Electronic City", "Indiranagar", "Koramangala", "HSR Layout", "Manyata Tech Park", "Marathahalli"],
    "Mumbai": ["Andheri", "Bandra", "Worli", "Borivali", "Navi Mumbai", "Thane"],
    "Delhi NCR": ["Gurugram", "Noida", "South Delhi", "Dwarka"],
    "Chennai": ["OMR", "Adyar", "Velachery", "Ambattur"],
    "Kolkata": ["Salt Lake", "New Town", "Park Street"],
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

/* Category-based default logos */
const CATEGORY_LOGOS = {
    'Tele Caller': '/job-icons/call-center-agent_4789179.png',
    'Channel Partners': '/job-icons/coalition_17940325.png',
    'Real Estate Sales': '/job-icons/realestate.png',
    'CRM Executive': '/job-icons/project-history_12805036.png',
    'Digital Marketing': '/job-icons/online-marketing_13618482.png',
    'HR & Operations': '/job-icons/hr-management_11476386.png',
    'Accounts & Auditing': '/job-icons/script_8644540.png',
    'Legal': '/job-icons/legal_11055178.png',
    'Architects': '/job-icons/engineer_2942612.png',
    'Web Development': '/job-icons/work_10219588.png',
    'default': '/job-icons/realestate.png'
};


/* ═══════════════════════════════════════════════════ */
/*                    ADD JOBS COMPONENT               */
/* ═══════════════════════════════════════════════════ */
const AddJobs = ({ onJobAdded, onClose, prefilledData }) => {
    const { user, role } = useAuth();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [skillInput, setSkillInput] = useState("");
    const [showPreview, setShowPreview] = useState(false);

    const [form, setForm] = useState({
        companyId: "",
        company: "",
        category: "",
        title: "",
        location: "",
        preferredArea: "",
        salaryMin: "",
        salaryMax: "",
        type: "Full-time",
        jobRoleType: "",
        experience: "",
        qualification: [],
        skills: [],
        description: "",
        responsibilities: [],
        commission: "",
        salesTargets: "",
        benefits: [],
        languages: [],
        image: "",
        image2: ""
    });

    // Populate form if prefilledData is passed
    useEffect(() => {
        if (prefilledData) {
            setForm(prev => ({
                ...prev,
                ...prefilledData,
                // Handle specific structure mappings if necessary
                salaryMin: prefilledData.salary?.min || prefilledData.salaryMin || "",
                salaryMax: prefilledData.salary?.max || prefilledData.salaryMax || "",
                commission: prefilledData.salary?.commission || prefilledData.commission || "",
            }));
        }
    }, [prefilledData]);

    /* ─── Fetch Companies & Auto-select for logged-in user ─── */
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await api.get("/companies");
                const allCompanies = res.data || [];
                setCompanies(allCompanies);

                // Auto-select if company or recruiter is logged in
                if (role === "company" && user) {
                    setForm(prev => ({
                        ...prev,
                        companyId: user._id || user.id,
                        company: user.name
                    }));
                } else if (role === "recruiter" && user) {
                    // Try to find if the recruiter's company info is available
                    // Recruiter user object might have companyId and companyName
                    if (user.companyId) {
                        setForm(prev => ({
                            ...prev,
                            companyId: user.companyId,
                            company: user.companyName || user.company || ""
                        }));
                    }
                }
            } catch (err) {
                console.error("Company fetch error:", err);
            }
        };
        fetchCompanies();
    }, [role, user]);

    /* ─── Auto-select logo based on category ─── */
    useEffect(() => {
        if (form.category) {
            const logo = CATEGORY_LOGOS[form.category] || CATEGORY_LOGOS['default'];
            setForm(prev => ({ ...prev, image: logo, salesTargets: "", benefits: [] }));
        }
    }, [form.category]);

    /* ─── Auto-reset and updates on location change ─── */
    useEffect(() => {
        if (form.location) {
            setForm(prev => ({
                ...prev,
                preferredArea: "", // Reset area when city changes
                languages: LOCATION_LANGUAGES[form.location] || prev.languages
            }));
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

        /* Build structured payload mapping to backend schema */
        const payload = {
            companyId: form.companyId,
            company: form.company,
            category: form.category,
            title: form.title,
            location: form.location,
            preferredArea: form.preferredArea,
            salary: {
                min: form.salaryMin,
                max: form.salaryMax,
                commission: form.commission,
            },
            description: form.description,
            type: form.type,
            jobRoleType: form.jobRoleType,
            experience: form.experience,
            qualification: form.qualification,
            responsibilities: form.responsibilities,
            skills: form.skills,
            benefits: form.benefits,
            languages: form.languages,
            salesTargets: form.salesTargets,
            image: form.image,
            image2: form.image2
        };

        try {
            setLoading(true);
            await api.post("/jobCategories", payload);
            alert("✅ Job added successfully");

            // Reset
            setForm({
                companyId: "", company: "", category: "", title: "", location: "",
                preferredArea: "", salaryMin: "", salaryMax: "",
                type: "Full-time", jobRoleType: "", experience: "",
                qualification: [], skills: [],
                description: "", responsibilities: [],
                commission: "", salesTargets: "",
                benefits: [], languages: [],
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
                preferredArea: "", salaryMin: "", salaryMax: "",
                type: "Full-time", jobRoleType: "", experience: "",
                qualification: [], skills: [],
                description: "", responsibilities: [],
                commission: "", salesTargets: "",
                benefits: [], languages: [],
                image: "", image2: ""
            });
            setSkillInput("");
        }
    };

    /* ═════════════ RENDER ═════════════ */
    return (
        <div className="aj-root">
            <form onSubmit={handleSubmit} className="aj-form">

                {/* ═══ 1, 2, 3: COMPANY, CATEGORY & TITLE ═══ */}
                <div className="aj-section-group">
                    <div className="aj-section-header">
                        <FiInfo className="aj-section-icon" />
                        <div>
                            <h3>Job Identity</h3>
                            <p className="aj-section-desc">📝 Basic details about the company and the role</p>
                        </div>
                    </div>
                    <div className="aj-grid-2">
                        <div className="aj-input-wrapper">
                            <label className="aj-label">🏢 Company Name *</label>
                            <select
                                className={`aj-select ${(role === 'company' || (role === 'recruiter' && form.companyId)) ? 'aj-readonly' : ''}`}
                                value={form.companyId}
                                disabled={role === 'company' || (role === 'recruiter' && !!form.companyId)}
                                onChange={(e) => {
                                    const sel = companies.find(c => c._id === e.target.value);
                                    setForm(prev => ({ ...prev, companyId: e.target.value, company: sel?.name || "" }));
                                }} required>
                                <option value="">Select Company</option>
                                {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                            {(role === 'company' || (role === 'recruiter' && form.companyId)) && (
                                <p className="aj-auto-hint mt-1" style={{ fontSize: '11px' }}>Logged in as {form.company}</p>
                            )}
                        </div>
                        <div className="aj-input-wrapper">
                            <label className="aj-label">📂 Category *</label>
                            <select className="aj-select" name="category" value={form.category} onChange={handleChange}>
                                <option value="">Select Category</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="aj-highlight-box mt-4">
                        <label className="aj-label">✏️ Job Title * <span className="aj-hint-inline">— What is the job called?</span></label>
                        <input
                            className="aj-input aj-input-lg"
                            name="title" value={form.title} onChange={handleChange}
                            placeholder="e.g. Senior Real Estate Consultant" required
                        />
                    </div>
                </div>

                {/* ═══ 4: EDUCATION & LANGUAGE REQUIREMENTS ═══ */}
                <div className="aj-section-group">
                    <div className="aj-section-header">
                        <FiAward className="aj-section-icon" />
                        <div>
                            <h3>Education & Languages</h3>
                            <p className="aj-section-desc">🎓 Academic background and communication skills</p>
                        </div>
                    </div>
                    <div className="aj-grid-1">
                        <div className="aj-input-wrapper mb-4">
                            <label className="aj-label">Education Requirements</label>
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
                    </div>
                </div>

                {/* ═══ 5: LOCATION & EMPLOYMENT TYPE ═══ */}
                <div className="aj-section-group">
                    <div className="aj-section-header">
                        <FiMapPin className="aj-section-icon" />
                        <div>
                            <h3>Location & Employment</h3>
                            <p className="aj-section-desc">📍 Where and how will the candidate work?</p>
                        </div>
                    </div>
                    <div className="aj-grid-2">
                        <div className="aj-input-wrapper">
                            <label className="aj-label">📍 Job Location *</label>
                            <select className="aj-select" name="location" value={form.location} onChange={handleChange} required>
                                <option value="">Select Location</option>
                                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>

                            <div className="aj-input-wrapper mt-3">
                                <label className="aj-label">📌 Preferred Area</label>
                                <select
                                    className="aj-select"
                                    name="preferredArea"
                                    value={form.preferredArea}
                                    onChange={handleChange}
                                    disabled={!form.location}
                                >
                                    <option value="">{form.location ? 'Select Area' : 'Select city first'}</option>
                                    {form.location && LOCATION_AREAS[form.location]?.map(area => (
                                        <option key={area} value={area}>{area}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="aj-input-wrapper">
                            <label className="aj-label">⏰ Employment Type *</label>
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
                            <div className="aj-input-wrapper mt-3">
                                <label className="aj-label">🏠 Job Role Type</label>
                                <select className="aj-select" name="jobRoleType" value={form.jobRoleType} onChange={handleChange}>
                                    {JOB_ROLE_TYPES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ 6: EXPERIENCES ═══ */}
                <div className="aj-section-group">
                    <div className="aj-section-header">
                        <FiBriefcase className="aj-section-icon" />
                        <div>
                            <h3>Work Experience</h3>
                            <p className="aj-section-desc">💼 How much experience is required?</p>
                        </div>
                    </div>
                    <div className="aj-input-wrapper">
                        <label className="aj-label">Experience Required *</label>
                        <select className="aj-select" name="experience" value={form.experience} onChange={handleChange} required>
                            {EXPERIENCE_LEVELS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                </div>

                {/* ═══ 7: SKILLS ═══ */}
                <div className="aj-section-group">
                    <div className="aj-section-header">
                        <FiCheck className="aj-section-icon" />
                        <div>
                            <h3>Required Skills</h3>
                            <p className="aj-section-desc">⚡ Special skills or tools knowledge</p>
                        </div>
                    </div>
                    <div className="aj-skill-section">
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

                {/* ═══ 8: SALARY ═══ */}
                <div className="aj-section-group">
                    <div className="aj-section-header">
                        <FiCreditCard className="aj-section-icon" />
                        <div>
                            <h3>Salary Details</h3>
                            <p className="aj-section-desc">💰 Compensation and incentive structure</p>
                        </div>
                    </div>
                    <div className="aj-salary-cards">
                        <div className="aj-salary-card aj-salary-min">
                            <div className="aj-salary-card-icon">📉</div>
                            <div className="aj-salary-card-content">
                                <div className="aj-salary-card-title">Minimum Salary</div>
                                <div className="aj-salary-card-hint">Lowest salary offered</div>
                                <div className="aj-salary-input-wrap">
                                    <span className="aj-salary-prefix">₹</span>
                                    <input className="aj-salary-input" name="salaryMin" value={form.salaryMin} onChange={handleChange} placeholder="e.g. 2.5" />
                                    <span className="aj-salary-suffix">LPA</span>
                                </div>
                            </div>
                            <div className="aj-salary-card-glow aj-glow-blue"></div>
                        </div>
                        <div className="aj-salary-card aj-salary-max">
                            <div className="aj-salary-card-icon">📈</div>
                            <div className="aj-salary-card-content">
                                <div className="aj-salary-card-title">Maximum Salary</div>
                                <div className="aj-salary-card-hint">Highest salary offered</div>
                                <div className="aj-salary-input-wrap">
                                    <span className="aj-salary-prefix">₹</span>
                                    <input className="aj-salary-input" name="salaryMax" value={form.salaryMax} onChange={handleChange} placeholder="e.g. 5.0" />
                                    <span className="aj-salary-suffix">LPA</span>
                                </div>
                            </div>
                            <div className="aj-salary-card-glow aj-glow-purple"></div>
                        </div>
                        <div className="aj-salary-card aj-salary-commission">
                            <div className="aj-salary-card-icon">🤝</div>
                            <div className="aj-salary-card-content">
                                <div className="aj-salary-card-title">Commission</div>
                                <div className="aj-salary-card-hint">Extra benefits on sales</div>
                                <div className="aj-salary-input-wrap">
                                    <select className="aj-select" name="commission" value={form.commission} onChange={handleChange}
                                        style={{ border: 'none', background: 'transparent', boxShadow: 'none', padding: '8px 0', fontSize: '13px', fontWeight: '700' }}>
                                        {COMMISSION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="aj-salary-card-glow aj-glow-green"></div>
                        </div>
                    </div>
                    {(form.salaryMin || form.salaryMax) && (
                        <div className="aj-salary-preview mt-3">
                            <span className="aj-salary-preview-label">👁️ Preview:</span>
                            <span className="aj-salary-preview-value">
                                {(form.salaryMin || form.salaryMax) && `Range: ₹${form.salaryMin || '?'} - ₹${form.salaryMax || '?'} LPA`}
                                {form.commission && ` + ${form.commission} (Commission)`}
                            </span>
                        </div>
                    )}
                </div>

                {/* ═══ 9: TARGETS & BENEFITS ═══ */}
                <div className="aj-section-group">
                    <div className="aj-section-header">
                        <FiTarget className="aj-section-icon" />
                        <div>
                            <h3>Targets & Benefits</h3>
                            <p className="aj-section-desc">🎯 What goals and perks come with this job?</p>
                        </div>
                    </div>
                    <div className="aj-grid-2">
                        <div className="aj-input-wrapper">
                            <label className="aj-label">Sales Targets</label>
                            <div className="aj-radio-group">
                                {(CATEGORY_TARGETS[form.category] || CATEGORY_TARGETS['default']).map(t => (
                                    <label key={t} className="aj-radio-item">
                                        <input type="radio" name="salesTargets" value={t} checked={form.salesTargets === t} onChange={handleChange} />
                                        <span>{t}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="aj-input-wrapper">
                            <label className="aj-label">Additional Benefits</label>
                            <div className="aj-card-grid aj-card-grid-2">
                                {(CATEGORY_BENEFITS[form.category] || CATEGORY_BENEFITS['default']).map(b => (
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

                {/* ═══ 10: JOB DESCRIPTION ═══ */}
                <div className="aj-section-group">
                    <div className="aj-section-header">
                        <FiFileText className="aj-section-icon" />
                        <div>
                            <h3>Job Description</h3>
                            <p className="aj-section-desc">📄 Full details about duties and requirements</p>
                        </div>
                    </div>
                    <div className="aj-desc-wrapper">
                        <textarea
                            className="aj-textarea"
                            name="description" value={form.description} onChange={handleChange}
                            rows="8"
                            placeholder="Describe the job responsibilities and requirements..."
                        />
                        <div className="aj-word-count">
                            {form.description.trim().split(/\s+/).filter(Boolean).length} words
                        </div>
                    </div>
                </div>



                {/* ═══ FOOTER ACTIONS ═══ */}
                <div className="aj-footer">
                    <div className="aj-footer-left">
                        <button type="button" className="aj-btn aj-btn-outline" onClick={() => setShowPreview(true)}>
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
                    border-radius: 32px;
                    padding: 35px;
                    margin-bottom: 40px;
                    box-shadow: var(--nm-outset-sm);
                    position: relative;
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.8);
                    animation: sectionEntrance 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                    opacity: 0;
                }
                @keyframes sectionEntrance {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                .aj-section-group:nth-child(1) { animation-delay: 0.1s; }
                .aj-section-group:nth-child(2) { animation-delay: 0.2s; }
                .aj-section-group:nth-child(3) { animation-delay: 0.3s; }
                .aj-section-group:nth-child(4) { animation-delay: 0.4s; }
                .aj-section-group:nth-child(5) { animation-delay: 0.5s; }
                .aj-section-group:nth-child(6) { animation-delay: 0.6s; }

                .aj-section-group::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; height: 120px;
                    background: linear-gradient(to bottom, rgba(255,255,255,0.4), transparent);
                    pointer-events: none;
                }

                .aj-section-header {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 32px;
                    position: relative;
                    z-index: 1;
                }
                .aj-section-icon {
                    font-size: 22px;
                    color: var(--nm-accent);
                    background: var(--nm-bg);
                    padding: 14px;
                    border-radius: 18px;
                    box-shadow: var(--nm-outset-sm);
                    flex-shrink: 0;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.3s;
                }
                .aj-section-group:hover .aj-section-icon {
                    transform: rotate(-5deg) scale(1.1);
                    color: #fff;
                    background: var(--nm-accent);
                }
                .aj-section-header h3 {
                    font-size: 18px;
                    font-weight: 700;
                    margin: 0;
                    letter-spacing: -0.5px;
                    color: var(--nm-text);
                }
                .aj-section-desc {
                    font-size: 13px;
                    color: var(--nm-text-light);
                    margin: 4px 0 0 0;
                    font-weight: 400;
                    line-height: 1.4;
                }
                .aj-hint-inline {
                    font-weight: 400;
                    color: #a0aec0;
                    font-size: 12px;
                }

                /* ═══ SALARY CARDS ═══ */
                .aj-salary-section {
                    margin-top: 28px;
                    padding: 28px;
                    border-radius: 24px;
                    background: linear-gradient(135deg, rgba(79,70,229,0.03) 0%, rgba(16,185,129,0.03) 100%);
                    border: 2px dashed rgba(79,70,229,0.12);
                }
                .aj-salary-cards {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 20px;
                }
                .aj-salary-card {
                    position: relative;
                    padding: 24px;
                    border-radius: 20px;
                    background: rgba(255,255,255,0.7);
                    backdrop-filter: blur(10px);
                    border: 2px solid rgba(0,0,0,0.04);
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    overflow: hidden;
                    cursor: default;
                }
                .aj-salary-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.08);
                    border-color: rgba(79,70,229,0.15);
                }
                .aj-salary-card-icon {
                    font-size: 32px;
                    margin-bottom: 12px;
                    animation: aj-bounce 2s ease infinite;
                }
                @keyframes aj-bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }
                .aj-salary-card:hover .aj-salary-card-icon {
                    animation: aj-bounce 0.6s ease infinite;
                }
                .aj-salary-card-content { position: relative; z-index: 1; }
                .aj-salary-card-title {
                    font-size: 14px;
                    font-weight: 700;
                    color: #1a202c;
                    margin-bottom: 4px;
                }
                .aj-salary-card-hint {
                    font-size: 11px;
                    color: #94a3b8;
                    margin-bottom: 14px;
                    line-height: 1.3;
                }
                .aj-salary-input-wrap {
                    display: flex;
                    align-items: center;
                    background: rgba(255,255,255,0.8);
                    border: 2px solid rgba(0,0,0,0.06);
                    border-radius: 14px;
                    padding: 4px;
                    transition: all 0.3s;
                }
                .aj-salary-input-wrap:focus-within {
                    border-color: var(--nm-accent);
                    box-shadow: 0 0 0 4px rgba(79,70,229,0.1);
                }
                .aj-salary-prefix {
                    font-size: 16px;
                    font-weight: 700;
                    color: #64748b;
                    padding: 8px 4px 8px 12px;
                }
                .aj-salary-suffix {
                    font-size: 11px;
                    font-weight: 700;
                    color: #94a3b8;
                    padding: 8px 12px 8px 4px;
                    letter-spacing: 0.5px;
                }
                .aj-salary-input {
                    flex: 1;
                    border: none;
                    outline: none;
                    background: transparent;
                    font-size: 20px;
                    font-weight: 700;
                    color: #1a202c;
                    font-family: inherit;
                    padding: 8px 4px;
                    min-width: 0;
                }
                .aj-salary-input::placeholder {
                    color: #cbd5e1;
                    font-weight: 500;
                    font-size: 15px;
                }

                /* Card glow accents */
                .aj-salary-card-glow {
                    position: absolute;
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    filter: blur(40px);
                    opacity: 0.15;
                    top: -20px;
                    right: -20px;
                    transition: all 0.4s;
                }
                .aj-salary-card:hover .aj-salary-card-glow {
                    opacity: 0.3;
                    width: 130px;
                    height: 130px;
                }
                .aj-glow-green { background: #10b981; }
                .aj-glow-blue { background: #3b82f6; }
                .aj-glow-purple { background: #8b5cf6; }

                /* Commission & Incentive Cards */
                .aj-salary-commission {
                    background: linear-gradient(135deg, rgba(251,191,36,0.05), rgba(245,158,11,0.08));
                    border: 2px solid rgba(245,158,11,0.1);
                }
                .aj-salary-incentive {
                    background: linear-gradient(135deg, rgba(236,72,153,0.05), rgba(219,39,119,0.08));
                    border: 2px solid rgba(219,39,119,0.08);
                }

                /* Salary Preview Bar */
                .aj-salary-preview {
                    margin-top: 20px;
                    padding: 14px 22px;
                    border-radius: 16px;
                    background: linear-gradient(135deg, #4f46e5, #7c3aed);
                    color: #fff;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    animation: aj-slideUp 0.4s ease;
                }
                @keyframes aj-slideUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .aj-salary-preview-label {
                    font-size: 13px;
                    font-weight: 600;
                    opacity: 0.8;
                    white-space: nowrap;
                }
                .aj-salary-preview-value {
                    font-size: 14px;
                    font-weight: 700;
                }

                @media (max-width: 768px) {
                    .aj-salary-cards { grid-template-columns: 1fr; }
                }
                @media (min-width: 769px) and (max-width: 1024px) {
                    .aj-salary-cards { grid-template-columns: 1fr 1fr; }
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
                    padding: 16px 20px;
                    border-radius: 20px;
                    border: 1px solid transparent;
                    background: var(--nm-bg);
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: var(--nm-outset-sm);
                    user-select: none;
                }
                .aj-card-option:hover {
                    box-shadow: 8px 8px 16px var(--nm-dark), -8px -8px 16px var(--nm-light);
                    transform: translateY(-4px);
                    border-color: rgba(79, 70, 229, 0.1);
                }
                .aj-card-option:active {
                    box-shadow: var(--nm-inset-sm);
                    transform: translateY(-1px);
                }
                .aj-card-selected {
                    background: linear-gradient(135deg, #f8fafc, #ffffff) !important;
                    border-color: var(--nm-accent) !important;
                    box-shadow: var(--nm-inset-sm), 0 10px 20px rgba(79, 70, 229, 0.05) !important;
                }
                .aj-card-selected .aj-card-label { 
                    color: var(--nm-accent); 
                    font-weight: 700;
                }
                .aj-card-selected .aj-card-check {
                    color: var(--nm-accent);
                    filter: drop-shadow(0 0 5px rgba(79, 70, 229, 0.3));
                }

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
                    display: flex; flex-direction: column; gap: 14px;
                    padding: 12px;
                }
                .aj-radio-item {
                    display: flex; align-items: center; gap: 15px;
                    cursor: pointer; font-size: 14px; color: var(--nm-text);
                    padding: 12px 20px;
                    border-radius: 16px;
                    background: var(--nm-bg);
                    box-shadow: var(--nm-outset-sm);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid transparent;
                }
                .aj-radio-item:hover { 
                    transform: translateX(5px);
                    box-shadow: 6px 6px 12px var(--nm-dark);
                }
                .aj-radio-item input[type="radio"] {
                    width: 22px; height: 22px;
                    appearance: none;
                    background: var(--nm-bg);
                    box-shadow: var(--nm-inset-sm);
                    border-radius: 50%;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.3s;
                }
                .aj-radio-item input[type="radio"]:checked {
                    box-shadow: var(--nm-outset-sm);
                    background: var(--nm-accent);
                }
                .aj-radio-item input[type="radio"]:checked::after {
                    content: '';
                    position: absolute;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    width: 10px; height: 10px;
                    background: #fff;
                    border-radius: 50%;
                    box-shadow: 0 0 10px rgba(255,255,255,0.8);
                }
                .aj-radio-item:has(input:checked) {
                    border-color: rgba(79, 70, 229, 0.2);
                    background: rgba(79, 70, 229, 0.02);
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

                .aj-readonly {
                    cursor: not-allowed;
                    opacity: 0.8;
                    background-color: rgba(0,0,0,0.02);
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
                /* ── Preview Modal ── */
                .aj-preview-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.6); backdrop-filter: blur(8px);
                    z-index: 9999; display: flex; align-items: center; justify-content: center;
                    padding: 20px; animation: modalFadeIn 0.3s ease;
                }
                @keyframes modalFadeIn {
                    from { opacity: 0; } to { opacity: 1; }
                }
                .aj-preview-modal {
                    background: var(--nm-bg); width: 100%; max-width: 800px;
                    max-height: 90vh; border-radius: 32px; overflow-y: auto;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.3); position: relative;
                    padding: 40px; border: 1px solid rgba(255,255,255,0.8);
                }
                .aj-preview-close {
                    position: absolute; top: 20px; right: 20px;
                    width: 40px; height: 40px; border-radius: 50%;
                    background: var(--nm-bg); box-shadow: var(--nm-outset-sm);
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; color: #ef4444; border: none;
                }
                .aj-preview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 25px; }
                .aj-pre-item { margin-bottom: 20px; }
                .aj-pre-label { font-size: 11px; font-weight: 700; color: var(--nm-text-light); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; display: block; }
                .aj-pre-value { font-size: 16px; font-weight: 600; color: var(--nm-text); line-height: 1.5; }
                .aj-pre-tag { display: inline-block; padding: 4px 12px; border-radius: 50px; background: rgba(79,70,229,0.1); color: var(--nm-accent); font-size: 13px; font-weight: 600; margin: 4px; }
                .aj-pre-salary { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #fff; padding: 15px 25px; border-radius: 20px; display: inline-block; }
            `}</style>

            {/* ═══════ PREVIEW MODAL ═══════ */}
            {showPreview && (
                <div className="aj-preview-overlay" onClick={() => setShowPreview(false)}>
                    <div className="aj-preview-modal" onClick={e => e.stopPropagation()}>
                        <button className="aj-preview-close" onClick={() => setShowPreview(false)}><FiX size={20} /></button>

                        <div className="aj-section-header">
                            <FiEye className="aj-section-icon" />
                            <div>
                                <h3>Job Posting Preview</h3>
                                <p className="aj-section-desc">Review how the job details will appear</p>
                            </div>
                        </div>

                        <div className="aj-highlight-box" style={{ marginBottom: '30px' }}>
                            <div className="aj-pre-label">Job Role & Title</div>
                            <h2 style={{ margin: '4px 0', color: 'var(--nm-accent)', fontSize: '24px' }}>{form.title || "Untitled Position"}</h2>
                            <p style={{ margin: '8px 0 0 0', fontWeight: '600' }}>🏢 {form.company || "Company Not Selected"} • 📂 {form.category || "General"}</p>
                        </div>

                        <div className="aj-pre-salary">
                            <div className="aj-pre-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Offered Salary</div>
                            <div style={{ fontSize: '20px', fontWeight: '800' }}>
                                ₹{form.salaryMin || "?"} - ₹{form.salaryMax || "?"} LPA
                                {form.commission && <span style={{ fontSize: '14px', opacity: 0.9 }}> + {form.commission}</span>}
                            </div>
                        </div>

                        <div className="aj-preview-grid">
                            <div>
                                <div className="aj-pre-item">
                                    <span className="aj-pre-label">Location</span>
                                    <span className="aj-pre-value">📍 {form.location || "Not Set"} {form.preferredArea && `(${form.preferredArea})`}</span>
                                </div>
                                <div className="aj-pre-item">
                                    <span className="aj-pre-label">Employment Type</span>
                                    <span className="aj-pre-value">⏰ {form.type} ({form.jobRoleType || "Office Based"})</span>
                                </div>
                                <div className="aj-pre-item">
                                    <span className="aj-pre-label">Experience Required</span>
                                    <span className="aj-pre-value">💼 {form.experience || "Any"}</span>
                                </div>
                            </div>
                            <div>
                                <div className="aj-pre-item">
                                    <span className="aj-pre-label">Education</span>
                                    <div className="aj-pre-value">
                                        {form.qualification.length > 0 ? form.qualification.map(q => <span key={q} className="aj-pre-tag">{q}</span>) : "No specific requirements"}
                                    </div>
                                </div>
                                <div className="aj-pre-item">
                                    <span className="aj-pre-label">Languages</span>
                                    <div className="aj-pre-value">
                                        {form.languages.length > 0 ? form.languages.map(l => <span key={l} className="aj-pre-tag">{l.toUpperCase()}</span>) : "Any language"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '30px' }}>
                            <div className="aj-pre-label">Requirements & Perks</div>
                            <div className="aj-preview-grid" style={{ gridTemplateColumns: '1fr 1fr', background: 'rgba(0,0,0,0.02)', padding: '20px', borderRadius: '20px' }}>
                                <div>
                                    <div className="aj-pre-label" style={{ fontSize: '9px' }}>🎯 Target</div>
                                    <div className="aj-pre-value" style={{ fontSize: '14px' }}>{form.salesTargets || "Standard Performance"}</div>
                                </div>
                                <div>
                                    <div className="aj-pre-label" style={{ fontSize: '9px' }}>🎁 Benefits</div>
                                    <div className="aj-pre-value" style={{ fontSize: '14px' }}>
                                        {form.benefits.length > 0 ? form.benefits.join(", ") : "Standard benefits apply"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '30px' }}>
                            <div className="aj-pre-label">Required Skills</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {form.skills.length > 0 ? form.skills.map(s => <span key={s} className="aj-pre-tag" style={{ border: '1px solid var(--nm-accent)' }}>{s}</span>) : "No specific skills listed"}
                            </div>
                        </div>

                        <div style={{ marginTop: '30px', borderTop: '1px solid var(--nm-dark)', paddingTop: '20px' }}>
                            <div className="aj-pre-label">Detailed Job Description</div>
                            <div className="aj-pre-value" style={{ whiteSpace: 'pre-wrap', fontSize: '14px', fontStyle: 'italic', opacity: 0.8 }}>
                                {form.description || "No description provided."}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AddJobs;
