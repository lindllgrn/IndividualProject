import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Experience Dining Like Never Before</h2>
          <p>Indulge in our chef's specials, handcrafted for every moment.</p>
          <button className="cta-button">
            <Link to="/menu">Explore the Menu</Link>
          </button>
        </div>
      </section>

      {/* Featured Items */}
      <section className="featured-items">
        <h3>Featured Dishes</h3>
        <div className="items">
          <div className="item">
            <img src="/images/featured1.jpg" alt="Dish 1" />
            <h4>Classic Lasagna</h4>
            <p>Layers of love with our rich tomato sauce, cheese, and a secret touch.</p>
            <button>Order Now</button>
          </div>
          <div className="item">
            <img src="/images/featured2.jpg" alt="Dish 2" />
            <h4>Grilled Chicken Alfredo</h4>
            <p>Tender chicken paired with creamy Alfredo sauce on perfectly cooked pasta.</p>
            <button>Order Now</button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <p>Join us for an unforgettable dining experience.</p>
        <button className="cta-button">
          <Link to="/order">Reserve a Table</Link>
        </button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 La Bella Cucina. All rights reserved.</p>
        <div className="social-media">
          <a href="#">Facebook</a>
          <a href="#">Instagram</a>
          <a href="#">Twitter</a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
