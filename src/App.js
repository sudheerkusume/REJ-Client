import "./App.css";
import "./DashboardStyles.css";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Routing from "./routes/Routing";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    Aos.init({
      duration: 800,
      offset: 100,
    });
    Aos.refresh();
  }, [location.pathname]);

  const hideLayout = location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/recruiter") ||
    location.pathname.startsWith("/company") ||
    location.pathname.includes("/projects/");

  return (
    <AuthProvider>
      <div className="App container-fluid p-0">
        {!hideLayout && <Header />}

        <ScrollToTop />
        <Routing />

        {!hideLayout && <Footer />}
      </div>
    </AuthProvider>
  );
};


export default App;
