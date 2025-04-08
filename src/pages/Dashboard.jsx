import { useState, useEffect, React } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import firstImage from "../assets/beach-wedding.jpg";
import secondImage from "../assets/desination-wedding.webp";
import mandap from "../assets/mandap-photos.jpeg";
import desitinationWedddingTo from "../assets/Destination_wedding_2.webp";
import "../css/Dashboard.css";
import PackageDetailsModal from "../components/PackageDetailsModal";

const Dashboard = () => {
  const location = useLocation();
  const isHome = location.pathname === "/dashboard";
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [errorPackages, setErrorPackages] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showPackageModal, setShowPackageModal] = useState(false);

  const openModal = (pkg) => {
    setSelectedPackage(pkg);
    setShowPackageModal(true);
  };

  const closeModal = () => {
    setShowPackageModal(false);
    setSelectedPackage(null);
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("http://localhost:5086/api/EventPackage/all");
        if (!response.ok) throw new Error("Failed to fetch packages");
        const data = await response.json();
        setPackages(data);
      } catch (error) {
        setErrorPackages(error.message);
      } finally {
        setLoadingPackages(false);
      }
    };

    fetchPackages();
  }, []);

  // ✅ Function to handle booking package
  const handleBookPackage = async (pkg) => {
    const userId = sessionStorage.getItem("userId"); // Get user ID from session storage
    const userName = sessionStorage.getItem("userName"); // Get user name from session storage

    if (!userId) {
      toast.error("Please log in to book a package.");
      return;
    }

    // Prepare the booking data
    const bookingData = {
      userId: userId,
      userName: userName || "Guest",
      packageId: pkg.id,
      packageName: pkg.packageName,
      price: pkg.price,
      maxGuests: pkg.maxGuests,
      durationInHours: pkg.durationInHours,
      status: "Pending",
      bookedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:5086/api/BookedPackage/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error("Failed to book package. Please try again.");
      }

      toast.success(`Package "${pkg.packageName}" booked successfully!`);
      closeModal();
    } catch (error) {
      console.error("Error booking package:", error);
      toast.error("Error booking package:", error.message);
    }
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      {isHome && (
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
      )}

      {/* Render Nested Route */}
      <div className="body-content">
        <Outlet />
      </div>

      {/* Package Section */}
      {isHome && (
        <div className="package-section" style={{ padding: "2rem", backgroundColor: "#f8f9fa" }}>
          <h2 className="text-center" style={{ marginBottom: "1.5rem" }}>All-In-One Packages</h2>

          {loadingPackages ? (
            <p className="text-center">Loading packages...</p>
          ) : errorPackages ? (
            <p className="text-danger text-center">{errorPackages}</p>
          ) : (
            <div className="d-flex flex-wrap justify-content-center gap-4">
              {packages.map((pkg) => {
                const shortDesc = pkg.description?.split(" ").slice(0, 10).join(" ") + "...";

                return (
                  <div
                    key={pkg.id}
                    className="card"
                    style={{ width: "18rem", padding: "1rem", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
                  >
                    <div className="card-body">
                      <h5 className="card-title m-3">{pkg.packageName}</h5>
                      <p className="card-text">{shortDesc}</p>
                      <p><strong>Price:</strong> ₹{pkg.price}</p>
                      <p><strong>Max Guests:</strong> {pkg.maxGuests}</p>
                      <p><strong>Duration:</strong> {pkg.durationInHours} hrs</p>
                      <button className="btn btn-primary btn-sm mt-2" onClick={() => openModal(pkg)}>
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", height: "50vh" }}>
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
            <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
              We can get you married anywhere, including the sets of Shark Tank.
            </h1>
            <p style={{ fontSize: "1.2rem" }}>
              Plan your dream event with ease and elegance. Explore venues, create categories, and bring your vision to life.
            </p>
          </div>
        </div>
      </div>

      {/* Package Modal */}
      <PackageDetailsModal show={showPackageModal} onClose={closeModal} pkg={selectedPackage} onBook={handleBookPackage} />
      
    </>
  );
};

export default Dashboard;
