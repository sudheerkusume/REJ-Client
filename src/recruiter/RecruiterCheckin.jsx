import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RecruiterCheckin = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to unified login
        navigate("/login", { replace: true });
    }, [navigate]);

    return null;
};

export default RecruiterCheckin;
