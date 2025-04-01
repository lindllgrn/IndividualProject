import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext"; // Import the custom useCart hook
import Modal from "../components/Modal"; // Import the Modal component
import axios from "axios"; // Import axios for API requests

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  specialInstructions?: string; // Add optional property for special instructions
}

const OrderNowPage: React.FC = () => {
  const { addToCart, cartItems } = useCart(); // Access Cart Context
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(""); // State for modal message
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]); // State for menu items
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(""); // State for error message
  const [isSubmitting, setIsSubmitting] = useState(false); // State for order submission
  
  // Fetch the menu items from the database
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/menu");
        setMenuItems(response.data); // Update state with the fetched menu items
      } catch (error) {
        // Assert that error is of type Error
        if (error instanceof Error) {
          setError(`Error fetching menu items: ${error.message}`);
        } else {
          // In case error is not an instance of Error, handle gracefully
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []); // Only fetch once when the component mounts

  // Handle adding items to cart
  const handleAddToCart = (item: MenuItem) => {
    // Convert price to a number if it's a string or any invalid value
    const price = typeof item.price === "number" ? item.price : parseFloat(item.price as string);
  
    // If the price is still not a valid number, default it to 0.00
    const formattedPrice = isNaN(price) ? 0.00 : price;
  
    const cartItem = {
      item: item,          // Add the 'item' property that holds the full MenuItem
      price: formattedPrice,
      quantity: 1,         // Default quantity
      id: item.id,
      name: item.name,
      description: item.description,
      image: item.image,
      specialInstructions: item.specialInstructions || "", // Optional property
    };
  
    addToCart(cartItem);  // Pass the CartItem to the addToCart function
    setModalMessage(`${item.name} has been added to your cart!`);
    setIsModalOpen(true);
  };
  
  

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Submit the order to the backend (Real-time order)
  const handleSubmitOrder = async () => {
    setIsSubmitting(true); // Set submitting state to true

    try {
      const orderDate = new Date().toISOString();
      console.log("Formatted Date:", orderDate);

      const totalAmount = cartItems.reduce((total, item) => {
        const price = parseFloat(item.price.toString());
        const formattedPrice = isNaN(price) ? 0.00 : price;
        return total + formattedPrice * item.quantity;
      }, 0);

      const newOrder = {
        customer_id: 1,
        order_date: orderDate,
        status: "Pending",
        total_amount: totalAmount,
      };

      console.log("New order:", newOrder);

      const response = await axios.post("http://localhost:5000/api/orders", newOrder);
      console.log("Order response:", response);

      const orderId = response.data.order_id;

      for (const item of cartItems) {
        const orderItem = {
          order_id: orderId,
          menu_item_id: item.id,
          quantity: item.quantity,
          price: item.price,
          special_instructions: item.specialInstructions || "", // Handle optional special instructions
        };

        console.log("Sending order item:", orderItem);
        await axios.post("http://localhost:5000/api/order_items", orderItem);
      }

      setModalMessage("Your order has been placed!");
      setIsModalOpen(true);

    } catch (error) {
      // Safely access error.message with type assertion
      if (error instanceof Error) {
        setModalMessage(`Something went wrong: ${error.message}`);
      } else {
        setModalMessage("An unknown error occurred.");
      }
      setIsModalOpen(true);
    } finally {
      setIsSubmitting(false); // Set submitting state to false when done
    }
  };

  if (loading) return <p>Loading menu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="order-now">
      <h1>Order Now</h1>

      {/* Display the full menu for selection */}
      <div className="menu-items">
        {menuItems.length > 0 ? (
          menuItems.map((item) => {
            const price = parseFloat(item.price.toString());
            const formattedPrice = isNaN(price) ? "0.00" : price.toFixed(2);

            return (
              <div key={item.id} className="menu-item-card">
                <img src={item.image} alt={item.name} />
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                ${formattedPrice}
                <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
              </div>
            );
          })
        ) : (
          <p>No menu items available.</p>
        )}
      </div>

      {/* Order Summary Section */}
      <div className="order-summary">
        <h2>Order Summary</h2>
        <ul>
          {cartItems.map((item) => {
            const price = parseFloat(item.price.toString());
            const formattedPrice = isNaN(price) ? "0.00" : price.toFixed(2);

            return (
              <li key={item.id}>
                {item.name} - {item.quantity} x ${formattedPrice}
              </li>
            );
          })}
        </ul>
        <p>Total: ${cartItems.reduce((total, item) => {
          const price = parseFloat(item.price.toString());
          const formattedPrice = isNaN(price) ? 0.00 : price;
          return total + formattedPrice * item.quantity;
        }, 0).toFixed(2)}</p>
        <button onClick={handleSubmitOrder} disabled={isSubmitting}>
          {isSubmitting ? "Submitting Order..." : "Submit Order"}
        </button>
        <Link to="/cart">Go to Cart</Link>
      </div>

      {/* Modal for success message */}
      {isModalOpen && (
        <Modal message={modalMessage} onClose={closeModal} />
      )}
    </div>
  );
};

export default OrderNowPage;
