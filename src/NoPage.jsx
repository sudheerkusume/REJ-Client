import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsArrowLeft, BsHouse } from 'react-icons/bs';
import errorImage from '../src/Accets/Error_PA.png';
import AOS from 'aos';
import 'aos/dist/aos.css';

const NoPage = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    return (
        <div className="nopage-wrapper text-center">
            {/* AMBIENT BACKGROUND ELEMENTS */}
            <div className="position-absolute top-0 start-0 w-100 h-100 opacity-25" style={{ background: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }}></div>

            <div className="nopage-content px-4" data-aos="zoom-in">
                <div className="error-visual-container">
                    <img
                        src={errorImage}
                        alt="Lost in Space"
                        className="error-img-stylized"
                    />
                </div>

                <div className="mt-5">
                    <h2 className="nopage-title">Oops! You're Off the Map</h2>
                    <p className="nopage-text">
                        The property or page you're searching for seems to have moved or
                        never existed. Let's get you back to familiar territory.
                    </p>

                    <Link to="/" className="return-home-btn">
                        <BsHouse className="fs-5" />
                        Go Back to Home Hub
                    </Link>

                    <div className="mt-4">
                        <Link to="/jobs" className="text-decoration-none text-muted small d-inline-flex align-items-center gap-2 hover-opacity-100 transition-all" style={{ opacity: 0.7 }}>
                            <BsArrowLeft /> Browse All Opportunities
                        </Link>
                    </div>
                </div>
            </div>

            {/* DECORATIVE BLURS */}
            <div className="position-absolute bottom-0 end-0 p-5 opacity-25" style={{ filter: 'blur(100px)', background: '#4f46e5', width: 300, height: 300, borderRadius: '50%' }}></div>
            <div className="position-absolute top-0 start-0 p-5 opacity-10" style={{ filter: 'blur(80px)', background: '#0ea5e9', width: 200, height: 200, borderRadius: '50%' }}></div>
        </div>
    );
};

export default NoPage;