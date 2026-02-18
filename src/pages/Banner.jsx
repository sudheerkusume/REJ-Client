import React, { useEffect, useState } from "react";
import { BsPeople, BsBriefcase, BsCheckCircle, BsBuilding } from "react-icons/bs";

const StatItem = ({ value, label, icon, start }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startVal = 0;
    const end = value;
    const duration = 2000;
    const increment = Math.ceil(end / (duration / 30));

    const counter = setInterval(() => {
      startVal += increment;
      if (startVal >= end) {
        setCount(end);
        clearInterval(counter);
      } else {
        setCount(startVal);
      }
    }, 30);

    return () => clearInterval(counter);
  }, [value, start]);

  return (
    <div className="stat-card">
      <div className="stat-icon-wrapper">
        {icon}
      </div>
      <h3>{count}+</h3>
      <p>{label}</p>
    </div>
  );
};

const Banner = () => {
  const [startAnimation, setStartAnimation] = useState(false);

  return (
    <section
      className="stats-banner"
      onMouseEnter={() => setStartAnimation(true)}
    >
      <div className="stats-overlay">
        <div className="stats-container">

          <h2 className="stats-title">Real Estate Jobs Stats</h2>

          <p className="stats-desc">
            Connecting top real estate companies with skilled professionals.
            Thousands of opportunities, trusted employers, and growing careers.
          </p>

          <div className="stats-grid">
            <StatItem value={1930} label="Candidates" icon={<BsPeople />} start={startAnimation} />
            <StatItem value={1660} label="Jobs Posted" icon={<BsBriefcase />} start={startAnimation} />
            <StatItem value={1120} label="Jobs Filled" icon={<BsCheckCircle />} start={startAnimation} />
            <StatItem value={400} label="Companies" icon={<BsBuilding />} start={startAnimation} />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Banner;
