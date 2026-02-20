import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../Accets/ChatGPT Image Jan 10, 2026, 06_28_46 PM.png';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";


const Footer = () => {
  return (
    <footer className="footer-dark bg-dark text-light py-5 px-3">
      <div className="container">
        <div className="row gy-4 text-start">
          {/* Get to Know Us */}
          <div className="col-md-3 col-sm-6">
            <h6 className="fw-bold mb-3">Get to Know Us</h6>
            <ul className="list-unstyled small">
              <li className='mb-2'><Link to="/about" className="footericon-hover-link d-block mb-1">About Us</Link></li>
              <li><Link to="/contact" className="footericon-hover-link d-block mb-1">Contact Us</Link></li>
              <li><Link to="/companies" className="footericon-hover-link d-block mb-1">Companies</Link></li>
              <li><Link to="/Clogin" className="footericon-hover-link d-block mb-1">Login</Link></li>

            </ul>
          </div>

          {/* career option */}
          <div className="col-md-3 col-sm-6">
            <h6 className="fw-bold mb-3">Career Option</h6>
            <ul className="list-unstyled small" style={{ fontSize: "13px", letterSpacing: "1px", color: "lightblue" }}>
              <li className='mb-2'><Link to="#" className="footer-hover-link d-block">Channel Partners</Link></li>
              <li className='mb-2'><Link to="#" className="footer-hover-link d-block">HR & Operations</Link></li>
              <li className='mb-2'><Link to="#" className="footer-hover-link d-block">Real Estate Sales</Link></li>
              <li className='mb-2'><Link to="#" className="footer-hover-link d-block">Tele Caller</Link></li>
              <li className='mb-2'><Link to="#" className="footer-hover-link d-block">Digital Marketing</Link></li>
              <li className='mb-2'><Link to="#" className="footer-hover-link d-block">Web Development</Link></li>
              <li className='mb-2'><Link to="#" className="footer-hover-link d-block">CRM Executive</Link></li>
              <li className='mb-2'><Link to="#" className="footer-hover-link d-block">Accounts & Auditing</Link></li>
              <li className='mb-2'><Link to="#" className="footer-hover-link d-block">Legal</Link></li>
              <li className='mb-2'><Link to="#" className="footer-hover-link d-block">Architects</Link></li>

            </ul>

          </div>

          <div className="col-md-3 col-sm-6">
            <img
              src={logo}
              alt="Real Estate Jobs"
              className="footer-logo"
            />

            <p className="footer-description">
              Welcome to <strong>Real Estate Jobs, Inc</strong> – India’s first and only
              dedicated job portal exclusively designed for the real estate industry.
            </p>

            <p className="footer-description">
              Whether you are a job seeker looking to build a career in real estate or
              an employer searching for top talent, we are here to connect you with
              the right opportunities and resources.
            </p>
          </div>

          {/* Follow Us */}
          {/* <div className="col-md-3 col-sm-6">
          </div> */}

          {/* Newsletter */}
          <div className="col-md-3 col-sm-6">
            <h6 className="fw-bold mb-4">Get In Touch</h6>
            <p className="footer-description mb-3">
              <strong>Corporate Office:</strong><br />
              2nd Floor, YS RAO Towers, Madhapur Rd, Sri Rama Colony, Jubilee Hills, Hyderabad, Telangana 500033
            </p>

            <form className="d-flex flex-column flex-sm-row">
              <input
                type="email"
                placeholder="Email"
                className="form-control me-sm-2 mb-2 mb-sm-0"
              />
              <button type="submit" className="btn btn-outline-light">→</button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="row text-center mt-4 pt-3 border-top border-secondary small">
          <div className="col-md-9 d-flex flex-column flex-sm-row justify-content-between align-items-center">
            <p className="mb-1 mb-sm-0">
              © 2026 Real Estate Jobs. All rights reserved.
            </p>

          </div>
          <div className="col-md-3 d-flex flex-column flex-sm-row justify-content-between align-items-center">
            <div className="d-flex gap-3 mt-3">
              <a href="#!" className="social-icon">
                <FaFacebookF />
              </a>
              <a href="#!" className="social-icon">
                <FaTwitter />
              </a>
              <a href="#!" className="social-icon">
                <FaInstagram />
              </a>
              <a href="#!" className="social-pill-original">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
