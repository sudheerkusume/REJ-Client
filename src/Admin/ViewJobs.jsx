import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import AddJobs from "./AddJobs";
import {
    FiSearch, FiEdit3, FiTrash2, FiMapPin, FiBriefcase,
    FiChevronLeft, FiChevronRight, FiPlus, FiZap, FiX,
    FiUsers, FiPhone, FiDollarSign, FiStar,
    FiMonitor, FiTrendingUp, FiAward, FiGrid, FiLayers,
    FiHome, FiDatabase, FiShield, FiPenTool, FiCode,
    FiMoreVertical, FiEye, FiCheckCircle, FiClock
} from "react-icons/fi";

/* ─────── CATEGORY ICON MAP ─────── */
const CATEGORY_ICONS = {
    'Tele Caller': { icon: FiPhone, color: '#6366f1', bg: '#eef2ff', subtitle: 'Engage & Convert' },
    'Channel Partners': { icon: FiUsers, color: '#f59e0b', bg: '#fffbeb', subtitle: 'Collaborate & Earn' },
    'Real Estate Sales': { icon: FiHome, color: '#ef4444', bg: '#fef2f2', subtitle: 'Sell Property Faster' },
    'CRM Executive': { icon: FiDatabase, color: '#10b981', bg: '#ecfdf5', subtitle: 'Manage Client Relations' },
    'Digital Marketing': { icon: FiTrendingUp, color: '#8b5cf6', bg: '#f5f3ff', subtitle: 'Promote & Convert' },
    'HR & Operations': { icon: FiGrid, color: '#06b6d4', bg: '#ecfeff', subtitle: 'People & Process' },
    'Accounts & Auditing': { icon: FiShield, color: '#64748b', bg: '#f1f5f9', subtitle: 'Financial Clarity' },
    'Legal': { icon: FiAward, color: '#f43f5e', bg: '#fff1f2', subtitle: 'Deals & Compliance' },
    'Architects': { icon: FiPenTool, color: '#0ea5e9', bg: '#f0f9ff', subtitle: 'Design Smart Spaces' },
    'Web Development': { icon: FiCode, color: '#22c55e', bg: '#f0fdf4', subtitle: 'Build Real Estate Tech' },
};
const DEFAULT_CAT = { icon: FiBriefcase, color: '#6366f1', bg: '#eef2ff', subtitle: 'Browse Jobs' };


