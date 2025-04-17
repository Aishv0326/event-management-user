import React, { useState, useEffect } from "react";
import EventModal from "./EventModal";

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [venues, setVenues] = useState([]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Get user role from session storage
    const role = sessionStorage.getItem("roleID");
    setUserRole(role ? parseInt(role) : null);

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5086/api/Categories/get-categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchVenues = async () => {
      try {
        const response = await fetch("http://localhost:5086/api/Venue/get-venues");
        const data = await response.json();
        setVenues(data);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };

    fetchCategories();
    fetchVenues();
  }, []);

  const openModal = (category) => {
    // Only allow opening modal if user is not an admin (roleId 1)
    if (userRole === 1) {
      setSelectedCategory(category);
      setModalOpen(true);
    } else {
      alert("Only regular users can book events. Admins have different privileges.");
    }
  };

  const truncateDescription = (text) => {
    const words = text.split(" ");
    return words.length > 10 ? words.slice(0, 10).join(" ") + "..." : text;
  };

  return (
    <>
      <div className="home-container">
        <h3 className="heading-style">Pick Your Event Type</h3>
        <div className="card-container">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div 
                key={category.id} 
                className={`category-card ${userRole !== 1 ? 'disabled-card' : ''}`} 
                onClick={() => openModal(category.name)}
              >
                <h3>{category.name}</h3>
                <p className="description" title={category.description}>
                  {truncateDescription(category.description)}
                </p>
                {userRole !== 1 && (
                  <div className="admin-overlay">
                    <span>Admin View Only</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>Loading categories...</p>
          )}
        </div>
      </div>

      {userRole === 1 && (
        <EventModal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          category={selectedCategory} 
          categories={categories} 
          venues={venues} 
        />
      )}
    </>
  );
};

export default Home;