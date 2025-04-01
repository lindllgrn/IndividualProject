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
    (total, item) => {
      const price = parseFloat(item.price.toString()); // Ensure price is a number
      return total + (isNaN(price) ? 0 : price * item.quantity);
    },
    0
  );

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission (simulate order placement and update database)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create order object to send to the backend
    const order = {
      customer: formData,
      items: cartItems,
      totalPrice,
    };

    try {
      // Send the order to the backend (using the POST method)
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order), // Send the order data
      });

      // Check if the order was successfully placed
      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // Success message from backend

        setIsOrderPlaced(true);
        clearCart(); // Clear the cart after order is placed
      } else {
        // Handle error
        console.error('Error placing order');
      }
    } catch (error) {
      console.error('Failed to place order:', error);
    }
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
              {cartItems.map((item) => {
                // Ensure price is a valid number before formatting
                const price = parseFloat(item.price.toString());
                const formattedPrice = isNaN(price) ? 0.00 : price.toFixed(2);

                return (
                  <li key={item.id}>
                    <img src={item.image} alt={item.name} />
                    <div>
                      <p>{item.name}</p>
                      <p>
                        {item.quantity} x ${formattedPrice}
                      </p>
                      <p>
                        ${((price * item.quantity) || 0).toFixed(2)}
                      </p>
                    </div>
                  </li>
                );
              })}
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
