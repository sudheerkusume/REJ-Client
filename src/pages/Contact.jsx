import api from "../config/api";
import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/Enquiries", {
        user: name,
        mobile,
        email,
        message,
      });

      alert(" Your Enquiry Sent Successfully");

      setName("");
      setMobile("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      alert(" Failed to send enquiry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-premium-section">
      <div className="container">

        {/* HEADER */}
        <div className="text-center mb-5" data-aos="fade-up">
          <span className="contact-badge">GET IN TOUCH</span>
          <h2 className="contact-title">
            Let’s Build Your <span>Real Estate Career</span>
          </h2>
          <p className="contact-subtitle">
            Whether you’re hiring, applying, or partnering — we’re here to help.
          </p>
        </div>

        {/* TRUST STATS */}
        <div className="trust-strip" data-aos="fade-up">
          <div><strong>5,000+</strong><span>Job Seekers</span></div>
          <div><strong>300+</strong><span>Companies</span></div>
          <div><strong>10,000+</strong><span>Enquiries Handled</span></div>
        </div>

        <div className="row align-items-center g-5 mt-4">

          {/* FORM */}
          <div className="col-lg-6" data-aos="fade-right">
            <div className="contact-glass-card">
              <h4 className="fw-semibold mb-4">Send an Enquiry</h4>

              <form onSubmit={submitHandler}>
                <input
                  type="text"
                  value={name}
                  placeholder="Full Name"
                  className="form-control premium-input"
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <input
                  type="tel"
                  value={mobile}
                  placeholder="Mobile Number"
                  className="form-control premium-input"
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />

                <input
                  type="email"
                  value={email}
                  placeholder="Email Address"
                  className="form-control premium-input"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <textarea
                  value={message}
                  rows="4"
                  placeholder="Tell us how we can help you"
                  className="form-control premium-input"
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />

                <button
                  className="premium-submit-btn"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Enquiry →"}
                </button>
              </form>
            </div>
          </div>

          {/* INFO */}
          <div className="col-lg-6" data-aos="fade-left">
            <div className="contact-info-wrapper text-center">

              <div className="info-card">
                <div className="info-icon-box"><FaPhoneAlt /></div>
                <div>
                  <h6>Customer Support</h6>
                  <p><span className="live-dot"></span>+91 96400 10444</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon-box"><FaEnvelope /></div>
                <div>
                  <h6>Email Address</h6>
                  <p>support@realestatejobs.co.in</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon-box"><FaMapMarkerAlt /></div>
                <div>
                  <h6>Corporate Office</h6>
                  <p>Hyderabad, Telangana</p>
                </div>
              </div>

              <div className="map-box mt-4">
                <iframe
                  src="https://www.google.com/maps?q=Hyderabad&output=embed"
                  height="230"
                  loading="lazy"
                  title="Office Location"
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
