import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    BsBuilding,
    BsCash,
    BsGeoAlt,
    BsPlusCircle,
    BsTrash,
    BsUpload,
    BsCardText,
    BsLink45Deg,
    BsCalendarCheck,
    BsListStars,
    BsQuestionCircle,
    BsCheckCircleFill
} from "react-icons/bs";

const API_BASE_URL = "https://rej-server.onrender.com"; // Change to http://localhost:5000 for local testing

const Projects = () => {
    const [formData, setFormData] = useState({
        companyId: "",
        title: "",
        subtitle: "",
        description: "",
        price: "",
        completion: "",
        paymentPlan: "",
        apartments: "",
        bedrooms: "",
        location: "",
        locationDescription: "",
        mapEmbedLink: "",
        virtualTourLink: ""
    });

    const [companies, setCompanies] = useState([]);
    const [heroVideo, setHeroVideo] = useState(null);
    const [backgroundImages, setBackgroundImages] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [amenitiesGallery, setAmenitiesGallery] = useState([]);
    const [amenitiesBackground, setAmenitiesBackground] = useState(null);
    const [amenities, setAmenities] = useState([""]);
    const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);
    const [brochure, setBrochure] = useState(null);
    const [connectivity, setConnectivity] = useState([
        { label: "", value: "", iconType: "default" }
    ]);
    // Helper to handle multiple file selection (append instead of replace)
    const handleFileAppend = (e, setter, currentFiles) => {
        const selectedFiles = Array.from(e.target.files);
        setter([...currentFiles, ...selectedFiles]);
    };

    const removeFile = (index, setter, currentFiles) => {
        setter(currentFiles.filter((_, i) => i !== index));
    };

    const addConnectivity = () => setConnectivity([...connectivity, { label: "", value: "", iconType: "default" }]);
    const removeConnectivity = (index) => setConnectivity(connectivity.filter((_, i) => i !== index));
    const handleConnectivityChange = (index, field, value) => {
        const updated = [...connectivity];
        updated[index][field] = value;
        setConnectivity(updated);
    };

    // Fetch Companies
    useEffect(() => {
        axios.get(`${API_BASE_URL}/companies`)
            .then(res => {
                // Ensure res.data is an array
                if (Array.isArray(res.data)) {
                    setCompanies(res.data);
                } else {
                    console.warn("Expected companies array, got:", res.data);
                    setCompanies([]);
                }
            })
            .catch(err => console.error("Error fetching companies:", err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addAmenity = () => setAmenities([...amenities, ""]);
    const removeAmenity = (index) => setAmenities(amenities.filter((_, i) => i !== index));
    const handleAmenityChange = (index, value) => {
        const updated = [...amenities];
        updated[index] = value;
        setAmenities(updated);
    };

    const addFaq = () => setFaqs([...faqs, { question: "", answer: "" }]);
    const removeFaq = (index) => setFaqs(faqs.filter((_, i) => i !== index));
    const handleFaqChange = (index, field, value) => {
        const updated = [...faqs];
        updated[index][field] = value;
        setFaqs(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            data.append("amenities", JSON.stringify(amenities.filter(a => a.trim() !== "")));
            data.append("faqs", JSON.stringify(faqs.filter(f => f.question.trim() !== "")));
            data.append("connectivity", JSON.stringify(connectivity.filter(c => c.label.trim() !== "")));

            if (heroVideo) data.append("heroVideo", heroVideo);
            if (brochure) data.append("brochure", brochure);
            if (amenitiesBackground) data.append("amenitiesBackground", amenitiesBackground);
            backgroundImages.forEach(img => data.append("backgroundImages", img));
            gallery.forEach(img => data.append("gallery", img));
            amenitiesGallery.forEach(img => data.append("amenitiesGallery", img));

            const token = localStorage.getItem("adminToken");
            const response = await axios.post(`${API_BASE_URL}/projects`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            });

            alert("Success! The project has been added. 🌟");
            window.location.reload();

        } catch (err) {
            console.error("Error adding project:", err);
            const data = err.response?.data;
            const errorMsg = data?.message || "Something went wrong.";
            const detailMsg = data?.error ? `\n\nDetail: ${data.error}` : ""; // Show the specific Cloudinary error

            alert(`Error adding project: ${errorMsg}${detailMsg}\n\nPlease check your file sizes and Cloudinary settings.`);
        }
    };

    const stepIconStyle = {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '18px'
    };

    return (
        <div className="container py-5" style={{ maxWidth: '900px' }}>
            {/* Header Section */}
            <div className="text-center mb-5 pb-3">
                <h1 className="fw-bold text-primary mb-2">Publish New Property</h1>
                <p className="text-muted fs-5">Fill in the details below to add a new project to the website.</p>
            </div>

            <form onSubmit={handleSubmit}>

                {/* STEP 1: WHO IS BUILDING IT? */}
                <div className="card shadow-sm border-0 mb-5 rounded-4 overflow-hidden">
                    <div className="p-4 bg-white border-bottom d-flex align-items-center gap-3">
                        <div className="bg-primary text-white shadow-sm" style={stepIconStyle}>1</div>
                        <h4 className="mb-0 fw-bold">Select Developer & Title</h4>
                    </div>
                    <div className="card-body p-4">
                        <div className="row g-4">
                            <div className="col-12">
                                <label className="form-label fw-bold text-secondary mb-1">Which company is building this? *</label>
                                <select name="companyId" className="form-select form-select-lg border-2" value={formData.companyId} onChange={handleChange} required>
                                    <option value="">-- Click to choose a company --</option>
                                    {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold text-secondary mb-1">What is the Project Name? *</label>
                                <input className="form-control form-control-lg border-2" name="title" placeholder="e.g. Skyline Apartments" value={formData.title} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold text-secondary mb-1">Area / Location Sub-title</label>
                                <input className="form-control form-control-lg border-2" name="subtitle" placeholder="e.g. Near Dubai Mall" value={formData.subtitle} onChange={handleChange} />
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-bold text-secondary mb-1">Write a description (About the project) *</label>
                                <textarea className="form-control border-2" name="description" rows="4" placeholder="Tell people why they should buy this property..." value={formData.description} onChange={handleChange} required />
                            </div>
                        </div>
                    </div>
                </div>

                {/* STEP 2: PRICE & SPECS */}
                <div className="card shadow-sm border-0 mb-5 rounded-4 overflow-hidden">
                    <div className="p-4 bg-white border-bottom d-flex align-items-center gap-3">
                        <div className="bg-info text-white shadow-sm" style={stepIconStyle}>2</div>
                        <h4 className="mb-0 fw-bold">Price & Details</h4>
                    </div>
                    <div className="card-body p-4">
                        <div className="row g-4">
                            <div className="col-md-6">
                                <label className="form-label fw-bold text-secondary mb-1">Starting Price (Money) *</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-2 fw-bold">₹ / INR</span>
                                    <input className="form-control form-control-lg border-2" name="price" placeholder="e.g. 500,000" value={formData.price} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold text-secondary mb-1">When will it be finished?</label>
                                <input className="form-control form-control-lg border-2" name="completion" placeholder="e.g. Mid-2027" value={formData.completion} onChange={handleChange} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold text-secondary mb-1">How many Bedrooms?</label>
                                <input className="form-control form-control-lg border-2" name="bedrooms" placeholder="e.g. 1 & 2 Bedrooms" value={formData.bedrooms} onChange={handleChange} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold text-secondary mb-1">How big is the home? (Area)</label>
                                <input className="form-control form-control-lg border-2" name="apartments" placeholder="e.g. 800 - 1500 Sq.Ft" value={formData.apartments} onChange={handleChange} />
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-bold text-secondary mb-1">Explain the Payment Plan</label>
                                <input className="form-control form-control-lg border-2" name="paymentPlan" placeholder="e.g. Pay 1% every month" value={formData.paymentPlan} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* STEP 2.5: CONNECTIVITY & LANDMARKS */}
                <div className="card shadow-sm border-0 mb-5 rounded-4 overflow-hidden">
                    <div className="p-4 bg-white border-bottom d-flex align-items-center gap-3">
                        <div className="bg-dark text-white shadow-sm" style={stepIconStyle}>+</div>
                        <h4 className="mb-0 fw-bold">Connectivity & Landmarks</h4>
                    </div>
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="mb-0 fw-bold text-primary small text-uppercase tracking-wider">Nearby Locations & Distances</h5>
                            <button type="button" onClick={addConnectivity} className="btn btn-sm btn-outline-primary rounded-pill px-3">Add Landmark +</button>
                        </div>
                        <div className="row g-3">
                            {connectivity.map((item, i) => (
                                <div className="col-12" key={i}>
                                    <div className="p-3 border rounded-3 bg-light position-relative">
                                        <button type="button" className="btn btn-sm text-danger position-absolute top-0 end-0 m-2" onClick={() => removeConnectivity(i)}><BsTrash /></button>
                                        <div className="row g-3">
                                            <div className="col-md-4">
                                                <label className="form-label small fw-bold">Label (e.g. Metro Station)</label>
                                                <input className="form-control" placeholder="What is it?" value={item.label} onChange={(e) => handleConnectivityChange(i, "label", e.target.value)} />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label small fw-bold">Time (e.g. 5 Mins Drive)</label>
                                                <input className="form-control" placeholder="How far?" value={item.value} onChange={(e) => handleConnectivityChange(i, "value", e.target.value)} />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label small fw-bold">Icon Type</label>
                                                <select className="form-select" value={item.iconType} onChange={(e) => handleConnectivityChange(i, "iconType", e.target.value)}>
                                                    <option value="default">Default</option>
                                                    <option value="metro">Metro / Train</option>
                                                    <option value="mall">Shopping / Mall</option>
                                                    <option value="road">Road / Highway</option>
                                                    <option value="park">Park / Nature</option>
                                                    <option value="hospital">Hospital / Clinic</option>
                                                    <option value="airport">Airport</option>
                                                    <option value="school">School / Education</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* STEP 3: WHERE IS IT? */}
                <div className="card shadow-sm border-0 mb-5 rounded-4 overflow-hidden">
                    <div className="p-4 bg-white border-bottom d-flex align-items-center gap-3">
                        <div className="bg-success text-white shadow-sm" style={stepIconStyle}>3</div>
                        <h4 className="mb-0 fw-bold">Location & Map</h4>
                    </div>
                    <div className="card-body p-4">
                        <div className="row g-4">
                            <div className="col-12">
                                <label className="form-label fw-bold text-secondary mb-1">Final Location Name</label>
                                <input className="form-control form-control-lg border-2" name="location" placeholder="e.g. Downtown Dubai" value={formData.location} onChange={handleChange} />
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-bold text-secondary mb-1">Nearby Places (Location Advantages)</label>
                                <textarea className="form-control border-2" name="locationDescription" rows="2" placeholder="List top 3 nearby places..." value={formData.locationDescription} onChange={handleChange} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold text-secondary mb-1">Map Embed Code/Link</label>
                                <input className="form-control border-2 p-3" name="mapEmbedLink" placeholder="Paste map link here" value={formData.mapEmbedLink} onChange={handleChange} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold text-secondary mb-1">Youtube / 3D Tour Link</label>
                                <input className="form-control border-2 p-3" name="virtualTourLink" placeholder="Link to video or virtual tour" value={formData.virtualTourLink} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* STEP 4: VIDEOS & PHOTOS */}
                <div className="card shadow-sm border-0 mb-5 rounded-4 overflow-hidden">
                    <div className="p-4 bg-white border-bottom d-flex align-items-center gap-3">
                        <div className="bg-warning text-dark shadow-sm" style={stepIconStyle}>4</div>
                        <h4 className="mb-0 fw-bold">Upload Media Files</h4>
                    </div>
                    <div className="card-body p-4">
                        <div className="row g-4">
                            <div className="col-md-6">
                                <div className="p-4 border-2 border-dashed rounded-4 bg-light text-center">
                                    <BsUpload className="text-primary fs-2 mb-2" />
                                    <label className="fw-bold d-block mb-2">Main Header Video</label>
                                    <input type="file" className="form-control border-0 shadow-none" onChange={(e) => setHeroVideo(e.target.files[0])} />
                                    {heroVideo && <p className="mt-2 text-success small fw-bold">Ready: {heroVideo.name}</p>}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="p-4 border-2 border-dashed rounded-4 bg-light text-center h-100">
                                    <BsUpload className="text-info fs-2 mb-2" />
                                    <label className="fw-bold d-block mb-2">Features Background (Single)</label>
                                    <input type="file" className="form-control border-0 shadow-none" onChange={(e) => setAmenitiesBackground(e.target.files[0])} />
                                    {amenitiesBackground && <p className="mt-2 text-success small fw-bold">Ready: {amenitiesBackground.name}</p>}
                                </div>
                            </div>
                            {/* PARALLAX BACKGROUND IMAGES */}
                            <div className="col-12">
                                <label className="fw-bold d-block mb-3 text-secondary">Parallax Background Images (Scroll Effect)</label>
                                <div className="d-flex flex-wrap gap-3">
                                    {backgroundImages.map((file, index) => (
                                        <div key={index} className="position-relative" style={{ width: '120px', height: '120px' }}>
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="Preview"
                                                className="w-100 h-100 object-fit-cover rounded-3 border"
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle p-1 d-flex shadow-sm"
                                                onClick={() => removeFile(index, setBackgroundImages, backgroundImages)}
                                            >
                                                <BsTrash size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    <label
                                        className="d-flex flex-column align-items-center justify-content-center border-2 border-dashed rounded-3 bg-light cursor-pointer hover-bg-white transition-all mb-0"
                                        style={{ width: '120px', height: '120px', cursor: 'pointer', borderStyle: 'dashed' }}
                                    >
                                        <BsPlusCircle className="text-secondary fs-3 mb-1" />
                                        <span className="small text-muted fw-bold" style={{ fontSize: '10px' }}>Add Photo</span>
                                        <input
                                            type="file"
                                            multiple
                                            className="d-none"
                                            onChange={(e) => handleFileAppend(e, setBackgroundImages, backgroundImages)}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* GALLERY IMAGES */}
                            <div className="col-12">
                                <label className="fw-bold d-block mb-3 text-secondary">Multiple Project Photos (Gallery)</label>
                                <div className="d-flex flex-wrap gap-3">
                                    {gallery.map((file, index) => (
                                        <div key={index} className="position-relative" style={{ width: '120px', height: '120px' }}>
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="Gallery Preview"
                                                className="w-100 h-100 object-fit-cover rounded-3 border"
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle p-1 d-flex shadow-sm"
                                                onClick={() => removeFile(index, setGallery, gallery)}
                                            >
                                                <BsTrash size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    <label
                                        className="d-flex flex-column align-items-center justify-content-center border-2 border-dashed rounded-3 bg-light cursor-pointer hover-bg-white transition-all mb-0"
                                        style={{ width: '120px', height: '120px', cursor: 'pointer', borderStyle: 'dashed' }}
                                    >
                                        <BsPlusCircle className="text-secondary fs-3 mb-1" />
                                        <span className="small text-muted fw-bold" style={{ fontSize: '10px' }}>Add Photo</span>
                                        <input
                                            type="file"
                                            multiple
                                            className="d-none"
                                            onChange={(e) => handleFileAppend(e, setGallery, gallery)}
                                        />
                                    </label>
                                </div>
                                {gallery.length > 0 && <p className="mt-3 text-primary fw-bold small">{gallery.length} photos selected for gallery</p>}
                            </div>

                            {/* AMENITIES GALLERY IMAGES */}
                            <div className="col-12">
                                <label className="fw-bold d-block mb-3 text-secondary">Amenities Carousel Photos (Specific to Amenities Section)</label>
                                <div className="d-flex flex-wrap gap-3">
                                    {amenitiesGallery.map((file, index) => (
                                        <div key={index} className="position-relative" style={{ width: '120px', height: '120px' }}>
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="Amenities Preview"
                                                className="w-100 h-100 object-fit-cover rounded-3 border"
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle p-1 d-flex shadow-sm"
                                                onClick={() => removeFile(index, setAmenitiesGallery, amenitiesGallery)}
                                            >
                                                <BsTrash size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    <label
                                        className="d-flex flex-column align-items-center justify-content-center border-2 border-dashed rounded-3 bg-light cursor-pointer hover-bg-white transition-all mb-0"
                                        style={{ width: '120px', height: '120px', cursor: 'pointer', borderStyle: 'dashed' }}
                                    >
                                        <BsPlusCircle className="text-secondary fs-3 mb-1" />
                                        <span className="small text-muted fw-bold" style={{ fontSize: '10px' }}>Add Photo</span>
                                        <input
                                            type="file"
                                            multiple
                                            className="d-none"
                                            onChange={(e) => handleFileAppend(e, setAmenitiesGallery, amenitiesGallery)}
                                        />
                                    </label>
                                </div>
                                {amenitiesGallery.length > 0 && <p className="mt-3 text-success fw-bold small">{amenitiesGallery.length} photos selected for amenities</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* STEP 5: ATTRACTIONS & QUESTIONS */}
                <div className="card shadow-sm border-0 mb-5 rounded-4 overflow-hidden">
                    <div className="p-4 bg-white border-bottom d-flex align-items-center gap-3">
                        <div className="bg-danger text-white shadow-sm" style={stepIconStyle}>5</div>
                        <h4 className="mb-0 fw-bold">Amenities & Questions</h4>
                    </div>
                    <div className="card-body p-4">
                        <div className="mb-5 pb-4 border-bottom">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="mb-0 fw-bold text-primary">Property Amenities</h5>
                                <button type="button" onClick={addAmenity} className="btn btn-primary rounded-pill px-4">Add More +</button>
                            </div>
                            <div className="row g-3">
                                {amenities.map((a, i) => (
                                    <div className="col-md-6 col-lg-4" key={i}>
                                        <div className="input-group">
                                            <input className="form-control border-2" placeholder="e.g. Gym, Pool" value={a} onChange={(e) => handleAmenityChange(i, e.target.value)} />
                                            <button type="button" className="btn btn-outline-danger" onClick={() => removeAmenity(i)}><BsTrash /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="mb-0 fw-bold text-primary">Frequently Asked Questions</h5>
                                <button type="button" onClick={addFaq} className="btn btn-primary rounded-pill px-4">Add More +</button>
                            </div>
                            {faqs.map((faq, i) => (
                                <div key={i} className="p-4 border rounded-4 bg-light mb-4 position-relative">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="mb-0 fw-bold text-dark">Question {i + 1}</h6>
                                        <button type="button" className="btn btn-sm text-danger fw-bold" onClick={() => removeFaq(i)}>Delete X</button>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Type the question</label>
                                        <input className="form-control border-2" placeholder="e.g. Is it freehold?" value={faq.question} onChange={(e) => handleFaqChange(i, "question", e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="form-label small fw-bold">Type the answer</label>
                                        <textarea className="form-control border-2" rows="2" placeholder="Explain the answer clearly..." value={faq.answer} onChange={(e) => handleFaqChange(i, "answer", e.target.value)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* STEP 6: BROCHURE UPLOAD */}
                <div className="card shadow-sm border-0 mb-5 rounded-4 overflow-hidden">
                    <div className="p-4 bg-white border-bottom d-flex align-items-center gap-3">
                        <div className="bg-success text-white shadow-sm" style={stepIconStyle}>6</div>
                        <h4 className="mb-0 fw-bold">Project Brochure</h4>
                    </div>
                    <div className="card-body p-4 text-center">
                        <div className="p-5 border-2 border-dashed rounded-4 bg-light">
                            <BsUpload className="text-success fs-1 mb-3" />
                            <h5 className="fw-bold mb-2">Upload Project Brochure (PDF)</h5>
                            <p className="text-muted small mb-4">Users can download this file from the project details page.</p>
                            <input
                                type="file"
                                className="form-control border-2 mx-auto"
                                style={{ maxWidth: '400px' }}
                                onChange={(e) => setBrochure(e.target.files[0])}
                                accept=".pdf,.doc,.docx"
                            />
                            {brochure && (
                                <div className="mt-4 p-3 bg-white rounded-3 shadow-sm d-inline-flex align-items-center gap-2 border">
                                    <BsCheckCircleFill className="text-success" />
                                    <span className="fw-bold">{brochure.name}</span>
                                    <button type="button" className="btn btn-sm btn-link text-danger p-0" onClick={() => setBrochure(null)}>Remove</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submit Section */}
                <div className="text-center mt-5">
                    <button type="submit" className="btn btn-primary btn-lg w-100 py-4 rounded-pill shadow-lg border-0 fw-bold d-flex align-items-center justify-content-center gap-3 hover-scale-up" style={{ fontSize: '24px' }}>
                        <BsCheckCircleFill /> PUBLISH THIS PROJECT
                    </button>
                    <p className="mt-4 text-muted">Click the button above to save and show this project on the website.</p>
                </div>

            </form>
        </div>
    );
};

export default Projects;
