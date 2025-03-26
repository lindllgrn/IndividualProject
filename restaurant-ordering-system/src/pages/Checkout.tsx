// src/pages/CheckoutPage.tsx
import React, { useState } from "react";
import { useCart } from "../context/CartContext"; // Import CartContext hook
import { Link } from "react-router-dom";

const CheckoutPage: React.FC = () => {
  const { cartItems, clearCart } = useCart(); // Access Cart Context
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission (simulate order placement)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate order placement
    setIsOrderPlaced(true);
    clearCart(); // Clear the cart after order is placed
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {isOrderPlaced ? (
        <div className="order-confirmation">
          <h2>Thank you for your order!</h2>
          <p>Your order has been successfully placed. We will contact you soon!</p>
          <Link to="/">Go back to Home</Link>
        </div>
      ) : (
        <div>
          <div className="cart-summary">
            <h2>Cart Summary</h2>
            <ul>
              {cartItems.map((item) => (
                <li key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <p>{item.name}</p>
                    <p>
                      {item.quantity} x ${item.price.toFixed(2)}
                    </p>
                    <p>
                      ${ (item.price * item.quantity).toFixed(2) }
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="total-price">
              <p>Total: ${totalPrice.toFixed(2)}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="billing-form">
            <h2>Billing Information</h2>

            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Address:
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Phone:
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </label>

            <button type="submit">Place Order</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
