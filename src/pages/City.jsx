import Aos from "aos";
import api from "../config/api";
import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const City = () => {
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/jobCategories").then((res) => {
      const grouped = res.data.reduce((acc, job) => {
        if (!acc[job.location]) {
          acc[job.location] = {
            name: job.location,
            image: job.image2 || null, // ✅ prevent empty string
            jobs: 0,
          };
        }
        acc[job.location].jobs += 1;
        return acc;
      }, {});

      setCities(Object.values(grouped));

      setTimeout(() => Aos.refresh(), 300);
    });
  }, []);

  return (
    <section className="city-section">
      <p className="city-subtitle">TOP CITIES</p>
      <h3 className="city-title">Explore Jobs by City</h3>

      <div className="city-grid">
        {cities.map((city) => (
          <div
            className="city-card"
            key={city.name} // ✅ stable unique key
            onClick={() =>
              navigate(`/jobs/city/${encodeURIComponent(city.name)}`)
            }
          >
            {/* ✅ render image ONLY if exists */}
            {city.image && (
              <img
                src={city.image}
                alt={city.name}
                loading="lazy"
                decoding="async"
              />
            )}

            <div className="city-overlay">
              <div>
                <h4>{city.name}</h4>
                <p>{city.jobs} Jobs Available</p>
              </div>
              <IoIosArrowForward className="city-arrow" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default City;
