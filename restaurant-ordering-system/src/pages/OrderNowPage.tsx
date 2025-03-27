import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext"; // Import the custom useCart hook
import { menuItems } from "../data/menu"; // Assuming you have a menu data file
import Modal from "../components/Modal"; // Import the Modal component
import axios from "axios"; // Import axios for API requests

const OrderNowPage: React.FC = () => {
  const { addToCart, cartItems } = useCart(); // Access Cart Context
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(""); // State for modal message
  const [socket, setSocket] = useState<WebSocket | null>(null); // WebSocket state

  // WebSocket setup
  useEffect(() => {
    const socketConnection = new WebSocket('ws://localhost:8080');

    socketConnection.onopen = () => {
      console.log('WebSocket connection established');
    };

    socketConnection.onmessage = (event) => {
      console.log('Message from server:', event.data);
      // Handle real-time updates here, such as new orders or changes to the order status
      const message = JSON.parse(event.data);
      if (message.type === 'new_order') {
        // Optionally, update the UI with the new order or refresh the order list
        console.log('New order received:', message.order);
      }
    };

    socketConnection.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Store the socket instance in state
    setSocket(socketConnection);

    // Clean up WebSocket connection when the component unmounts
    return () => {
      socketConnection.close();
    };
  }, []); // Empty dependency array to only run once when the component mounts

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
      console.log("Formatted Date:", orderDate);


      // Calculate the total amount by summing the prices of the items in the cart
      const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  
      const newOrder = {
        customer_id: 1, // Replace with logged-in user's ID
        order_date: orderDate, // Use the properly formatted date
        status: "Pending",
        total_amount: totalAmount, // Add total_amount here
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
  
      // Send a real-time message to the server via WebSocket after placing the order
      if (socket) {
        socket.send(JSON.stringify({ orderId, status: 'Order Placed', details: newOrder }));
      }
  
    } catch (error) {
      console.error("Error submitting order:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error response:", error.response);
        setModalMessage(`Something went wrong: ${error.response?.data?.message || error.message || 'Unknown error'}`);
      } else if (error instanceof Error) {
        setModalMessage(`Something went wrong: ${error.message}`);
      } else {
        setModalMessage('Something went wrong: Unknown error');
      }
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
