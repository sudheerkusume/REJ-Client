import { useEffect, useState } from 'react';
import logo from '../Accets/image.png';
import Welcome from '../Admin/Welcome';
import AddJobs from '../Admin/AddJobs';
import AddSerive from '../Admin/AddSerive';
import AddCompany from '../Admin/AddCompany';
import { IoIosArrowDown } from 'react-icons/io';
import { FiLogOut } from 'react-icons/fi';
import Dlogo from '../Accets/layout_13313006.png';
import SLogo from '../Accets/management-service_11253165.png';
import "../DashboardStyles.css";
import ViewJobs from '../Admin/ViewJobs';
import VLogo from '../Accets/briefcase_12418626.png';
import ViewEnquiry from '../Admin/ViewEnquiriy';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import DefaultAdmin from '../Accets/Admin.png';
import ViewApplication from '../Admin/ViewApplication';
import { FiSearch, FiBell, FiMail as FiMailIcon } from 'react-icons/fi';
import Projects from '../Admin/Projects';

const CompanyDashboard = () => {
    const [view, setView] = useState("");
    const [showMenu, setShowMenu] = useState(false);
    const { logout: authLogout } = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState({});

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/login");
            return;
        }

        api
            .get("/dashboard")
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => {
                console.log(err);
                navigate("/login");
            });
    }, [navigate]);

    const handleLogout = () => {
        authLogout();
        navigate("/login");
    };

    const dashboardview = () => {
        if (view === "") {
            return <Welcome userName={user?.name} />;
        } else if (view === "Jobs") {
            return <AddJobs />;
        } else if (view === "Service") {
            return <AddSerive />;
        } else if (view === "Company") {
            return <AddCompany />;
        } else if (view === "viewjob") {
            return <ViewJobs />;
        } else if (view === "viewenquiry") {
            return <ViewEnquiry />;
        } else if (view === "applications") {
            return <ViewApplication />;
        } else if (view === "projects") {
            return <Projects />;
        } else {
            return <h2>invalid view</h2>;
        }
    };

    return (
        <div className="container-fluid dashboard-layout">
            <div className="row h-100">
                {/* Sidebar */}
                <aside className="col-lg-2 col-md-3 col-12 dash-sidebar p-0">
                    <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
                        <div className="dash-logo m-0" onClick={() => setView("")}>
                            <img src={logo} className="dash-logo-icon" alt="TradoX" style={{ maxHeight: 40, width: 'auto' }} />
                        </div>
                        <button
                            className="btn d-md-none border-0"
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            <IoIosArrowDown style={{ transform: showMenu ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
                        </button>
                    </div>

                    <nav className={`dash-nav p-3  flex-column${showMenu ? 'd-flex' : 'd-none d-md-flex'}`}>
                        <button
                            className={`dash-nav-item ${view === "" ? "active" : ""}`}
                            onClick={() => { setView(""); setShowMenu(false); }}
                        >
                            <span><img src={Dlogo} className="dash-logo-icon" alt="TradoX" style={{ maxHeight: 20, width: '20px' }} />  </span> Dashboard
                        </button>
                        <button className={`dash-nav-item ${view === "applications" ? "active" : ""}`} onClick={() => { setView("applications"); setShowMenu(false); }}>
                            <span><img src={VLogo} className="dash-logo-icon" alt="TradoX" style={{ maxHeight: 20, width: '20px' }} />   </span>  Applications
                        </button>
                        <button className={`dash-nav-item ${view === "Service" ? "active" : ""}`} onClick={() => { setView("Service"); setShowMenu(false); }}>
                            <span><img src={SLogo} className="dash-logo-icon" alt="TradoX" style={{ maxHeight: 20, width: '20px' }} />   </span> Add Service
                        </button>
                        {/* <button className={`dash-nav-item ${view === "Company" ? "active" : ""}`} onClick={() => { setView("Company"); setShowMenu(false); }}>
                            <span><img src={CLogo} className="dash-logo-icon" alt="TradoX" style={{ maxHeight: 20, width: '20px' }} />   </span> Company
                        </button> */}
                        <button className={`dash-nav-item ${view === "viewjob" ? "active" : ""}`} onClick={() => { setView("viewjob"); setShowMenu(false); }}>
                            <span><img src={VLogo} className="dash-logo-icon" alt="TradoX" style={{ maxHeight: 20, width: '20px' }} />   </span>  Jobs
                        </button>
                        <button className={`dash-nav-item ${view === "viewenquiry" ? "active" : ""}`} onClick={() => { setView("viewenquiry"); setShowMenu(false); }}>
                            <span><img src={VLogo} className="dash-logo-icon" alt="TradoX" style={{ maxHeight: 20, width: '20px' }} />   </span>  Enquiry
                        </button>
                        <button className={`dash-nav-item ${view === "projects" ? "active" : ""}`} onClick={() => { setView("projects"); setShowMenu(false); }}>
                            <span><img src={VLogo} className="dash-logo-icon" alt="TradoX" style={{ maxHeight: 20, width: '20px' }} />   </span>  Projects
                        </button>
                        <button
                            className="dash-nav-item"
                            onClick={() => navigate("/admin/add-recruiter")}
                        >
                            ➕ Add Recruiter
                        </button>

                        <button className={`dash-nav-item ${view === "Settings" ? "active" : ""}`}>
                            <span>⚙️</span> Settings
                        </button>
                        <button className="dash-nav-item text-danger mt-4" onClick={handleLogout}>
                            <FiLogOut className="me-2" /> Logout
                        </button>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="col-lg-10 col-md-9 col-12 dash-main bg-light">
                    {/* Header */}
                    <header className="dash-header d-flex align-items-center justify-content-between mb-4 gap-3 bg-white p-3 rounded-4 shadow-sm">
                        <div className="dash-welcome d-none d-lg-block" style={{ minWidth: '180px' }}>
                            <h2 className="mb-0 fs-5 fw-bold text-dark">Assets Overview</h2>
                        </div>

                        <div className="flex-grow-1 d-flex justify-content-center px-lg-4">
                            <div className="dash-search w-100" style={{ maxWidth: '600px' }}>
                                <div className="position-relative">
                                    <FiSearch className="position-absolute" style={{ left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <input
                                        type="text"
                                        placeholder="Search results, candidates, jobs..."
                                        className="form-control rounded-pill ps-5 py-2 border-0 bg-light"
                                        style={{ fontSize: '14px', outline: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="d-flex align-items-center gap-3">
                            <button className="btn btn-light rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '40px', height: '40px' }}>
                                <FiMailIcon className="text-muted" />
                            </button>
                            <button className="btn btn-light rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm position-relative" style={{ width: '40px', height: '40px' }}>
                                <FiBell className="text-muted" />
                                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style={{ marginTop: '5px', marginLeft: '-5px' }}></span>
                            </button>
                            <div className="d-flex align-items-center gap-2 ms-2 p-1 pe-3 rounded-pill bg-white border shadow-sm cursor-pointer">
                                <img
                                    src={
                                        user?.profileImage
                                            ? `${api.defaults.baseURL}${user.profileImage}`
                                            : (user?.logo || DefaultAdmin)
                                    }
                                    alt="Company"
                                    className="rounded-circle object-fit-cover shadow-sm"
                                    style={{ width: 34, height: 34 }}
                                />
                                <span className="fw-bold d-none d-sm-inline" style={{ fontSize: '13px', color: '#1e293b' }}>{user?.name?.split(' ')[0]}</span>
                                <IoIosArrowDown className="text-muted" style={{ fontSize: '12px' }} />
                            </div>
                        </div>
                    </header>

                    {/* Dashboard View */}
                    <div className="fade-in-content">
                        {dashboardview()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CompanyDashboard;
