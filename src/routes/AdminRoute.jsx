import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem("authToken") || localStorage.getItem("adminToken");
    const role = localStorage.getItem("authRole");

    if (!token || (role && role !== "admin")) {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default AdminRoute;
