import React from 'react';
import CartItem, { useCart } from '../context/CartContext';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface MenuItemCardProps {
  item: MenuItem;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // Pass the entire item object and its image directly
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1, // Default to 1 for initial quantity
      item, // Pass the entire item as part of the CartItem
      image: item.image, // Ensure image is included
    };

    addToCart(cartItem); // Call addToCart with the correct CartItem structure
  };

  return (
    <div className="menu-item-card">
      <img src={item.image} alt={item.name} />
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <p className="price">${item.price.toFixed(2)}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default MenuItemCard;
