import React, { useState } from "react";
import api from "../config/api";

const AddCompany = () => {
    const [company, setCompany] = useState({
        id: "",
        name: "",
        tagline: "",
        industry: "",
        location: "",
        employees: "",
        website: "",
        logo: "",
        services: "",
        vision: "",
        mission: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompany({ ...company, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            id: company.id || Date.now().toString(), // auto ID if empty
            name: company.name,
            tagline: company.tagline,
            industry: company.industry,
            location: company.location,
            employees: Number(company.employees),
            website: company.website,
            logo: company.logo,
            totalJobs: 0,
            services: company.services
                .split(",")
                .map(i => i.trim())
                .filter(Boolean),
            vision: company.vision,
            mission: company.mission
        };

        try {
            await api.post("/companies", payload);
            alert("Company added successfully");

            setCompany({
                id: "",
                name: "",
                tagline: "",
                industry: "",
                location: "",
                employees: "",
                website: "",
                logo: "",
                services: "",
                vision: "",
                mission: ""
            });
        } catch (err) {
            console.error(err);
            alert(" Error adding company");
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="dash-card">
                <div className="dash-section-title">
                    <span>Add New Company</span>
                </div>

                <form onSubmit={handleSubmit} className="premium-form-grid">

                    <div>
                        <label className="small fw-bold text-muted">Company ID (optional)</label>
                        <input
                            name="id"
                            placeholder="Auto-generated if empty"
                            value={company.id}
                            onChange={handleChange}
                            className="premium-input"
                        />
                    </div>

                    <div>
                        <label className="small fw-bold text-muted">Company Name</label>
                        <input
                            name="name"
                            placeholder="Alpha Realty"
                            value={company.name}
                            onChange={handleChange}
                            className="premium-input"
                            required
                        />
                    </div>

                    <div className="full-width">
                        <label className="small fw-bold text-muted">Tagline</label>
                        <input
                            name="tagline"
                            placeholder="Building future-ready careers"
                            value={company.tagline}
                            onChange={handleChange}
                            className="premium-input"
                        />
                    </div>

                    <div>
                        <label className="small fw-bold text-muted">Industry</label>
                        <input
                            name="industry"
                            placeholder="Real Estate"
                            value={company.industry}
                            onChange={handleChange}
                            className="premium-input"
                        />
                    </div>

                    <div>
                        <label className="small fw-bold text-muted">Location</label>
                        <input
                            name="location"
                            placeholder="Hyderabad"
                            value={company.location}
                            onChange={handleChange}
                            className="premium-input"
                        />
                    </div>

                    <div>
                        <label className="small fw-bold text-muted">Employees</label>
                        <input
                            type="number"
                            name="employees"
                            placeholder="50"
                            value={company.employees}
                            onChange={handleChange}
                            className="premium-input"
                        />
                    </div>

                    <div>
                        <label className="small fw-bold text-muted">Website</label>
                        <input
                            name="website"
                            placeholder="https://company.com"
                            value={company.website}
                            onChange={handleChange}
                            className="premium-input"
                        />
                    </div>

                    <div className="full-width">
                        <label className="small fw-bold text-muted">Logo URL</label>
                        <input
                            name="logo"
                            placeholder="https://..."
                            value={company.logo}
                            onChange={handleChange}
                            className="premium-input"
                        />
                    </div>

                    <div className="full-width">
                        <label className="small fw-bold text-muted">Services</label>
                        <input
                            name="services"
                            placeholder="Residential, Commercial, Consulting"
                            value={company.services}
                            onChange={handleChange}
                            className="premium-input"
                        />
                    </div>

                    <div className="full-width">
                        <label className="small fw-bold text-muted">Vision</label>
                        <textarea
                            name="vision"
                            rows="3"
                            value={company.vision}
                            onChange={handleChange}
                            className="premium-input"
                        />
                    </div>

                    <div className="full-width">
                        <label className="small fw-bold text-muted">Mission</label>
                        <textarea
                            name="mission"
                            rows="3"
                            value={company.mission}
                            onChange={handleChange}
                            className="premium-input"
                        />
                    </div>

                    <div className="full-width mt-3">
                        <button className="premium-btn w-100">
                            Publish Company
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCompany;
