import React, { useEffect, useState } from "react";
import api from "../../config/api";

const RecruiterApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const recruiterToken = localStorage.getItem("authToken") || localStorage.getItem("recruiterToken");

    useEffect(() => {
        if (!recruiterToken) {
            console.error("Recruiter token missing");
            setLoading(false);
            return;
        }

        api
            .get("/recruiter/applications")
            .then((res) => {
                setApplications(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load applications", err);
                setLoading(false);
            });
    }, [recruiterToken]);

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Applications</h3>

            {applications.length === 0 ? (
                <p>No applications found</p>
            ) : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Job Title</th>
                            <th>Applicant</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Applied On</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app._id}>
                                <td>{app.jobId?.title}</td>
                                <td>{app.userId?.name}</td>
                                <td>{app.userId?.email}</td>
                                <td>
                                    <span className="badge bg-primary">
                                        {app.status}
                                    </span>
                                </td>
                                <td>
                                    {new Date(app.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default RecruiterApplications;
