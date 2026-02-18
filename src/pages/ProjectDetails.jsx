import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ProjectFooter from "../components/ProjectFooter";
import {
    BsGeoAlt,
    BsArrowLeft,
    BsBuilding,
    BsSquare,
    BsCash,
    BsLightningCharge,
    BsTelephone,
    BsInfoCircle,
    BsCalendarCheck,
    BsWallet2,
    BsTag,
    BsHouse,
    BsChevronLeft,
    BsChevronRight,
    BsXLg,
    BsArrowRight,
    BsQuestionCircle,
    BsChatDots,
    BsDownload,
    BsPerson,
    BsEnvelope,
    BsCheckCircleFill
} from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa";

const ProjectDetails = () => {
    const { companyId, projectId } = useParams();
    const [project, setProject] = useState(null);
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [amenitiesModalOpen, setAmenitiesModalOpen] = useState(false);
    const [currentAmenitySlide, setCurrentAmenitySlide] = useState(0);
    const [currentGallerySlide, setCurrentGallerySlide] = useState(0);
    const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
    const [activeFaq, setActiveFaq] = useState(null);
    const [contactForm, setContactForm] = useState({
        firstName: '',
        lastName: '',
        phoneCode: '+971',
        phone: '',
        email: '',
        budget: '',
        timeline: '',
        nationality: ''
    });
    const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: null });
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const slideIntervalRef = useRef(null);
    const galleryIntervalRef = useRef(null);

    // Amenity icon mapper - maps amenity names to SVG icons
    const getAmenityIcon = useCallback((name) => {
        const lower = (name || '').toLowerCase();
        const iconProps = { width: "48", height: "48", viewBox: "0 0 64 64", fill: "none", stroke: "#bda68a", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" };
        const iconPropsSmall = { width: "36", height: "36", viewBox: "0 0 64 64", fill: "none", stroke: "#bda68a", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" };

        if (lower.includes('pool') || lower.includes('aqua') || lower.includes('swimming') || lower.includes('splash')) {
            return <svg {...iconProps}><path d="M8 40c4-4 8 0 12-4s8 0 12-4 8 0 12-4 8 0 12-4" /><path d="M8 48c4-4 8 0 12-4s8 0 12-4 8 0 12-4 8 0 12-4" /><path d="M20 32c0-8 6-14 12-14s12 6 12 14" /><circle cx="32" cy="14" r="3" /></svg>;
        }
        if (lower.includes('gym') || lower.includes('fitness')) {
            return <svg {...iconProps}><path d="M10 32h44M14 24v16M18 20v24M46 20v24M50 24v16" /><circle cx="18" cy="20" r="2" /><circle cx="18" cy="44" r="2" /><circle cx="46" cy="20" r="2" /><circle cx="46" cy="44" r="2" /></svg>;
        }
        if (lower.includes('badminton')) {
            return <svg {...iconProps}><ellipse cx="32" cy="16" rx="6" ry="10" /><path d="M32 26v22M22 48h20" /><path d="M26 16h12M26 20h12M26 12h12" /></svg>;
        }
        if (lower.includes('basketball')) {
            return <svg {...iconProps}><circle cx="32" cy="32" r="18" /><path d="M14 32h36M32 14v36" /><path d="M18 16c4 8 4 24 0 32" /><path d="M46 16c-4 8-4 24 0 32" /></svg>;
        }
        if (lower.includes('bbq') || lower.includes('barbecue')) {
            return <svg {...iconProps}><path d="M20 28h24c0 10-6 16-12 16s-12-6-12-16z" /><path d="M32 44v12M24 56h16" /><path d="M24 18v-4M32 16v-6M40 18v-4" /></svg>;
        }
        if (lower.includes('business') || lower.includes('center') || lower.includes('office')) {
            return <svg {...iconProps}><rect x="12" y="16" width="40" height="36" rx="2" /><path d="M24 16V12a8 8 0 0116 0v4" /><path d="M12 28h40" /><circle cx="32" cy="36" r="4" /></svg>;
        }
        if (lower.includes('cabana') || lower.includes('seating')) {
            return <svg {...iconProps}><path d="M12 28h40" /><path d="M14 28v20M50 28v20" /><path d="M14 28c0-12 8-18 18-18s18 6 18 18" /><path d="M20 36h24v12H20z" /></svg>;
        }
        if (lower.includes('cigar') || lower.includes('lounge')) {
            return <svg {...iconProps}><rect x="10" y="32" width="44" height="6" rx="3" /><path d="M48 32c0-12-6-16-16-16" /><path d="M14 38v10M50 38v10" /><path d="M20 26c0-4 2-6 4-6" /></svg>;
        }
        if (lower.includes('cricket')) {
            return <svg {...iconProps}><path d="M44 10L20 50" strokeWidth="3" /><circle cx="36" cy="28" r="6" /><path d="M14 54l6-6" /></svg>;
        }
        if (lower.includes('drone')) {
            return <svg {...iconProps}><rect x="26" y="28" width="12" height="8" rx="2" /><path d="M16 24l10 4M48 24l-10 4M16 40l10-4M48 40l-10-4" /><circle cx="16" cy="24" r="4" /><circle cx="48" cy="24" r="4" /><circle cx="16" cy="40" r="4" /><circle cx="48" cy="40" r="4" /></svg>;
        }
        if (lower.includes('garden') || lower.includes('zen')) {
            return <svg {...iconProps}><path d="M32 50V30" /><path d="M32 30c-8-2-14-10-10-20 6 4 10 12 10 20z" /><path d="M32 36c6-2 12-8 10-16-6 2-10 10-10 16z" /><path d="M12 50h40" /></svg>;
        }
        if (lower.includes('health') || lower.includes('club')) {
            return <svg {...iconProps}><path d="M32 52c-12-8-20-16-20-24a10 10 0 0120 0 10 10 0 0120 0c0 8-8 16-20 24z" /></svg>;
        }
        if (lower.includes('indoor game') || lower.includes('game')) {
            return <svg {...iconProps}><rect x="8" y="18" width="48" height="28" rx="4" /><circle cx="24" cy="32" r="6" /><circle cx="44" cy="28" r="3" /><circle cx="44" cy="36" r="3" /><path d="M24 26v12M18 32h12" /></svg>;
        }
        if (lower.includes('infinity')) {
            return <svg {...iconProps}><path d="M10 36c0-8 6-14 12-14s10 4 10 14-4 14-10 14S10 44 10 36z" /><path d="M32 36c0-10 4-14 10-14s12 6 12 14-6 14-12 14-10-4-10-14z" /></svg>;
        }
        if (lower.includes('jogging') || lower.includes('running') || lower.includes('walking') || lower.includes('track')) {
            return <svg {...iconProps}><circle cx="36" cy="12" r="4" /><path d="M28 24l6-6 8 8-4 12-8 2" /><path d="M34 38l-4 14M42 26l6 12-8 4" /></svg>;
        }
        if (lower.includes('kid') || lower.includes('play') || lower.includes('daycare') || lower.includes('children')) {
            return <svg {...iconProps}><path d="M18 44l6-20 8 8 8-8 6 20" /><circle cx="32" cy="14" r="6" /><path d="M8 54h48" /></svg>;
        }
        if (lower.includes('mini basket')) {
            return <svg {...iconProps}><circle cx="32" cy="28" r="12" /><path d="M20 28h24M32 16v24" /><rect x="24" y="44" width="16" height="4" rx="2" /></svg>;
        }
        if (lower.includes('padel') || lower.includes('tennis')) {
            return <svg {...iconProps}><ellipse cx="32" cy="22" rx="12" ry="16" /><path d="M32 38v14" /><path d="M26 52h12" /><path d="M20 22h24" /><path d="M32 6v32" /></svg>;
        }
        if (lower.includes('pickle')) {
            return <svg {...iconProps}><rect x="24" y="6" width="16" height="24" rx="8" /><path d="M32 30v20" /><circle cx="32" cy="18" r="3" fill="#bda68a" /></svg>;
        }
        if (lower.includes('prayer') || lower.includes('mosque') || lower.includes('hall')) {
            return <svg {...iconProps}><path d="M12 44h40" /><path d="M16 44V28a16 16 0 0132 0v16" /><path d="M28 44V36a4 4 0 018 0v8" /><path d="M32 12v-4" /><circle cx="32" cy="8" r="2" /></svg>;
        }
        if (lower.includes('snooker') || lower.includes('billiard')) {
            return <svg {...iconProps}><rect x="8" y="20" width="48" height="28" rx="2" /><circle cx="24" cy="34" r="3" fill="#bda68a" /><circle cx="32" cy="30" r="3" /><circle cx="40" cy="34" r="3" /><path d="M10 44l14-20" /></svg>;
        }
        if (lower.includes('spa') || lower.includes('sauna') || lower.includes('steam')) {
            return <svg {...iconProps}><path d="M24 42c0-6 4-10 8-10s8 4 8 10" /><path d="M16 50h32" /><path d="M24 18c0-4 2-6 4-8M32 16c0-4 2-6 4-8M40 18c0-4 2-6 4-8" /></svg>;
        }
        if (lower.includes('sunken')) {
            return <svg {...iconProps}><path d="M8 36h48" /><path d="M16 36v12h32V36" /><rect x="20" y="40" width="24" height="4" rx="2" /></svg>;
        }
        if (lower.includes('trampoline')) {
            return <svg {...iconProps}><ellipse cx="32" cy="40" rx="20" ry="6" /><path d="M12 40V50M52 40V50" /><circle cx="32" cy="22" r="4" /><path d="M28 30l4 4 4-4" /></svg>;
        }
        if (lower.includes('water feature') || lower.includes('fountain')) {
            return <svg {...iconProps}><path d="M32 10v16M26 16c0-6 6-10 6-10s6 4 6 10" /><path d="M20 22c0-6 6-12 12-12s12 6 12 12" /><path d="M14 38c0-8 8-12 18-12s18 4 18 12" /><path d="M10 46h44" /><path d="M14 50h36" /></svg>;
        }
        if (lower.includes('wall climbing') || lower.includes('climbing')) {
            return <svg {...iconProps}><rect x="18" y="8" width="28" height="48" rx="2" /><circle cx="26" cy="18" r="2" fill="#bda68a" /><circle cx="38" cy="24" r="2" fill="#bda68a" /><circle cx="30" cy="32" r="2" fill="#bda68a" /><circle cx="36" cy="40" r="2" fill="#bda68a" /><circle cx="28" cy="46" r="2" fill="#bda68a" /></svg>;
        }
        if (lower.includes('court')) {
            return <svg {...iconProps}><rect x="8" y="14" width="48" height="36" rx="2" /><path d="M32 14v36M8 32h48" /><circle cx="32" cy="32" r="8" /></svg>;
        }
        // Default star/amenity icon
        return <svg {...iconProps}><path d="M32 8l6 18h18l-14 11 5 19-15-11-15 11 5-19L8 26h18z" /></svg>;
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProjectDetails = async () => {
            try {
                // 1. Try fetching from the standalone projects endpoint first
                try {
                    const standaloneRes = await axios.get(`https://rej-server.onrender.com/projects/${projectId}`);
                    if (standaloneRes.data && standaloneRes.data._id) {
                        setProject(standaloneRes.data);
                        // Company comes populated or we fetch it
                        if (standaloneRes.data.companyId) {
                            setCompany(standaloneRes.data.companyId);
                        } else {
                            // Fallback fetch company if not populated
                            const companyRes = await axios.get(`https://rej-server.onrender.com/companies/${companyId}`);
                            setCompany(companyRes.data);
                        }
                        setLoading(false);
                        return;
                    }
                } catch (err) {
                    console.log("Not a standalone project or fetch failed, trying legacy...");
                }

                // 2. Fallback to Legacy: Search nested projects in the companies collection
                const companiesRes = await axios.get("https://rej-server.onrender.com/companies");
                const foundCompany = companiesRes.data.find(c => c._id === companyId);

                if (foundCompany) {
                    setCompany(foundCompany);
                    const foundProject = foundCompany.projects?.find(
                        (p, index) => String(p.id) === projectId || String(index) === projectId || String(p._id) === projectId
                    );

                    if (foundProject) {
                        // Normalize legacy project to match the new schema for rendering
                        setProject({
                            ...foundProject,
                            title: foundProject.title,
                            description: foundProject.description || foundProject.desc,
                            gallery: foundProject.gallery || [foundProject.img],
                            price: foundProject.price || foundProject.priceRange,
                            completion: foundProject.completion || foundProject.status,
                            bedrooms: foundProject.bedrooms || foundProject.bhk,
                            area: foundProject.area,
                            amenities: foundProject.amenities || [],
                            faqs: foundProject.faqs || []
                        });
                    }
                }
            } catch (err) {
                console.error("Error fetching project details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [companyId, projectId]);

    useEffect(() => {
        if (project && project.faqs) {
            const list = Array.isArray(project.faqs) ? project.faqs :
                (typeof project.faqs === 'string' ? (project.faqs.startsWith('[') ? JSON.parse(project.faqs) : []) : []);
            if (list.length > 0) {
                setActiveFaq(list[0]);
            }
        }
    }, [project]);

    // Auto-slide amenities carousel
    useEffect(() => {
        if (amenitiesModalOpen) return; // pause when modal is open
        const amenitiesArr = Array.isArray(project?.amenities) ? project.amenities :
            (typeof project?.amenities === 'string' ? JSON.parse(project.amenities) : []);
        if (amenitiesArr.length === 0) return;

        slideIntervalRef.current = setInterval(() => {
            setCurrentAmenitySlide(prev => (prev + 1) % amenitiesArr.length);
        }, 4000);

        return () => clearInterval(slideIntervalRef.current);
    }, [project, amenitiesModalOpen]);

    // Auto-slide gallery carousel
    useEffect(() => {
        if (!project?.gallery || project.gallery.length <= 1) return;

        galleryIntervalRef.current = setInterval(() => {
            setCurrentGallerySlide(prev => (prev + 1) % project.gallery.length);
        }, 5000);

        return () => clearInterval(galleryIntervalRef.current);
    }, [project]);

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setFormStatus({ loading: true, success: false, error: null });

        try {
            const payload = {
                user: `${contactForm.firstName} ${contactForm.lastName}`,
                mobile: `${contactForm.phoneCode} ${contactForm.phone}`,
                email: contactForm.email,
                message: `Enquiry for ${project.title}. Budget: ${contactForm.budget}, Timeline: ${contactForm.timeline}, Nationality: ${contactForm.nationality}`,
                projectId: project._id,
                companyId: companyId
            };

            await axios.post("https://rej-server.onrender.com/Enquiries", payload);
            setFormStatus({ loading: false, success: true, error: null });
            setContactForm({
                firstName: '', lastName: '', phoneCode: '+971', phone: '',
                email: '', budget: '', timeline: '', nationality: ''
            });
            setTimeout(() => setFormStatus(prev => ({ ...prev, success: false })), 5000);
        } catch (err) {
            console.error(err);
            setFormStatus({ loading: false, success: false, error: "Failed to send enquiry. Please try again." });
        }
    };

    const scrollToEnquiry = () => {
        const section = document.getElementById("project-contact-section");
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            setSidebarOpen(false); // Close sidebar after clicking to clear the view
        }
    };

    if (loading) return (
        <div className="text-center py-5" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="spinner-border text-danger mb-3" />
            <p className="fw-bold">Loading Elite Project Details...</p>
        </div>
    );

    if (!project) return (
        <div className="text-center py-5" style={{ minHeight: '60vh' }}>
            <h2 className="fw-bold">Project Not Found</h2>
            <p className="text-muted">We couldn't find the project details you're looking for.</p>
            <Link to={`/companies/${companyId}`} className="btn btn-danger mt-3">
                Back to Company Profile
            </Link>
        </div>
    );

    // Normalize arrays
    const amenitiesList = Array.isArray(project.amenities) ? project.amenities :
        (typeof project.amenities === 'string' ? JSON.parse(project.amenities) : []);

    const faqsList = Array.isArray(project.faqs) ? project.faqs :
        (typeof project.faqs === 'string' ? JSON.parse(project.faqs) : []);

    const galleryList = Array.isArray(project.gallery) ? project.gallery : [];
    const amenitiesGalleryList = Array.isArray(project.amenitiesGallery) ? project.amenitiesGallery : [];

    const getImgUrl = (path) => {
        if (!path) return "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200";
        if (path.startsWith("http")) return path;
        if (path.startsWith("/uploads")) return `http://localhost:5000${path}`;
        return path;
    };

    const getMapEmbedUrl = (link) => {
        if (!link) return "";
        if (link.includes("embed")) return link;
        if (link.includes("google.com/maps") || link.includes("maps.google.com")) {
            // Check for coordinates or search query
            const match = link.match(/q=([^&]+)/);
            if (match) {
                return `https://maps.google.com/maps?q=${match[1]}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
            }
        }
        return link;
    };

    return (
        <div className="project-details-page">
            {/* HERO SECTION */}
            <section
                className="project-hero-premium position-relative overflow-hidden"
            >
                {/* Hero Background (Video or Image) */}
                {project.heroVideo ? (
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover opacity-100"
                        src={getImgUrl(project.heroVideo)}
                    />
                ) : (
                    <div
                        className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover opacity-60"
                        style={{
                            backgroundImage: `url(${getImgUrl(galleryList[0] || project.img)})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    />
                )}

                {/* Overlay Gradient */}
                <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)' }}
                />

                <div className="container position-relative z-1">
                    <Link to={`/companies/${companyId}`} className="text-white text-decoration-none mb-4 d-inline-flex align-items-center gap-2 opacity-75 hover-opacity-100 transition-all">
                        <BsArrowLeft /> Back to {company?.name || "Company"}
                    </Link>
                    <h1 className="display-2 fw-bold mb-3 landing-main-title">{project.title}</h1>
                    <div className="d-flex align-items-center gap-3 fs-5 opacity-90">
                        <span className="badge bg-danger px-3 py-2 rounded-pill fs-6 uppercase tracking-wider">{project.completion || "Ongoing"}</span>
                        <div className="d-flex align-items-center gap-2">
                            <BsGeoAlt className="text-danger" /> {project.location || company?.location}
                        </div>
                    </div>
                </div>
            </section>
            {/* PREMIUM CENTERED OVERVIEW SECTION */}
            <section id="project-details-section" className="py-5 bg-white text-center overflow-hidden">
                <div className="container py-5">
                    <div className="mx-auto" style={{ maxWidth: '900px' }}>
                        <h2 className="display-4 text-uppercase fw-light premium-title-underline project-overview-title">
                            {project.title}
                            <div className="title-separator-diamond" style={{
                                position: 'absolute',
                                bottom: '-4.5px',
                                left: '50%',
                                transform: 'translateX(-50%) rotate(45deg)',
                                width: '9px',
                                height: '9px',
                                border: '1px solid #bda68a',
                                backgroundColor: '#fff',
                                zIndex: 3,
                                opacity: 0,
                                animation: 'diamondRotatePop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                                animationDelay: '2s'
                            }}></div>
                        </h2>

                        <div className="mb-5 px-lg-5">
                            <p className="fs-4 text-muted lh-base mb-4 opacity-75">
                                {project.description}
                            </p>
                            {project.locationDescription && (
                                <p className="fs-4 text-muted lh-base opacity-75">
                                    {project.locationDescription}
                                </p>
                            )}
                        </div>

                        {project.virtualTourLink && (
                            <a
                                href={project.virtualTourLink}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-lg px-5 py-3 text-white rounded-1 transition-all hover-opacity-90 fw-bold text-uppercase tracking-widest virtual-tour-btn"
                            >
                                Virtual Tour
                            </a>
                        )}
                    </div>
                </div>
            </section>
            {/* IMPROVED ELITE FUNCTION HUB */}
            <section id="project-function-section" className="overflow-hidden">
                <div className="function-grid-row">
                    {/* STARTING PRICE */}
                    <div className="function-card">
                        <span className="function-index">01</span>
                        <div className="function-icon-wrapper">
                            <BsTag size={24} />
                        </div>
                        <div className="function-label">Starting Price</div>
                        <div className="function-value">
                            {project.price && !project.price.toLowerCase().includes("aed") ? "AED " : ""}
                            {project.price || "Contact"}
                        </div>
                    </div>

                    {/* COMPLETION */}
                    <div className="function-card">
                        <span className="function-index">02</span>
                        <div className="function-icon-wrapper">
                            <BsCalendarCheck size={24} />
                        </div>
                        <div className="function-label">Completion</div>
                        <div className="function-value">{project.completion || "TBA"}</div>
                    </div>

                    {/* PAYMENT PLAN */}
                    <div className="function-card">
                        <span className="function-index">03</span>
                        <div className="function-icon-wrapper">
                            <BsWallet2 size={24} />
                        </div>
                        <div className="function-label">Payment Plan</div>
                        <div className="function-value">{project.paymentPlan || "Flexible"}</div>
                    </div>

                    {/* APARTMENTS */}
                    <div className="function-card">
                        <span className="function-index">04</span>
                        <div className="function-icon-wrapper">
                            <BsBuilding size={24} />
                        </div>
                        <div className="function-label">Apartments</div>
                        <div className="function-value">{project.apartments || "Elite Units"}</div>
                    </div>

                    {/* BEDROOMS */}
                    <div className="function-card">
                        <span className="function-index">05</span>
                        <div className="function-icon-wrapper">
                            <BsHouse size={24} />
                        </div>
                        <div className="function-label">Bedrooms</div>
                        <div className="function-value">{project.bedrooms || "On Request"}</div>
                    </div>

                    {/* LOCATION */}
                    <div className="function-card">
                        <span className="function-index">06</span>
                        <div className="function-icon-wrapper">
                            <BsGeoAlt size={24} />
                        </div>
                        <div className="function-label">Location</div>
                        <div className="function-value">
                            {project.location || company?.location || "Prime JVC"}
                        </div>
                    </div>
                </div>
            </section>

            {/* BOLD HIGH-VISIBILITY CONNECTIVITY CANVAS */}
            {project.connectivity && project.connectivity.length > 0 && (
                <section id="project-why-section" className="py-5 overflow-hidden border-top border-bottom" style={{ backgroundColor: '#fdfdfd' }}>
                    <div className="container py-5">
                        <div className="text-center mb-5 pb-5">
                            <span className="strategic-location-subtitle fw-black">Connectivity</span>
                            <h2 className="display-3 fw-bold mt-4 mb-0 strategic-location-title">
                                Strategic Location
                            </h2>
                            <div className="mt-5 mx-auto" style={{ width: '120px', height: '4px', background: '#111' }}></div>
                        </div>

                        <div className="connectivity-canvas">
                            {project.connectivity.map((item, index) => {
                                const renderIcon = () => {
                                    const iconProps = { width: "32", height: "32", viewBox: "0 0 24 24", fill: "none", stroke: "#bda68a", strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round" };
                                    switch (item.iconType) {
                                        case 'metro': return <svg {...iconProps}><rect x="4" y="3" width="16" height="15" rx="2" /><path d="M4 11h16M8 15h.01M16 15h.01M7 21l2-3M17 21l-2-3" /></svg>;
                                        case 'mall': return <svg {...iconProps}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18M16 10a4 4 0 0 1-8 0" /></svg>;
                                        case 'road': return <svg {...iconProps}><path d="m3 11 18-5M3 18l18-5M3 6h18M3 12h18M3 18h18" /></svg>;
                                        case 'park': return <svg {...iconProps}><path d="m12 19 3-7 3 7M9 19l3-7 3 7M12 5v14M7 19h10" /></svg>;
                                        case 'hospital': return <svg {...iconProps}><path d="M19 14v1H5v-1" /><path d="M12 3v18M3 10h18" /><path d="M10 21V19a2 2 0 0 1 4 0v2" /></svg>;
                                        case 'airport': return <svg {...iconProps}><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2Z" /></svg>;
                                        case 'school': return <svg {...iconProps}><path d="M22 10v6M2 10l10-5 10 5-10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>;
                                        default: return <svg {...iconProps}><path d="M4.5 22v-5M4.5 7V2M2 4.5h5M2 19.5h5m6-16.5-1.7 4.5c-.3.7-.4 1.1-.6 1.4-.2.3-.4.5-.7.7-.3.2-.7.3-1.4.6L4 12l4.5 1.7c.7.3 1.1.4 1.4.6.3.2.5.4.7.7.2.3.3.7.6 1.4L13 21l1.7-4.5c.3-.7.4-1.1.6-1.4.2-.3.4-.5.7-.7.3-.2.7-.3 1.4-.6L22 12l-4.5-1.7c-.7-.3-1.1-.4-1.4-.6-.3-.2-.5-.4-.7-.7-.2-.3-.3-.7-.6-1.4Z" /></svg>;
                                    }
                                };

                                return (
                                    <div key={index} className="connectivity-node transition-all">
                                        <div className="node-bg-text">{index + 1}</div>
                                        <div className="node-icon-wrapper">
                                            <div className="node-icon-inner">
                                                {renderIcon()}
                                            </div>
                                        </div>
                                        <div className="node-value">{item.value}</div>
                                        <div className="node-divider"></div>
                                        <div className="node-label">{item.label}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}


            {/* PARALLAX CAROUSEL SECTION */}
            {(project.backgroundImages && project.backgroundImages.length > 0) ? (
                <section id="project-details-corousle">
                    {project.backgroundImages.map((img, index) => (
                        <div key={index} className="palaraxx-effect-section">
                            <div
                                style={{ backgroundImage: `url(${getImgUrl(img)})` }}
                                className="pageBlock"
                            >
                                <div className="cbutton">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon">
                                        <path d="M4.5 22V17M4.5 7V2M2 4.5H7M2 19.5H7M13 3L11.2658 7.50886C10.9838 8.24209 10.8428 8.60871 10.6235 8.91709C10.4292 9.1904 10.1904 9.42919 9.91709 9.62353C9.60871 9.84281 9.24209 9.98381 8.50886 10.2658L4 12L8.50886 13.7342C9.24209 14.0162 9.60871 14.1572 9.91709 14.3765C10.1904 14.5708 10.4292 14.8096 10.6235 15.0829C10.8428 15.3913 10.9838 15.7579 11.2658 16.4911L13 21L14.7342 16.4911C15.0162 15.7579 15.1572 15.3913 15.3765 15.0829C15.5708 14.8096 15.8096 14.5708 16.0829 14.3765C16.3913 14.1572 16.7579 14.0162 17.4911 13.7342L22 12L17.4911 10.2658C16.7579 9.98381 16.3913 9.8428 16.0829 9.62353C15.8096 9.42919 15.5708 9.1904 15.3765 8.91709C15.1572 8.60871 15.0162 8.24209 14.7342 7.50886L13 3Z" />
                                    </svg>
                                    <span className="ms-2">{index === 0 ? "Exterior" : index === 1 ? "Grand Lobby" : "Exclusive View"}</span>
                                    {/* <span className="cbutton-badge uppercase ms-3">New</span> */}
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            ) : galleryList.length > 0 ? (
                <section id="project-details-corousle">
                    <div className="palaraxx-effect-section">
                        <div
                            style={{ backgroundImage: `url(${getImgUrl(galleryList[0])})` }}
                            className="pageBlock"
                        >
                            <div className="cbutton">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon">
                                    <path d="M4.5 22V17M4.5 7V2M2 4.5H7M2 19.5H7M13 3L11.2658 7.50886C10.9838 8.24209 10.8428 8.60871 10.6235 8.91709C10.4292 9.1904 10.1904 9.42919 9.91709 9.62353C9.60871 9.84281 9.24209 9.98381 8.50886 10.2658L4 12L8.50886 13.7342C9.24209 14.0162 9.60871 14.1572 9.91709 14.3765C10.1904 14.5708 10.4292 14.8096 10.6235 15.0829C10.8428 15.3913 10.9838 15.7579 11.2658 16.4911L13 21L14.7342 16.4911C15.0162 15.7579 15.1572 15.3913 15.3765 15.0829C15.5708 14.8096 15.8096 14.5708 16.0829 14.3765C16.3913 14.1572 16.7579 14.0162 17.4911 13.7342L22 12L17.4911 10.2658C16.7579 9.98381 16.3913 9.8428 16.0829 9.62353C15.8096 9.42919 15.5708 9.1904 15.3765 8.91709C15.1572 8.60871 15.0162 8.24209 14.7342 7.50886L13 3Z" />
                                </svg>
                                <span className="ms-2">Exterior</span>
                            </div>
                        </div>
                    </div>
                </section>
            ) : null}

            {/* Amenities */}
            {/* AMENITIES SECTION */}
            {amenitiesList.length > 0 && (
                <>
                    <section id="project-amenities-section" className="amenities-carousel-section">
                        {/* Section Header */}
                        <div className="amenities-header-bar">
                            <h2 className="amenities-main-title">AMENITIES</h2>
                        </div>

                        {/* Full-width Carousel */}
                        <div className="amenities-slider-wrapper">
                            <div
                                className="amenities-slides-track"
                                style={{ transform: `translateX(-${currentAmenitySlide * 100}%)` }}
                            >
                                {/* Slides */}
                                {amenitiesList.map((amenity, index) => (
                                    <div
                                        key={index}
                                        className="amenity-slide"
                                        style={{
                                            backgroundImage: `url(${getImgUrl(
                                                (amenitiesGalleryList && amenitiesGalleryList.length > 0)
                                                    ? (amenitiesGalleryList[index % amenitiesGalleryList.length])
                                                    : (project.amenitiesBackground || project.img)
                                            )})`,
                                        }}
                                    >
                                        <div className="amenity-slide-overlay" />
                                        <div className="amenity-slide-content">
                                            <h4 className="amenity-slide-name">{amenity}</h4>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Navigation Arrows */}
                            <button
                                className="amenity-nav-arrow amenity-nav-prev"
                                onClick={() => setCurrentAmenitySlide(prev => prev === 0 ? amenitiesList.length - 1 : prev - 1)}
                                aria-label="Previous amenity"
                            >
                                <BsChevronLeft />
                            </button>
                            <button
                                className="amenity-nav-arrow amenity-nav-next"
                                onClick={() => setCurrentAmenitySlide(prev => (prev + 1) % amenitiesList.length)}
                                aria-label="Next amenity"
                            >
                                <BsChevronRight />
                            </button>

                            {/* Dot Indicators */}
                            <div className="amenity-dots">
                                {amenitiesList.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`amenity-dot ${index === currentAmenitySlide ? 'amenity-dot-active' : ''}`}
                                        onClick={() => setCurrentAmenitySlide(index)}
                                        aria-label={`Go to amenity ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* View All Amenities Button */}
                        <div className="amenities-cta-wrapper">
                            <button
                                className="amenities-view-all-btn"
                                onClick={() => setAmenitiesModalOpen(true)}
                            >
                                View all amenities
                            </button>
                        </div>
                    </section>

                    {/* AMENITIES MODAL */}
                    {amenitiesModalOpen && (
                        <div className="amenities-modal-backdrop" onClick={() => setAmenitiesModalOpen(false)}>
                            <div className="amenities-modal-container" onClick={(e) => e.stopPropagation()}>
                                <button
                                    className="amenities-modal-close"
                                    onClick={() => setAmenitiesModalOpen(false)}
                                    aria-label="Close amenities modal"
                                >
                                    <BsXLg />
                                </button>

                                <div className="amenities-modal-body">
                                    <div className="amenities-modal-grid">
                                        {amenitiesList.map((amenity, index) => (
                                            <div key={index} className="amenity-modal-item">
                                                <div className="amenity-modal-icon">
                                                    {getAmenityIcon(amenity)}
                                                </div>
                                                <span className="amenity-modal-name">{amenity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Gallery Section */}
            {galleryList.length > 0 && (
                <section id="project-gallery-section" className="gallery-section">
                    <div className="gallery-header-bar">
                        <h2 className="gallery-main-title">GALLERY</h2>
                    </div>

                    <div className="gallery-3d-wrapper">
                        <div className="gallery-3d-container">
                            {galleryList.map((img, index) => {
                                // Calculate position relative to current slide
                                let offset = index - currentGallerySlide;

                                // Handle loop-around for offsets
                                if (offset > galleryList.length / 2) offset -= galleryList.length;
                                if (offset < -galleryList.length / 2) offset += galleryList.length;

                                const absOffset = Math.abs(offset);
                                const isActive = index === currentGallerySlide;

                                // Define 3D transformation
                                // Active card: front & center
                                // Side cards: pushed back, rotated, and shifted
                                let translateX = offset * 60; // Spread out
                                let translateZ = absOffset * -150; // Push back
                                let rotateY = offset * -45; // Slant away from center
                                let opacity = 1 - (absOffset * 0.3); // Fade distant items
                                let zIndex = 10 - absOffset; // Active on top

                                // Cap rotation and translation for extreme offsets if needed
                                if (absOffset > 2) opacity = 0; // Hide very distant items

                                return (
                                    <div
                                        key={index}
                                        className={`gallery-3d-item ${isActive ? 'active' : ''}`}
                                        style={{
                                            transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
                                            opacity: opacity,
                                            zIndex: zIndex,
                                            backgroundImage: `url(${getImgUrl(img)})`
                                        }}
                                        onClick={() => {
                                            if (isActive) {
                                                setSelectedGalleryImage(img);
                                            } else {
                                                setCurrentGallerySlide(index);
                                            }
                                        }}
                                    >
                                        <div className="gallery-item-overlay"></div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Navigation Controls */}
                        <div className="gallery-controls">
                            <button
                                className="gallery-nav-btn prev"
                                onClick={() => setCurrentGallerySlide(prev => prev === 0 ? galleryList.length - 1 : prev - 1)}
                            >
                                <BsChevronLeft />
                            </button>

                            <div className="gallery-dots">
                                {galleryList.map((_, index) => (
                                    <span
                                        key={index}
                                        className={`gallery-dot ${index === currentGallerySlide ? 'active' : ''}`}
                                        onClick={() => setCurrentGallerySlide(index)}
                                    ></span>
                                ))}
                            </div>

                            <button
                                className="gallery-nav-btn next"
                                onClick={() => setCurrentGallerySlide(prev => (prev + 1) % galleryList.length)}
                            >
                                <BsChevronRight />
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* Map Section */}
            {project.mapEmbedLink && (
                <section id="project-map-section" className="map-section">
                    <div className="map-header-bar">
                        <span className="map-pre-title">DISCOVER THE AREA</span>
                        <h2 className="map-main-title">LOCATION MAP</h2>
                        <div className="map-title-divider"></div>
                    </div>

                    <div className="map-container-wrapper">
                        <div className="map-visual-container">
                            {/* The Google Map Iframe */}
                            <div className="map-frame-container">
                                <iframe
                                    src={getMapEmbedUrl(project.mapEmbedLink)}
                                    width="100%"
                                    height="550"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Project Location Map"
                                ></iframe>
                            </div>

                            {/* Floating Location Info Card */}
                            <div className="location-floating-card" data-aos="fade-left">
                                <div className="location-card-content">
                                    <div className="loc-card-header">
                                        <div className="loc-icon-bg">
                                            <BsGeoAlt />
                                        </div>
                                        <h3 className="loc-card-title">Project Address</h3>
                                    </div>

                                    <div className="loc-card-details">
                                        <p className="loc-address-text">{project.location}</p>
                                        {project.locationDescription && (
                                            <div className="loc-sub-info">
                                                <span className="loc-label">Proximity:</span>
                                                <span className="loc-value">{project.locationDescription}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="loc-card-footer">
                                        <a
                                            href={project.mapEmbedLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="get-directions-btn"
                                        >
                                            Get Directions
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
            {/* DETAILS CONTENT */}

            {/* Gallery Lightbox Modal */}
            {selectedGalleryImage && (
                <div className="gallery-lightbox-modal" onClick={() => setSelectedGalleryImage(null)}>
                    <div className="lightbox-content" onClick={e => e.stopPropagation()}>
                        <button className="lightbox-close" onClick={() => setSelectedGalleryImage(null)}>
                            <BsXLg />
                        </button>
                        <div className="lightbox-image-wrapper">
                            <img src={getImgUrl(selectedGalleryImage)} alt="Gallery Large" className="lightbox-img" />
                        </div>
                    </div>
                </div>
            )}

            {/* FAQ SECTION */}
            {faqsList.length > 0 && (
                <section id="project-faq-section" className="faq-modern-section">
                    <div className="container-fluid px-lg-5">
                        <div className="faq-header-bar mb-5" data-aos="fade-up">
                            <span className="faq-pre-title">COMMONLY ASKED</span>
                            <h2 className="faq-main-title">EVERYTHING YOU <span className="highlight-text">NEED TO KNOW</span></h2>
                            <div className="faq-title-divider"></div>
                        </div>

                        <div className="row align-items-center">
                            {/* Left: Questions List (6-cols) */}
                            <div className="col-lg-6 mb-4 mb-lg-0" data-aos="fade-right">
                                <div className="faq-list-container">
                                    {faqsList.map((faq, index) => (
                                        <div
                                            key={index}
                                            className={`faq-list-item-v2 ${activeFaq?.question === faq.question ? "active" : ""}`}
                                            onMouseEnter={() => setActiveFaq(faq)}
                                            onClick={() => setActiveFaq(faq)}
                                        >
                                            <div className="d-flex align-items-center justify-content-between w-100">
                                                <div className="faq-q-text-v2">
                                                    <span className="faq-number-v2">0{index + 1}</span>
                                                    {faq.question}
                                                </div>
                                                <BsArrowRight className="faq-arrow-icon-v2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Answer inside Smartphone Mockup (6-cols) */}
                            <div className="col-lg-6 d-flex justify-content-center" data-aos="fade-left">
                                <div className="smartphone-mockup">
                                    <div className="smartphone-screen">
                                        <div className="phone-header">
                                            <div className="phone-notch"></div>
                                            <div className="phone-status-bar">
                                                <span>9:41</span>
                                                <div className="status-icons">
                                                    <div className="wifi"></div>
                                                    <div className="battery"></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="phone-content">
                                            <div className="phone-app-header">
                                                <div className="app-icon-bg">
                                                    <BsQuestionCircle />
                                                </div>
                                                <h4 className="app-title">Property FAQ</h4>
                                            </div>

                                            <div className="phone-q-bubble">
                                                <p>{activeFaq?.question}</p>
                                            </div>

                                            <div className="phone-a-bubble" key={activeFaq?.question}>
                                                <div className="typing-indicator d-none">
                                                    <span></span><span></span><span></span>
                                                </div>
                                                <p className="faq-answer-text">{activeFaq?.answer}</p>
                                                <div className="faq-answer-footer">
                                                    <small>Answered by Property Expert</small>
                                                </div>
                                            </div>

                                            {/* Decorative Elements from user image */}
                                            <div className="phone-decor-grid">
                                                <div className="decor-item"></div>
                                                <div className="decor-item"></div>
                                                <div className="decor-item"></div>
                                            </div>
                                        </div>
                                        <div className="phone-home-indicator"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Contact-section */}
            <section id="project-contact-section" className="project-contact-modern">
                <div className="contact-main-container">
                    <div className="contact-form-side" data-aos="fade-right">
                        <div className="contact-form-inner">
                            <h2 className="contact-main-heading">GET IN TOUCH</h2>

                            <form className="luxury-contact-form" onSubmit={handleContactSubmit}>
                                <div className="contact-row">
                                    <div className="contact-col">
                                        <input
                                            type="text"
                                            placeholder="First Name*"
                                            required
                                            value={contactForm.firstName}
                                            onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
                                        />
                                    </div>
                                    <div className="contact-col">
                                        <input
                                            type="text"
                                            placeholder="Last Name*"
                                            required
                                            value={contactForm.lastName}
                                            onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="contact-row phone-row">
                                    <div className="phone-code-select">
                                        <img src="https://flagcdn.com/w20/ae.png" alt="UAE" />
                                        <select
                                            value={contactForm.phoneCode}
                                            onChange={(e) => setContactForm({ ...contactForm, phoneCode: e.target.value })}
                                        >
                                            <option value="+971">+971</option>
                                            <option value="+91">+91</option>
                                            <option value="+1">+1</option>
                                            <option value="+44">+44</option>
                                        </select>
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="Phone Number*"
                                        required
                                        value={contactForm.phone}
                                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                                    />
                                </div>

                                <div className="contact-row">
                                    <input
                                        type="email"
                                        placeholder="Email*"
                                        required
                                        value={contactForm.email}
                                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                    />
                                </div>

                                <div className="contact-row">
                                    <select
                                        required
                                        value={contactForm.budget}
                                        onChange={(e) => setContactForm({ ...contactForm, budget: e.target.value })}
                                    >
                                        <option value="" disabled>Select a Budget*</option>
                                        <option value="Under 1M">Under 1M AED</option>
                                        <option value="1M - 3M">1M - 3M AED</option>
                                        <option value="3M - 5M">3M - 5M AED</option>
                                        <option value="Over 5M">Over 5M AED</option>
                                    </select>
                                </div>

                                <div className="contact-row">
                                    <select
                                        required
                                        value={contactForm.timeline}
                                        onChange={(e) => setContactForm({ ...contactForm, timeline: e.target.value })}
                                    >
                                        <option value="" disabled>Purchase Timeline*</option>
                                        <option value="Immediate">Immediate</option>
                                        <option value="1-3 Months">1-3 Months</option>
                                        <option value="6 Months+">6 Months+</option>
                                    </select>
                                </div>

                                <div className="contact-row">
                                    <input
                                        type="text"
                                        placeholder="Select Nationality*"
                                        required
                                        value={contactForm.nationality}
                                        onChange={(e) => setContactForm({ ...contactForm, nationality: e.target.value })}
                                    />
                                </div>

                                <div className="form-disclaimer">
                                    Disclaimer : {company?.title || 'Our company'} values your privacy and will use the contact information you provide solely for communicating with you about our products and services. By clicking the submit button, you consent to our sales agents contacting you via phone calls, emails, and WhatsApp messages.
                                </div>

                                {formStatus.success ? (
                                    <div className="form-success-msg">
                                        <BsCheckCircleFill /> Thank you! Our consultant will contact you shortly.
                                    </div>
                                ) : (
                                    <button type="submit" className="luxury-submit-btn" disabled={formStatus.loading}>
                                        {formStatus.loading ? 'SUBMITTING...' : 'SUBMIT'}
                                    </button>
                                )}

                                {formStatus.error && <div className="form-error-msg">{formStatus.error}</div>}
                            </form>
                        </div>
                    </div>

                    <div className="contact-visual-side">
                        <div className="contact-image-wrapper">
                            <img src={getImgUrl(project.img)} alt={project.title} />

                            <div className="contact-floating-bubble">
                                <BsChatDots />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Floating Action Sidebar - Fixed Side */}
            <div className={`project-fixed-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <button
                    className="sidebar-toggle-btn"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {sidebarOpen ? <BsChevronRight /> : <BsChevronLeft />}
                </button>

                <div className="sidebar-content">
                    <button className="side-action-btn enquire" onClick={scrollToEnquiry}>
                        <BsChatDots />
                        <span>ENQUIRE NOW</span>
                    </button>
                    <button
                        className="side-action-btn brochure"
                        onClick={() => {
                            if (project.brochure) {
                                const link = document.createElement('a');
                                link.href = getImgUrl(project.brochure);
                                link.download = `${project.title}-Brochure.pdf`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            } else {
                                alert("Brochure not available for this project yet.");
                            }
                        }}
                    >
                        <BsDownload />
                        <span>BROCHURE</span>
                    </button>
                    <a
                        href={`https://wa.me/+919640010444?text=I'm interested in ${project.title}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="side-action-btn whatsapp"
                    >
                        <FaWhatsapp />
                        <span>WHATSAPP</span>
                    </a>
                </div>
            </div>

            {/* Footer-Section */}
            <ProjectFooter />
        </div>
    );
};

export default ProjectDetails;
