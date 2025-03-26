import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { menuItems } from "./data/menu";
import { CartProvider } from "./context/CartContext"; // Import CartProvider
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import OrderNowPage from "./pages/OrderNowPage"; // Import the OrderNowPage component
import CartPage from "./pages/Cart"; // Cart Page
import CheckoutPage from "./pages/Checkout"; // Checkout Page (if you have it)
import ContactPage from "./pages/ContactPage";

const App = () => {
  return (
    <CartProvider>
      <Router>
      <header className="header">
        <Link to="/" className="logo">
          <h1>La Bella Cucina</h1>
        </Link>
        <ul className="nav-links">
            <li><Link to="/menu" className="nav-link">Menu</Link></li>
            <li><Link to="/order" className="nav-link">Order Now</Link></li>
            <li><Link to="/contact" className="nav-link">Contact Us</Link></li>
            <li><Link to="/cart" className="nav-link">Cart</Link></li>
          </ul>
      </header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage menuItems={menuItems} />} />
          <Route path="/order" element={<OrderNowPage />} /> {/* Add the OrderNowPage route */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/contact" element={<ContactPage />} /> {/* Add this route */}
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
