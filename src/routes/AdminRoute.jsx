import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem("userToken"); // ✅ FIX

    if (!token) {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default AdminRoute;
