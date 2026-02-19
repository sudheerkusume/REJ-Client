import "./App.css";
import "./DashboardStyles.css";
import React, { useEffect, useState, createContext } from "react";
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

export const loginStatus = createContext();

const App = () => {
  const [token, setToken] = useState("");
  const location = useLocation();
  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken") || localStorage.getItem("authToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);


  useEffect(() => {
    Aos.init({
      duration: 800,
      offset: 100,
    });
    Aos.refresh();
  }, [location.pathname]);

  const hideLayout = location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/recruiter") ||
    location.pathname.startsWith("/company") ||
    location.pathname.includes("/projects/");

  return (
    <AuthProvider>
      <loginStatus.Provider value={[token, setToken]}>
        <div className="App container-fluid p-0">
          {!hideLayout && <Header />}

          <ScrollToTop />
          <Routing />

          {!hideLayout && <Footer />}
        </div>
      </loginStatus.Provider>
    </AuthProvider>
  );
};


export default App;
