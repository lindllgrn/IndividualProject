import { Link } from "react-router-dom";
import React from "react";
import { useCart } from "../context/CartContext"; // Import the custom useCart hook

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart(); // Access cart context
  
  // Debugging cartItems
  console.log("Cart Items: ", cartItems);

  const handleRemove = (id: number) => {
    removeFromCart(id);
  };

  const handleQuantityChange = (id: number, change: number) => {
    updateQuantity(id, change); // Update quantity using the context method
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, cartItem) => total + cartItem.price * cartItem.quantity, 0)
      .toFixed(2);
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty. Start adding items!</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((cartItem) => {
            // Ensure the price is a valid number
            const price = parseFloat(cartItem.price.toString());
            const formattedPrice = isNaN(price) ? 0.00 : price.toFixed(2);

            return (
              <div key={cartItem.id} className="cart-item">
                <img src={cartItem.image} alt={cartItem.name} />
                <div className="cart-item-details">
                  <h3>{cartItem.name}</h3>
                  {/* Use formattedPrice instead of item.price */}
                  <p>${formattedPrice}</p>
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(cartItem.id, -1)}>-</button>
                    <span>{cartItem.quantity}</span>
                    <button onClick={() => handleQuantityChange(cartItem.id, 1)}>+</button>
                  </div>
                  <button className="remove-item" onClick={() => handleRemove(cartItem.id)}>Remove</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="cart-summary">
        <h2>Total: ${calculateTotal()}</h2>
        <Link to="/checkout" className="proceed-to-checkout">Proceed to Checkout</Link>
      </div>
    </div>
  );
};

export default CartPage;
