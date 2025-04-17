import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import VenueModal from "./VenueModal"; // Import Venue Modal

const Navbar = () => {
  const [showVenueModal, setShowVenueModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const roleID = parseInt(sessionStorage.getItem("roleID"));

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <h2 className="logo">WendyEventify</h2>
        <ul className="nav-links">
          <li>
            <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
              Home
            </Link>
          </li>

          {/* Only show for non-roleID 1 users */}
            <>
              {roleID === 0 && ( 
              <li>
                <Link to="/dashboard/package" className={location.pathname === "/dashboard/package" ? "active" : ""}>
                  Package
                </Link>
              </li> 
              )}
              {roleID === 0 && (             
              <li>
                <Link to="/dashboard/category" className={location.pathname === "/dashboard/category" ? "active" : ""}>
                  Event Categories
                </Link>
              </li>
              )}
              {roleID === 0 && (
              <li>
                <Link to="/dashboard/venues" className={location.pathname === "/dashboard/venues" ? "active" : ""}>
                  Venue List
                </Link>          
              </li>
              )}
              
              <li>
                <Link to="/dashboard/event" className={location.pathname === "/dashboard/event" ? "active" : ""}>
                  Booked Events
                </Link>
              </li>
                        
              <li>
                <Link to="/dashboard/booked-packages" className={location.pathname === "/dashboard/booked-packages" ? "active" : ""}>
                  Booked Packages
                </Link>
              </li>

              {roleID === 0 && (
                
                <li>
                  <Link to="/dashboard/service-price" className={location.pathname === "/dashboard/service-price" ? "active" : ""}>
                    Service Pricing
                  </Link>
                </li>
              )}
            </>
          

          <li>
            <button className="btn btn-danger logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Venue Modal */}
      <VenueModal show={showVenueModal} onClose={() => setShowVenueModal(false)} />
    </>
  );
};

export default Navbar;
