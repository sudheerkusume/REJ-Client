import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Hero = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="hero-container">

            {/* Background Image */}
            <img
                src="/city.jpg"
                alt="Real Estate"
                className="hero-image"
            />

            {/* Floating Button */}
            <button
                className="video-btn"
                onClick={() => setIsOpen(true)}
            >
                ▶ Office Tour
            </button>

            {/* Video Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                        >
                            <button
                                className="close-btn"
                                onClick={() => setIsOpen(false)}
                            >
                                ✖
                            </button>

                            <video
                                src="/realestate-video.mp4"
                                controls
                                autoPlay
                                style={{ width: "100%", borderRadius: "15px" }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Hero;
