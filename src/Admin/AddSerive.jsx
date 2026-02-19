import React, { useState } from "react";
import api from "../config/api";

const AddService = () => {
    const [service, setService] = useState({
        id: "",
        title: "",
        desc: "",
        img: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setService({ ...service, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            id: service.id || Date.now().toString(),
            title: service.title,
            desc: service.desc,
            img: service.img
        };

        try {
            await api.post("/Services", payload);
            alert(" Service added successfully");

            setService({
                id: "",
                title: "",
                desc: "",
                img: ""
            });
        } catch (err) {
            console.error(err);
            alert(" Error adding service");
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="dash-card">
                <div className="dash-section-title">
                    <span>Add New Service</span>
                </div>

                <form onSubmit={handleSubmit} className="premium-form-grid">

                    <div>
                        <label className="small fw-bold text-muted">Service ID (optional)</label>
                        <input
                            name="id"
                            placeholder="Auto-generated if empty"
                            value={service.id}
                            onChange={handleChange}
                            className="premium-input"
                        />
                    </div>

                    <div>
                        <label className="small fw-bold text-muted">Service Title</label>
                        <input
                            name="title"
                            placeholder="Property Management"
                            value={service.title}
                            onChange={handleChange}
                            className="premium-input"
                            required
                        />
                    </div>

                    <div className="full-width">
                        <label className="small fw-bold text-muted">Description</label>
                        <textarea
                            name="desc"
                            rows="3"
                            placeholder="Enter service description..."
                            value={service.desc}
                            onChange={handleChange}
                            className="premium-input"
                            required
                        />
                    </div>

                    <div className="full-width">
                        <label className="small fw-bold text-muted">Image URL</label>
                        <input
                            name="img"
                            placeholder="https://images.unsplash.com/..."
                            value={service.img}
                            onChange={handleChange}
                            className="premium-input"
                            required
                        />
                    </div>

                    <div className="full-width mt-3">
                        <button className="premium-btn w-100">
                            Publish Service
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddService;
