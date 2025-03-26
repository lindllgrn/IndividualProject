// src/pages/OrderNowPage.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext"; // Import the custom useCart hook
import { menuItems } from "../data/menu"; // Assuming you have a menu data file
import Modal from "../components/Modal"; // Import the Modal component
import axios from "axios"; // Import axios for API requests

const OrderNowPage: React.FC = () => {
  const { addToCart, cartItems } = useCart(); // Access Cart Context
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(""); // State for modal message

  // Handle adding items to cart
  const handleAddToCart = (item: any) => {
    addToCart(item);
    setModalMessage(`${item.name} has been added to your cart!`); // Set the message
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Submit the order to the backend (Real-time order)
  const handleSubmitOrder = async () => {
    try {
      const orderDate = new Date().toISOString();
      console.log("Submitting order...");
  
      const newOrder = {
        customer_id: 1, // Replace with logged-in user's ID
        order_date: orderDate,
        status: "Pending",
      };
  
      console.log("New order:", newOrder);
  
      // Send the new order to the backend
      const response = await axios.post("http://localhost:5000/api/orders", newOrder);
      console.log("Order response:", response);
  
      const orderId = response.data.order_id;
  
      // Send order items to the backend
      for (const item of cartItems) {
        const orderItem = {
          order_id: orderId,
          menu_item_id: item.id,
          quantity: item.quantity,
          price: item.price,
          special_instructions: item.specialInstructions || "",
        };
  
        console.log("Sending order item:", orderItem);
  
        await axios.post("http://localhost:5000/api/order_items", orderItem);
      }
  
      setModalMessage("Your order has been placed!");
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error submitting order:", error);
      setModalMessage("Something went wrong. Please try again.");
      setIsModalOpen(true);
    }
  };
  

  return (
    <div className="order-now">
      <h1>Order Now</h1>
      <div className="menu-items">
        {menuItems.map((item) => (
          <div key={item.id} className="menu-item-card">
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>${item.price.toFixed(2)}</p>
            <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
          </div>
        ))}
      </div>
      <div className="order-summary">
        <h2>Order Summary</h2>
        {/* Display items in the cart */}
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} - {item.quantity} x ${item.price.toFixed(2)}
            </li>
          ))}
        </ul>
        <p>Total: ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</p>
        <button onClick={handleSubmitOrder}>Submit Order</button>
        <Link to="/cart">Go to Cart</Link>
      </div>
      {isModalOpen && (
        <Modal message={modalMessage} onClose={closeModal} />
      )}
    </div>
  );
};

export default OrderNowPage;
