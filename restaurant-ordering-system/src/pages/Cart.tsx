import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, removeFromCart, clearCart, archiveOrder } = useCart();

  const handleCheckout = () => {
    // Here, archive the current cart and clear it afterward
    archiveOrder(cart);
    clearCart();
    // Proceed to checkout logic
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty. <a href="/menu">Go back to the menu</a></p>
      ) : (
        <div>
          {cart.map((cartItem) => (
            <div key={cartItem.item.id} className="cart-item">
              <img src={cartItem.item.image} alt={cartItem.item.name} />
              <div>
                <h3>{cartItem.item.name}</h3>
                <p>Quantity: {cartItem.quantity}</p>
                <p>Price: ${cartItem.item.price.toFixed(2)}</p>
              </div>
              <button onClick={() => removeFromCart(cartItem.item.id)}>Remove</button>
            </div>
          ))}
          <button onClick={handleCheckout}>Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
};

export default Cart;
