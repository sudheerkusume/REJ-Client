import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../Accets/ChatGPT Image Jan 10, 2026, 06_28_46 PM.png';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { BsEnvelope, BsGeoAlt, BsArrowRight } from "react-icons/bs";

const ProjectFooter = () => {
    return (
        <footer className="footer-luxury">
            <div className="container py-5">
                <div className="row gy-5">
                    {/* Brand Section */}
                    <div className="col-lg-4 col-md-6">
                        <div className="footer-brand">
                            <img src={logo} alt="Real Estate Jobs" className="footer-logo-luxury mb-4" />
                            <p className="footer-brief">
                                <strong>Real Estate Jobs, Inc</strong> – India’s premier dedicated platform connecting the world's most talented professionals with industry-leading developers and architectural firms.
                            </p>
                            <div className="footer-social-wrap mt-4">
                                <a href="#" className="social-pill"><FaFacebookF /></a>
                                <a href="#" className="social-pill"><FaTwitter /></a>
                                <a href="#" className="social-pill"><FaInstagram /></a>
                                <a href="#" className="social-pill"><FaLinkedinIn /></a>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="col-lg-2 col-md-3 col-6">
                        <h6 className="footer-heading">GET TO KNOW US</h6>
                        <ul className="footer-links-list">
                            <li><Link to="/about">About Our Vision</Link></li>
                            <li><Link to="/contact">Contact Support</Link></li>
                            <li><Link to="/companies">Featured Developers</Link></li>
                            <li><Link to="/Clogin">Expert Portal</Link></li>
                        </ul>
                    </div>

                    {/* Careers */}
                    <div className="col-lg-3 col-md-3 col-6">
                        <h6 className="footer-heading">CAREER VERTICALS</h6>
                        <ul className="footer-links-list two-columns">
                            <li><Link to="#">Sales Experts</Link></li>
                            <li><Link to="#">Operations</Link></li>
                            <li><Link to="#">Digital Marketing</Link></li>
                            <li><Link to="#">Architecture</Link></li>
                            <li><Link to="#">Web Systems</Link></li>
                            <li><Link to="#">Legal Counsel</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div className="col-lg-3 col-md-12">
                        <h6 className="footer-heading">GET IN TOUCH</h6>
                        <div className="footer-contact-item mb-4">
                            <BsGeoAlt className="contact-icon-gold" />
                            <p>2nd Floor, YS RAO Towers, Madhapur, Hyderabad, TS 500033</p>
                        </div>

                        <div className="footer-subscribe-box mt-4">
                            <p className="small text-muted mb-3">Subscribe for exclusive property insights.</p>
                            <div className="subscribe-input-group">
                                <input type="email" placeholder="Your Professional Email" />
                                <button className="subscribe-btn"><BsArrowRight /></button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom-bar mt-5 pt-4 border-top border-dark d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <p className="footer-copyright">
                        &copy; 2026 REAL ESTATE JOBS. <span className="gold-text">ENGINEERED FOR EXCELLENCE.</span>
                    </p>
                    <div className="footer-legal-links d-flex gap-4 mt-3 mt-md-0">
                        <Link to="#">Privacy Policy</Link>
                        <Link to="#">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default ProjectFooter;
