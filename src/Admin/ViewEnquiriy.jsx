import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiSearch, FiEdit2, FiTrash2, FiUser, FiSmartphone, FiMail, FiMessageSquare, FiX } from 'react-icons/fi';

const ViewEnquiry = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [filteredEnquiries, setFilteredEnquiries] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [showModal, setShowModal] = useState(false);

    // Form States
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [_id, setId] = useState("");

    // Fetch enquiries
    useEffect(() => {
        fetchEnquiries();
    }, []);

    // Search Filter Effect
    useEffect(() => {
        if (!enquiries) return;
        const results = enquiries.filter(enq =>
            (enq.name && enq.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (enq.email && enq.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (enq.mobile && String(enq.mobile).includes(searchTerm))
        );
        setFilteredEnquiries(results);
    }, [searchTerm, enquiries]);

    const fetchEnquiries = () => {
        axios.get(`https://rej-server.onrender.com/enquiries`)
            .then((res) => {
                setEnquiries(res.data);
                setFilteredEnquiries(res.data);
            })
            .catch((err) => console.log(err));
    };

    const deleteEnq = (enqId) => {
        if (window.confirm("Are you sure you want to delete this enquiry?")) {
            axios.delete(`https://rej-server.onrender.com/enquiries/${enqId}`)
                .then(() => {
                    fetchEnquiries();
                })
                .catch((err) => console.log(err));
        }
    };

    const getOneRecord = (enqId) => {
        axios.get(`https://rej-server.onrender.com/enquiries/${enqId}`)
            .then((res) => {
                setName(res.data.name);
                setMobile(res.data.mobile);
                setEmail(res.data.email);
                setMessage(res.data.message);
                setId(res.data._id);
                setShowModal(true); // Open modal manually
            })
            .catch((err) => console.log(err));
    };

    const closeModal = () => {
        setShowModal(false);
        // Optional: clear form
    }

    const updateEnq = (e) => {
        e.preventDefault();
        axios.put(`https://rej-server.onrender.com/enquiries/${_id}`, {
            name,
            mobile,
            email,
            message
        })
            .then(() => {
                alert("Enquiry updated successfully");
                setShowModal(false);
                fetchEnquiries();
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="animate-fade-in">
            {/* Header Section */}
            <div className="dash-section-title mb-4">
                <div>
                    <h2 className="mb-1" style={{ fontSize: '24px', fontWeight: 'bold' }}>Enquiries</h2>
                    <p className="text-muted m-0" style={{ fontSize: '14px' }}>Manage customer Poppinsactions and support requests</p>
                </div>

                {/* Search Bar */}
                <div className="position-relative">
                    <FiSearch className="position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Search by name, email..."
                        className="premium-input ps-5"
                        style={{ width: '300px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Card */}
            <div className="dash-card p-0 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="py-3 ps-4 text-muted fw-semibold" style={{ fontSize: '13px' }}>USER DETAILS</th>
                                <th className="py-3 text-muted fw-semibold" style={{ fontSize: '13px' }}>CONTACT INFO</th>
                                <th className="py-3 text-muted fw-semibold" style={{ fontSize: '13px' }}>MESSAGE</th>
                                <th className="py-3 text-end pe-4 text-muted fw-semibold" style={{ fontSize: '13px' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEnquiries && filteredEnquiries.length > 0 ? (
                                filteredEnquiries.map((enq, index) => (
                                    <tr key={enq._id || index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td className="ps-4 py-3">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="rounded-circle bg-light d-flex align-items-center justify-content-center text-primary fw-bold"
                                                    style={{ width: '40px', height: '40px', fontSize: '18px' }}>
                                                    {enq.name && enq.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h6 className="mb-0 fw-semibold text-dark">{enq.name}</h6>
                                                    <small className="text-muted">ID: #{enq._id}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <div className="d-flex flex-column gap-1">
                                                <div className="d-flex align-items-center gap-2 text-dark" style={{ fontSize: '14px' }}>
                                                    <FiMail className="text-muted" size={14} /> {enq.email}
                                                </div>
                                                <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '13px' }}>
                                                    <FiSmartphone size={14} /> {enq.mobile}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <p className="mb-0 text-muted text-truncate" style={{ maxWidth: '300px', fontSize: '14px' }}>
                                                {enq.message}
                                            </p>
                                        </td>
                                        <td className="text-end pe-4 py-3">
                                            <div className="d-flex gap-2 justify-content-end">
                                                <button
                                                    className="btn btn-light text-primary btn-sm d-flex align-items-center gap-2"
                                                    onClick={() => getOneRecord(enq._id)}
                                                    style={{ borderRadius: '8px', padding: '6px 12px' }}
                                                >
                                                    <FiEdit2 size={14} /> Edit
                                                </button>
                                                <button
                                                    className="btn btn-light text-danger btn-sm d-flex align-items-center gap-2"
                                                    onClick={() => deleteEnq(enq._id)}
                                                    style={{ borderRadius: '8px', padding: '6px 12px' }}
                                                >
                                                    <FiTrash2 size={14} /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-5 text-muted">
                                        <FiMessageSquare size={40} className="mb-3 opacity-25" />
                                        <p>No enquiries found matching "{searchTerm}"</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Custom Modal Implementation */}
            {showModal && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal-content">
                        <div className="modal-header border-bottom-0 p-4 pb-0 d-flex justify-content-between align-items-center">
                            <h5 className="modal-title fw-bold m-0">Update Enquiry</h5>
                            <button type="button" className="btn border-0 p-0" onClick={closeModal}>
                                <FiX size={24} className="text-muted" />
                            </button>
                        </div>
                        <div className="p-4 pt-3">
                            <form onSubmit={updateEnq} className="d-flex flex-column gap-3">
                                <div>
                                    <label className="form-label text-muted small fw-bold">FULL NAME</label>
                                    <div className="position-relative">
                                        <FiUser className="position-absolute text-muted" style={{ top: '14px', left: '12px' }} />
                                        <input
                                            name='name'
                                            value={name}
                                            className='premium-input ps-5'
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Full Name"
                                        />
                                    </div>
                                </div>

                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label text-muted small fw-bold">MOBILE</label>
                                        <div className="position-relative">
                                            <FiSmartphone className="position-absolute text-muted" style={{ top: '14px', left: '12px' }} />
                                            <input
                                                name='mobile'
                                                value={mobile}
                                                className='premium-input ps-5'
                                                onChange={(e) => setMobile(e.target.value)}
                                                placeholder="+1 234 567 890"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted small fw-bold">EMAIL</label>
                                        <div className="position-relative">
                                            <FiMail className="position-absolute text-muted" style={{ top: '14px', left: '12px' }} />
                                            <input
                                                name='email'
                                                value={email}
                                                className='premium-input ps-5'
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="form-label text-muted small fw-bold">MESSAGE</label>
                                    <div className="position-relative">
                                        <FiMessageSquare className="position-absolute text-muted" style={{ top: '14px', left: '12px' }} />
                                        <textarea
                                            name='message'
                                            value={message}
                                            className='premium-input ps-5'
                                            onChange={(e) => setMessage(e.target.value)}
                                            rows="4"
                                            placeholder="Enter message details..."
                                        />
                                    </div>
                                </div>

                                <button type='submit' className='premium-btn w-100 mt-2'>
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewEnquiry;
