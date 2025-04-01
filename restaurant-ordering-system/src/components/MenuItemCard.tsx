// MenuItemCard.tsx
import React from 'react';
import { MenuItem } from '../types';

// Define the types for the props passed to MenuItemCard
interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void; // onAddToCart prop function
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
  const price = parseFloat(item.price.toString());
  // If price is NaN, default to 0.00
  const formattedPrice = isNaN(price) ? 0.00 : price.toFixed(2);
  
  return (
    <div className="menu-item-card">
      <img src={item.image} alt={item.name} />
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <p>${formattedPrice}</p> {/* Display formatted price */}
      <button onClick={() => onAddToCart(item)}>Add to Cart</button>
    </div>
  );
};

export default MenuItemCard;
