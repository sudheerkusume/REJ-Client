import { Route } from "react-router-dom";
import RecruiterLayout from "../recruiter/RecruiterLayout";
const RecruiterRoutes = () => {
    return (
        <Route path="/recruiter" element={<RecruiterLayout />}>
        </Route>
    );
};

export default RecruiterRoutes;
