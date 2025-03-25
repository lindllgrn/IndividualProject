import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Checkout = () => {
  const { cart, removeFromCart } = useCart();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  // Calculate the total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.item.price * item.quantity, 0);
  };

  // Handle form submission (order submission)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here, you would typically send the order details to a backend API
    // For now, let's just clear the cart and log the order to the console
    console.log("Order Submitted:", { name, address, paymentMethod, cart });
    // Clear the cart after order is placed
    cart.forEach((item) => removeFromCart(item.item.id));
    alert("Order placed successfully!");
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty. <Link to="/menu">Go back to the menu</Link></p>
      ) : (
        <div>
          <h2>Order Summary</h2>
          <div className="checkout-items">
            {cart.map((cartItem) => (
              <div key={cartItem.item.id} className="checkout-item">
                <img
                  src={cartItem.item.image}
                  alt={cartItem.item.name}
                  className="checkout-item-image"
                />
                <div>
                  <h3>{cartItem.item.name}</h3>
                  <p>${cartItem.item.price.toFixed(2)}</p>
                  <p>Quantity: {cartItem.quantity}</p>
                  <button onClick={() => removeFromCart(cartItem.item.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="total-container">
            <p>Total: ${calculateTotal().toFixed(2)}</p>
          </div>

          <form onSubmit={handleSubmit} className="checkout-form">
            <h2>Customer Information</h2>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <label htmlFor="payment-method">Payment Method:</label>
            <select
              id="payment-method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            >
              <option value="credit-card">Credit Card</option>
              <option value="paypal">PayPal</option>
            </select>
            <button type="submit">Place Order</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Checkout;
