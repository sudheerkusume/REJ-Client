import React from "react";

const items = [
    { title: "Brigade", img: "/companies-icons/brigade.jpeg" },
    { title: "Cybercity", img: "/companies-icons/cybercity.jpg" },
    { title: "DLF", img: "/companies-icons/dlf.png" },
    { title: "Honer", img: "/companies-icons/honer.jpg" },
    { title: "Jayabheri", img: "/companies-icons/jayabheri.jpg" },
    { title: "Lodha", img: "/companies-icons/lodha.jpg" },
    { title: "Muppa", img: "/companies-icons/muppa.jpeg" },
    { title: "My Home Group", img: "/companies-icons/myhomegroup.png" },
    { title: "NCC", img: "/companies-icons/ncc.jpg" },
    { title: "Prestige Group", img: "/companies-icons/prestigegroup.png" },
    { title: "Radhey", img: "/companies-icons/radhey.jpg" },
    { title: "Rajapushpa", img: "/companies-icons/rajpushpagroup.jpg" },
    { title: "Ramky", img: "/companies-icons/ramkeygroup.jpg" },
];

const MarqueeSection = () => {
    return (
        <section className="marquee-wrapper m-5">
            <h5 className="text-center mb-4 text-muted">Trusted by Top Companies</h5>
            <div className="marquee">
                <div className="marquee-track">
                    {[...items, ...items].map((item, index) => (
                        <div className="marquee-card" key={index}>
                            <img src={item.img} alt={item.title} className="marquee-logo" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MarqueeSection;
