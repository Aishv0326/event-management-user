import { useState, useEffect } from "react";
import EventCategoryModal from "./EventCategoryModal"; // Import modal

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for modal

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5086/api/Categories/get-categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h2 className="title">Event Categories</h2>
        <button className="btn btn-primary create-category-btn" onClick={() => setShowModal(true)}>
          Create Event Category
        </button>
      </div>

      {loading && <p>Loading categories...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <table className="category-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No categories found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Event Category Modal */}
      <EventCategoryModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default CategoriesPage;
