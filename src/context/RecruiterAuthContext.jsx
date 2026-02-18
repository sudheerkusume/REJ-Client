import { createContext, useState, useEffect } from "react";

export const recruiterAuth = createContext();

const RecruiterProvider = ({ children }) => {
    const [recruiterToken, setRecruiterToken] = useState("");

    useEffect(() => {
        const saved = localStorage.getItem("recruiterToken");
        if (saved) setRecruiterToken(saved);
    }, []);

    return (
        <recruiterAuth.Provider value={[recruiterToken, setRecruiterToken]}>
            {children}
        </recruiterAuth.Provider>
    );
};

export default RecruiterProvider;
