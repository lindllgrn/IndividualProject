import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const OrderHistory = () => {
  const { archivedOrders } = useCart();

  return (
    <div className="order-history-container">
      <h1>Order History</h1>

      {archivedOrders.length === 0 ? (
        <p>No orders placed yet. <Link to="/menu">Go back to the menu</Link></p>
      ) : (
        <div>
          {archivedOrders.map((order, index) => (
            <div key={index} className="order-summary">
              <h2>Order #{index + 1}</h2>
              <div>
                {order.map((cartItem) => (
                  <div key={cartItem.item.id} className="order-item">
                    <img
                      src={cartItem.item.image}
                      alt={cartItem.item.name}
                      className="order-item-image"
                    />
                    <div>
                      <h3>{cartItem.item.name}</h3>
                      <p>Quantity: {cartItem.quantity}</p>
                      <p>Price: ${cartItem.item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
