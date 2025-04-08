import React from "react";

const categories = [
  {
    name: "Music",
    description:
      "Experience the best live music performances from top artists.",
  },
  {
    name: "Festival",
    description: "Celebrate culture, art, and entertainment at our festivals.",
  },
  {
    name: "Food and Drink",
    description: "Indulge in a variety of delicious food and beverages.",
  },
  {
    name: "Learning",
    description:
      "Engage in educational experiences and skill-building sessions.",
  },
];

const CategoryCarousel = () => {
  return (
    <div
      id="categoryCarousel"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      {/* Indicators */}
      <div className="carousel-indicators">
        {categories.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#categoryCarousel"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : ""}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Carousel Items */}
      <div className="carousel-inner">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <div
              className="carousel-slide"
              style={{ backgroundImage: `url(${category.image})` }}
            >
              <div className="overlay">
                <h2>{category.name}</h2>
                <p>{category.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Previous & Next Buttons */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#categoryCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#categoryCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default CategoryCarousel;
