import React, { useState } from "react";
import "../css/WelcomePage.css";
import firstImage from "../assets/welcome-background.jpg";
import secondImage from "../assets/wedding-chair.avif";

const packages = [
  {
    title: "Classic Wedding",
    description: "Elegant venue, floral décor, traditional ceremonies, and premium photo & video coverage.",
    details: "This package includes a beautiful indoor venue, full wedding planning support, professional photography, and traditional rituals. Ideal for families wanting a mix of modern and traditional vibes."
  },
  {
    title: "Beach Wedding",
    description: "Sunset ceremony by the sea, tropical décor, seafood buffet, and barefoot bliss vibes.",
    details: "Get married on a dreamy beach with floral canopies, tiki bars, sunset photography, and a tropical dinner setup."
  },
  {
    title: "Luxury Royale Wedding",
    description: "5-star venue, designer outfits, celebrity artists, gourmet catering, and limousine ride.",
    details: "For the ones who want luxury! This includes a top-rated palace hotel, designer themes, celebrity entertainers, and 7-course meals."
  },
  {
    title: "Birthday Bash",
    description: "Colorful themes, custom cake, games & entertainment, balloon décor, and DJ night fun.",
    details: "Celebrate with customized themes, party games, a dance floor, snacks corner, and a memorable party night!"
  },
  {
    title: "Corporate Gala",
    description: "Elegant conference hall setup, AV support, customized branding, and fine dining.",
    details: "Ideal for product launches, team events or networking. AV-ready halls, branding walls, and curated menus included."
  },
  {
    title: "Baby Shower",
    description: "Cute themes, pastel décor, return gifts, games & announcements, all tailored with love.",
    details: "Celebrate the arrival of your little one with fun games, soft pastel décor, and heartwarming moments."
  },
];

const WelcomePage = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);

  const openModal = (pkg) => {
    setSelectedPackage(pkg);
  };

  const closeModal = () => {
    setSelectedPackage(null);
  };

  return (
    <div>
        <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            padding: "1rem 2rem", 
            backgroundColor: "#f8f8f8", 
            borderBottom: "1px solid #ddd" 
            }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Event Manager</h2>
            <button
                onClick={() => navigate("/login")}
                style={{ 
                padding: "8px 16px", 
                backgroundColor: "#f97316", 
                color: "#fff", 
                border: "none", 
                borderRadius: "5px", 
                cursor: "pointer" 
                }}
            >
                <a href="/login" style={{ color: "#fff", textDecoration: "none", fontWeight: 700, }}>Login</a>
            </button>
        </div>
      {/* First Section */}
      <div style={{ display: "flex", height: "100vh" }}>
        <div className="text-section">
          <div className="text-center card-text">
            <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>A Dream Event Planner</h1>
            <p style={{ fontSize: "1.2rem" }}>
              Plan your dream event with ease and elegance. Explore venues, create categories, and bring your vision to life.
            </p>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            backgroundImage: `url(${firstImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>

      {/* Packages Section */}
      <div style={{ padding: "60px 20px", backgroundColor: "#fff" }}>
        <u><h2 style={{ textAlign: "center", fontSize: "2.2rem", marginBottom: "4rem", fontFamily: "cursive" }}>Event Packages For Every Occasion</h2></u>

        <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
          {packages.map((pkg, index) => (
            <div
              key={index}
              className="cardStyle"
              onClick={() => openModal(pkg)}
              style={{ cursor: "pointer" }}
            >
              <h3 className="titleStyle">{pkg.title}</h3>
              <p>{pkg.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Second Section */}
      <div style={{ display: "flex", height: "100vh" }}>
        <div
          style={{
            flex: 1,
            backgroundImage: `url(${secondImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="text-section">
          <div className="text-center card-text">
            <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>We can get you married anywhere, including the sets of Shark Tank.</h1>
            <p style={{ fontSize: "1.2rem" }}>
              Plan your dream event with ease and elegance. Explore venues, create categories, and bring your vision to life.
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedPackage && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <button onClick={closeModal} style={closeButton}>×</button>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>{selectedPackage.title}</h2>
            <p>{selectedPackage.details}</p>
            <button
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#f97316",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              <a href="/login" style={{ color: "#fff", textDecoration: "none", fontWeight: 700, }}>Book Now</a>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modalContent = {
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "10px",
  maxWidth: "500px",
  width: "90%",
  position: "relative",
};

const closeButton = {
  position: "absolute",
  top: "10px",
  right: "15px",
  fontSize: "1.5rem",
  background: "none",
  border: "none",
  cursor: "pointer",
};

export default WelcomePage;