/* ═══════════════ EDIT JOB MODAL ═══════════════ */
const EditJobModal = ({ isOpen, onClose, jobData, onJobUpdated }) => {
    const [editData, setEditData] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isOpen && jobData) {
            setEditData({
                ...jobData,
                responsibilities: Array.isArray(jobData.responsibilities) ? jobData.responsibilities.join(', ') : (jobData.responsibilities || ''),
                skills: Array.isArray(jobData.skills) ? jobData.skills.join(', ') : (jobData.skills || '')
            });
        }
    }, [isOpen, jobData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const payload = {
                ...editData,
                responsibilities: editData.responsibilities ? editData.responsibilities.split(',').map(i => i.trim()).filter(Boolean) : [],
                skills: editData.skills ? editData.skills.split(',').map(i => i.trim()).filter(Boolean) : []
            };
            await axios.put(`https://rej-server.onrender.com/jobCategories/${editData._id}`, payload);
            alert("✅ Updated successfully");
            onJobUpdated?.();
            onClose();
        } catch (err) {
            alert("Update failed");
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="vj-modal-overlay" onClick={onClose}>
            <div className="vj-modal-content vj-modal-lg" onClick={e => e.stopPropagation()}>
                <div className="vj-modal-header">
                    <div>
                        <h5 className="fw-bold mb-0" style={{ color: '#0f172a', fontSize: '18px', letterSpacing: '-0.4px' }}>
                            <FiEdit3 size={17} style={{ marginRight: '8px', color: '#f59e0b' }} />
                            Edit Job
                        </h5>
                        <p className="mb-0" style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Update the job details below</p>
                    </div>
                    <button className="vj-modal-close" onClick={onClose}><FiX size={20} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="vj-modal-body">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="vj-label">Job Title *</label>
                                <input name="title" value={editData.title || ''} onChange={handleChange} className="vj-input" placeholder="Senior Sales Executive" required />
                            </div>
                            <div className="col-md-6">
                                <label className="vj-label">Company</label>
                                <input name="company" value={editData.company || ''} onChange={handleChange} className="vj-input" placeholder="Company" />
                            </div>
                            <div className="col-md-6">
                                <label className="vj-label">Category</label>
                                <input name="category" value={editData.category || ''} onChange={handleChange} className="vj-input" placeholder="Tele Caller, CRM Executive..." />
                            </div>
                            <div className="col-md-6">
                                <label className="vj-label">Location</label>
                                <input name="location" value={editData.location || ''} onChange={handleChange} className="vj-input" placeholder="Hyderabad, Mumbai..." />
                            </div>
                            <div className="col-md-6">
                                <label className="vj-label">Job Type *</label>
                                <input name="type" value={editData.type || ''} onChange={handleChange} className="vj-input" placeholder="Full Time / Remote" required />
                            </div>
                            <div className="col-md-6">
                                <label className="vj-label">Experience</label>
                                <input name="experience" value={editData.experience || ''} onChange={handleChange} className="vj-input" placeholder="1-3 years" />
                            </div>
                            <div className="col-md-6">
                                <label className="vj-label">Salary</label>
                                <input name="salary" value={editData.salary || ''} onChange={handleChange} className="vj-input" placeholder="₹25,000 - ₹40,000" />
                            </div>
                            <div className="col-md-6">
                                <label className="vj-label">Qualification</label>
                                <input name="qualification" value={editData.qualification || ''} onChange={handleChange} className="vj-input" placeholder="Graduate / MBA" />
                            </div>
                            <div className="col-12">
                                <label className="vj-label">Job Description</label>
                                <textarea name="description" rows="3" value={editData.description || ''} onChange={handleChange} className="vj-input" placeholder="Describe the role..." />
                            </div>
                            <div className="col-12">
                                <label className="vj-label">Responsibilities (comma separated)</label>
                                <input name="responsibilities" value={editData.responsibilities || ''} onChange={handleChange} className="vj-input" placeholder="Cold calling, Lead generation..." />
                            </div>
                            <div className="col-12">
                                <label className="vj-label">Skills (comma separated)</label>
                                <input name="skills" value={editData.skills || ''} onChange={handleChange} className="vj-input" placeholder="Communication, CRM, Excel..." />
                            </div>
                        </div>
                    </div>
                    <div className="vj-modal-footer">
                        <button type="button" className="vj-btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="vj-btn-edit" disabled={saving}>
                            {saving ? (
                                <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
                            ) : (
                                <><FiEdit3 size={15} className="me-1" /> Save Changes</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ═══════════════ DELETE CONFIRM MODAL ═══════════════ */
const DeleteConfirmModal = ({ isOpen, onClose, jobData, onConfirm }) => {
    const [deleting, setDeleting] = useState(false);

    if (!isOpen || !jobData) return null;

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await axios.delete(`https://rej-server.onrender.com/jobCategories/${jobData._id}`);
            alert("🗑️ Job deleted successfully");
            onConfirm?.();
            onClose();
        } catch (err) {
            alert("Delete failed");
            console.error(err);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="vj-modal-overlay" onClick={onClose}>
            <div className="vj-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
                <div style={{ padding: '28px', textAlign: 'center' }}>
                    {/* Warning Icon */}
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px', border: '4px solid #fee2e2'
                    }}>
                        <FiTrash2 size={26} style={{ color: '#ef4444' }} />
                    </div>

                    <h5 className="fw-bold mb-2" style={{ color: '#0f172a', fontSize: '18px', letterSpacing: '-0.3px' }}>Delete Job?</h5>
                    <p style={{ color: '#64748b', fontSize: '13px', fontWeight: 500, lineHeight: 1.6, margin: '0 0 8px' }}>
                        Are you sure you want to delete <strong style={{ color: '#0f172a' }}>"{jobData.title}"</strong>?
                    </p>
                    <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 500 }}>
                        This action cannot be undone. All data related to this job will be permanently removed.
                    </p>

                    <div className="d-flex gap-3 justify-content-center mt-4">
                        <button className="vj-btn-secondary" onClick={onClose} style={{ flex: 1, maxWidth: '160px' }}>
                            Cancel
                        </button>
                        <button className="vj-btn-danger" onClick={handleDelete} disabled={deleting} style={{ flex: 1, maxWidth: '160px' }}>
                            {deleting ? (
                                <><span className="spinner-border spinner-border-sm me-2"></span>Deleting...</>
                            ) : (
                                <><FiTrash2 size={14} className="me-1" /> Delete</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ═══════════════ MAIN VIEW JOBS ═══════════════ */
const ViewJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const scrollRef = useRef(null);

    // Fetch jobs
    const fetchJobs = async () => {
        try {
            const res = await axios.get("https://rej-server.onrender.com/jobCategories");
            setJobs(res.data || []);
        } catch (err) {
            console.error(err);
            setJobs([]);
        }
    };

    useEffect(() => { fetchJobs(); }, []);

    // Build categories with count
    const categoryCounts = {};
    jobs.forEach(j => {
        const cat = j.category || 'Other';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    const categoryList = Object.keys(categoryCounts);

    // Filter jobs
    const filteredJobs = jobs.filter(j => {
        const matchesCat = selectedCategory === "All" || j.category === selectedCategory;
        const matchesSearch =
            (j.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (j.company || "").toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCat && matchesSearch;
    });

    // Open edit modal
    const openEditModal = (job) => {
        setSelectedJob(job);
        setShowEditModal(true);
    };

    // Open delete modal
    const openDeleteModal = (job) => {
        setSelectedJob(job);
        setShowDeleteModal(true);
    };

    // Scroll category strip
    const scroll = (dir) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
        }
    };

    return (
        <div className="vj-root" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* ── CATEGORY STRIP ── */}
            <div className="vj-cat-strip-wrapper">
                <button className="vj-cat-scroll-btn vj-cat-scroll-left" onClick={() => scroll('left')}>
                    <FiChevronLeft size={18} />
                </button>

                <div className="vj-cat-strip" ref={scrollRef}>
                    {/* All */}
                    <div
                        className={`vj-cat-card ${selectedCategory === 'All' ? 'vj-cat-active' : ''}`}
                        onClick={() => setSelectedCategory('All')}
                    >
                        <div className="vj-cat-icon-wrap" style={{ background: '#eef2ff', color: '#6366f1' }}>
                            <FiLayers size={22} />
                        </div>
                        <span className="vj-cat-title">All Jobs</span>
                        <span className="vj-cat-subtitle">Browse All</span>
                        {jobs.length > 0 && <span className="vj-cat-badge" style={{ background: '#6366f1' }}>{jobs.length}</span>}
                    </div>

                    {categoryList.map((cat, idx) => {
                        const meta = CATEGORY_ICONS[cat] || DEFAULT_CAT;
                        const IconComp = meta.icon;
                        const isActive = selectedCategory === cat;
                        return (
                            <div key={idx}
                                className={`vj-cat-card ${isActive ? 'vj-cat-active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                <div className="vj-cat-icon-wrap" style={{ background: meta.bg, color: meta.color }}>
                                    {meta.icon ? <IconComp size={22} /> : <FiBriefcase size={22} />}
                                </div>
                                <span className="vj-cat-title">{cat}</span>
                                <span className="vj-cat-subtitle">{meta.subtitle}</span>
                                {categoryCounts[cat] > 0 && (
                                    <span className="vj-cat-badge" style={{ background: meta.color }}>{categoryCounts[cat]}</span>
                                )}
                            </div>
                        );
                    })}
                </div>

                <button className="vj-cat-scroll-btn vj-cat-scroll-right" onClick={() => scroll('right')}>
                    <FiChevronRight size={18} />
                </button>
            </div>

            {/* ── HEADER ROW: Title + Actions ── */}
            <div className="vj-header-row">
                <div>
                    <h4 className="fw-bold mb-0" style={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
                        {selectedCategory === 'All' ? 'All Jobs' : `${selectedCategory} Jobs`}
                    </h4>
                    <p className="mb-0" style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>
                        {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
                        {selectedCategory !== 'All' && ` in ${selectedCategory} category`}
                    </p>
                </div>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                    {/* Search */}
                    <div className="vj-search-box">
                        <FiSearch size={15} className="vj-search-icon" />
                        <input
                            type="text" placeholder="Search jobs..."
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* Auto Create */}
                    <button className="vj-btn-auto">
                        <FiZap size={15} /> Auto Create Job
                    </button>
                    {/* Create Job button → opens modal */}
                    <button className="vj-btn-primary" onClick={() => setShowAddModal(true)}>
                        <FiPlus size={16} /> Create Job
                    </button>
                </div>
            </div>

            {/* ── JOB TABLE ── */}
            <div className="vj-table-card">
                <div className="table-responsive">
                    <table className="table vj-table mb-0">
                        <thead>
                            <tr>
                                <th style={{ width: '22%' }}>JOB DETAILS</th>
                                <th style={{ width: '16%' }}>LOCATION & EXPERIENCE</th>
                                <th style={{ width: '14%' }}>SALARY & COMMISSION</th>
                                <th style={{ width: '16%' }}>REQUIREMENTS</th>
                                <th style={{ width: '10%', textAlign: 'center' }}>APPLICATIONS</th>
                                <th style={{ width: '10%', textAlign: 'center' }}>STATUS</th>
                                <th style={{ width: '12%', textAlign: 'center' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredJobs.length > 0 ? (
                                filteredJobs.map(job => {
                                    const catMeta = CATEGORY_ICONS[job.category] || DEFAULT_CAT;
                                    return (
                                        <tr key={job._id} className="vj-table-row">
                                            {/* Job Details */}
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="vj-job-avatar" style={{ background: catMeta.bg, color: catMeta.color }}>
                                                        {job.image ? (
                                                            <img src={job.image} alt={job.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                                                        ) : (
                                                            <catMeta.icon size={18} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold" style={{ color: '#0f172a', fontSize: '14px' }}>{job.title}</div>
                                                        <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 500 }}>{job.company}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Location & Experience */}
                                            <td>
                                                <div className="d-flex align-items-center gap-1 mb-1" style={{ color: '#475569', fontSize: '13px' }}>
                                                    <FiMapPin size={13} style={{ color: '#94a3b8' }} /> {job.location || 'Not specified'}
                                                </div>
                                                <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 500 }}>
                                                    {job.experience || 'Any experience'}
                                                </div>
                                            </td>
                                            {/* Salary & Commission */}
                                            <td>
                                                <div style={{ color: '#0f172a', fontSize: '13px', fontWeight: 600 }}>
                                                    {job.salary || 'Not specified'}
                                                </div>
                                                <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 500 }}>
                                                    {job.type || 'N/A'}
                                                </div>
                                            </td>
                                            {/* Requirements */}
                                            <td>
                                                <div className="d-flex gap-1 flex-wrap">
                                                    {(job.skills && Array.isArray(job.skills) ? job.skills.slice(0, 3) :
                                                        (job.qualification ? [job.qualification] : ['General'])
                                                    ).map((skill, si) => (
                                                        <span key={si} className="vj-skill-tag">{skill}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            {/* Applications */}
                                            <td className="text-center">
                                                <span className="vj-app-count">{Math.floor(Math.random() * 10 + 1)}</span>
                                            </td>
                                            {/* Status */}
                                            <td className="text-center">
                                                <span className="vj-status-badge vj-status-active">
                                                    <FiCheckCircle size={11} /> Active
                                                </span>
                                            </td>
                                            {/* Actions */}
                                            <td className="text-center">
                                                <div className="d-flex justify-content-center gap-2">
                                                    <button className="vj-action-btn vj-action-view" title="View"><FiEye size={15} /></button>
                                                    <button className="vj-action-btn vj-action-edit" title="Edit"
                                                        onClick={() => openEditModal(job)}>
                                                        <FiEdit3 size={15} />
                                                    </button>
                                                    <button className="vj-action-btn vj-action-delete" title="Delete"
                                                        onClick={() => openDeleteModal(job)}>
                                                        <FiTrash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-5">
                                        <div className="d-flex flex-column align-items-center" style={{ color: '#94a3b8' }}>
                                            <FiSearch size={32} className="mb-2 opacity-50" />
                                            <p className="mb-0 fw-500">No jobs found matching your criteria</p>
                                            <button className="vj-btn-primary mt-3" style={{ fontSize: '13px', padding: '8px 20px' }}
                                                onClick={() => setShowAddModal(true)}>
                                                <FiPlus size={14} /> Create First Job
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── ADD JOB MODAL (renders actual AddJobs.jsx) ── */}
            {showAddModal && (
                <div className="vj-modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="vj-modal-content vj-modal-lg" onClick={e => e.stopPropagation()}>
                        <div className="vj-modal-header">
                            <div>
                                <h5 className="fw-bold mb-0" style={{ color: '#0f172a', fontSize: '18px', letterSpacing: '-0.4px' }}>
                                    <FiPlus size={18} style={{ marginRight: '8px', color: '#6366f1' }} />
                                    Create New Job
                                </h5>
                                <p className="mb-0" style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Fill in the details to publish a new job posting</p>
                            </div>
                            <button className="vj-modal-close" onClick={() => setShowAddModal(false)}><FiX size={20} /></button>
                        </div>
                        <div className="vj-modal-body">
                            <AddJobs
                                onJobAdded={fetchJobs}
                                onClose={() => setShowAddModal(false)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ── EDIT JOB MODAL ── */}
            <EditJobModal
                isOpen={showEditModal}
                onClose={() => { setShowEditModal(false); setSelectedJob(null); }}
                jobData={selectedJob}
                onJobUpdated={fetchJobs}
            />

            {/* ── DELETE CONFIRM MODAL ── */}
            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => { setShowDeleteModal(false); setSelectedJob(null); }}
                jobData={selectedJob}
                onConfirm={fetchJobs}
            />

            {/* ── STYLES ── */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

                .vj-root { padding: 24px 28px; background: #f8fafc; min-height: 100vh; }
                .vj-root * { box-sizing: border-box; }

                /* ── Category Strip ── */
                .vj-cat-strip-wrapper {
                    position: relative;
                    margin-bottom: 28px;
                }
                .vj-cat-strip {
                    display: flex;
                    gap: 12px;
                    overflow-x: auto;
                    scroll-behavior: smooth;
                    padding: 6px 40px 6px 40px;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                .vj-cat-strip::-webkit-scrollbar { display: none; }

                .vj-cat-scroll-btn {
                    position: absolute; top: 50%; transform: translateY(-50%);
                    width: 34px; height: 34px; border-radius: 50%;
                    background: #fff; border: 1px solid #e2e8f0;
                    display: flex; align-items: center; justify-content: center;
                    color: #475569; cursor: pointer; z-index: 10;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                    transition: all 0.2s ease;
                }
                .vj-cat-scroll-btn:hover {
                    background: #6366f1; color: #fff; border-color: #6366f1;
                    box-shadow: 0 4px 12px rgba(99,102,241,0.3);
                }
                .vj-cat-scroll-left { left: 0; }
                .vj-cat-scroll-right { right: 0; }

                .vj-cat-card {
                    flex-shrink: 0;
                    width: 120px;
                    padding: 18px 12px 14px;
                    border-radius: 16px;
                    border: 2px solid #f1f5f9;
                    background: #fff;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }
                .vj-cat-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 20px -4px rgba(0,0,0,0.08);
                    border-color: #e0e7ff;
                }
                .vj-cat-active {
                    background: linear-gradient(135deg, #eef2ff, #e0e7ff) !important;
                    border-color: #6366f1 !important;
                    box-shadow: 0 8px 20px -4px rgba(99,102,241,0.2) !important;
                }

                .vj-cat-icon-wrap {
                    width: 48px; height: 48px; border-radius: 14px;
                    display: flex; align-items: center; justify-content: center;
                    margin: 0 auto 8px;
                    transition: transform 0.3s ease;
                }
                .vj-cat-card:hover .vj-cat-icon-wrap { transform: scale(1.08); }

                .vj-cat-title {
                    display: block; font-size: 12px; font-weight: 700;
                    color: #0f172a; line-height: 1.2;
                    margin-bottom: 2px;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }
                .vj-cat-subtitle {
                    display: block; font-size: 10px; font-weight: 500;
                    color: #94a3b8; line-height: 1.2;
                }
                .vj-cat-badge {
                    position: absolute; top: 8px; right: 8px;
                    min-width: 20px; height: 20px;
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 10px; font-weight: 700; color: #fff;
                    padding: 0 6px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                }

                /* ── Header Row ── */
                .vj-header-row {
                    display: flex; justify-content: space-between; align-items: center;
                    margin-bottom: 20px; flex-wrap: wrap; gap: 16px;
                }

                /* ── Search ── */
                .vj-search-box {
                    position: relative;
                    width: 220px;
                }
                .vj-search-box input {
                    width: 100%; padding: 9px 12px 9px 38px;
                    border: 1px solid #e2e8f0; border-radius: 12px;
                    font-size: 13px; font-weight: 500; color: #334155;
                    background: #fff; outline: none;
                    transition: all 0.2s ease;
                    font-family: inherit;
                }
                .vj-search-box input:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
                }
                .vj-search-icon {
                    position: absolute; left: 12px; top: 50%;
                    transform: translateY(-50%); color: #94a3b8;
                }

                /* ── Buttons ── */
                .vj-btn-primary {
                    display: inline-flex; align-items: center; gap: 6px;
                    padding: 10px 20px; border-radius: 12px;
                    background: linear-gradient(135deg, #6366f1, #818cf8);
                    color: #fff; font-size: 13px; font-weight: 600;
                    border: none; cursor: pointer;
                    box-shadow: 0 4px 12px rgba(99,102,241,0.3);
                    transition: all 0.2s ease;
                    font-family: inherit;
                }
                .vj-btn-primary:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 16px rgba(99,102,241,0.4);
                }
                .vj-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

                .vj-btn-auto {
                    display: inline-flex; align-items: center; gap: 6px;
                    padding: 10px 20px; border-radius: 12px;
                    background: linear-gradient(135deg, #f59e0b, #fbbf24);
                    color: #fff; font-size: 13px; font-weight: 600;
                    border: none; cursor: pointer;
                    box-shadow: 0 4px 12px rgba(245,158,11,0.3);
                    transition: all 0.2s ease;
                    font-family: inherit;
                }
                .vj-btn-auto:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 16px rgba(245,158,11,0.4);
                }

                .vj-btn-secondary {
                    padding: 10px 20px; border-radius: 12px;
                    background: #f1f5f9; color: #475569;
                    font-size: 13px; font-weight: 600;
                    border: 1px solid #e2e8f0; cursor: pointer;
                    transition: all 0.2s ease;
                    font-family: inherit;
                }
                .vj-btn-secondary:hover { background: #e2e8f0; }

                /* ── Table ── */
                .vj-table-card {
                    background: #fff;
                    border-radius: 20px;
                    border: 1px solid #f1f5f9;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
                    overflow: hidden;
                }
                .vj-table {
                    width: 100%;
                }
                .vj-table thead th {
                    background: #fafbfc;
                    border-bottom: 1px solid #f1f5f9;
                    padding: 14px 18px;
                    font-size: 11px; font-weight: 700;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    white-space: nowrap;
                }
                .vj-table tbody td {
                    padding: 16px 18px;
                    border-bottom: 1px solid #f8fafc;
                    vertical-align: middle;
                }
                .vj-table-row {
                    transition: background 0.15s ease;
                }
                .vj-table-row:hover {
                    background: #fafbfc;
                }
                .vj-table-row:last-child td {
                    border-bottom: none;
                }

                .vj-job-avatar {
                    width: 42px; height: 42px; border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                }

                .vj-skill-tag {
                    padding: 3px 8px; border-radius: 6px;
                    font-size: 10px; font-weight: 600;
                    background: #f1f5f9; color: #475569;
                    white-space: nowrap;
                }

                .vj-app-count {
                    display: inline-flex; align-items: center; justify-content: center;
                    min-width: 28px; height: 28px;
                    border-radius: 8px;
                    background: #eef2ff; color: #6366f1;
                    font-size: 13px; font-weight: 700;
                    padding: 0 6px;
                }

                .vj-status-badge {
                    display: inline-flex; align-items: center; gap: 4px;
                    padding: 4px 10px; border-radius: 8px;
                    font-size: 11px; font-weight: 600;
                }
                .vj-status-active {
                    background: #ecfdf5; color: #059669;
                }
                .vj-status-closed {
                    background: #fef2f2; color: #dc2626;
                }

                /* ── Action Buttons ── */
                .vj-action-btn {
                    width: 34px; height: 34px; border-radius: 10px;
                    border: 1px solid #e2e8f0; background: #fff;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; transition: all 0.2s ease;
                    color: #64748b;
                }
                .vj-action-view:hover { background: #eef2ff; color: #6366f1; border-color: #c7d2fe; }
                .vj-action-edit:hover { background: #fffbeb; color: #f59e0b; border-color: #fde68a; }
                .vj-action-delete:hover { background: #fef2f2; color: #ef4444; border-color: #fecaca; }

                /* ── Modal ── */
                .vj-modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(15, 23, 42, 0.5);
                    backdrop-filter: blur(4px);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 9999;
                    animation: vjFadeIn 0.2s ease;
                }
                .vj-modal-content {
                    background: #fff;
                    border-radius: 24px;
                    width: 90%;
                    max-width: 680px;
                    max-height: 85vh;
                    display: flex; flex-direction: column;
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.2);
                    animation: vjSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .vj-modal-lg { max-width: 720px; }
                .vj-modal-header {
                    display: flex; justify-content: space-between; align-items: flex-start;
                    padding: 24px 28px 16px;
                    border-bottom: 1px solid #f1f5f9;
                }
                .vj-modal-close {
                    width: 36px; height: 36px; border-radius: 10px;
                    border: 1px solid #e2e8f0; background: #f8fafc;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; color: #64748b; transition: all 0.2s ease;
                }
                .vj-modal-close:hover { background: #fef2f2; color: #ef4444; border-color: #fecaca; }
                .vj-modal-body {
                    padding: 20px 28px;
                    overflow-y: auto;
                    flex: 1;
                }
                .vj-modal-footer {
                    padding: 16px 28px 24px;
                    border-top: 1px solid #f1f5f9;
                    display: flex; justify-content: flex-end; gap: 10px;
                }

                /* ── Form Elements ── */
                .vj-label {
                    display: block;
                    font-size: 12px; font-weight: 600;
                    color: #64748b; margin-bottom: 6px;
                    letter-spacing: 0.2px;
                }
                .vj-input {
                    width: 100%;
                    padding: 10px 14px;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 13px; font-weight: 500;
                    color: #334155;
                    background: #fff;
                    outline: none;
                    transition: all 0.2s ease;
                    font-family: inherit;
                    resize: vertical;
                }
                .vj-input:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
                }
                .vj-input::placeholder { color: #cbd5e1; }

                .fw-500 { font-weight: 500; }

                .vj-btn-edit {
                    display: inline-flex; align-items: center; gap: 6px;
                    padding: 10px 20px; border-radius: 12px;
                    background: linear-gradient(135deg, #f59e0b, #fbbf24);
                    color: #fff; font-size: 13px; font-weight: 600;
                    border: none; cursor: pointer;
                    box-shadow: 0 4px 12px rgba(245,158,11,0.3);
                    transition: all 0.2s ease;
                    font-family: inherit;
                }
                .vj-btn-edit:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 16px rgba(245,158,11,0.4);
                }
                .vj-btn-edit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

                .vj-btn-danger {
                    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
                    padding: 10px 20px; border-radius: 12px;
                    background: linear-gradient(135deg, #ef4444, #f87171);
                    color: #fff; font-size: 13px; font-weight: 600;
                    border: none; cursor: pointer;
                    box-shadow: 0 4px 12px rgba(239,68,68,0.3);
                    transition: all 0.2s ease;
                    font-family: inherit;
                }
                .vj-btn-danger:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 16px rgba(239,68,68,0.4);
                }
                .vj-btn-danger:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

                /* ── Animations ── */
                @keyframes vjFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes vjSlideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.96); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }

                /* ── Scrollbar ── */
                .vj-root ::-webkit-scrollbar { width: 5px; height: 5px; }
                .vj-root ::-webkit-scrollbar-track { background: transparent; }
                .vj-root ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 20px; }
                .vj-root ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }

                /* ── Responsive ── */
                @media (max-width: 768px) {
                    .vj-root { padding: 16px; }
                    .vj-header-row { flex-direction: column; align-items: flex-start; }
                    .vj-search-box { width: 100%; }
                    .vj-cat-card { width: 100px; padding: 14px 8px 10px; }
                    .vj-cat-icon-wrap { width: 40px; height: 40px; }
                    .vj-modal-content { width: 95%; max-height: 90vh; }
                }
            `}</style>
        </div>
    );
};

export default ViewJobs;
