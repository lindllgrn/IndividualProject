/* eslint-disable @typescript-eslint/no-unused-vars */
// MenuPage.tsx
import React, { useEffect, useState } from 'react';
import MenuItemCard from '../components/MenuItemCard';
import { useCart } from '../context/CartContext'; // Import useCart hook
import { MenuItem } from '../types';


const MenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart(); // Get addToCart function from CartContext

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/menu');
        if (!response.ok) {
          throw new Error('Failed to fetch menu items');
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        setError('Error fetching menu');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) return <p>Loading menu...</p>;
  if (error) return <p>{error}</p>;

  // Define the onAddToCart function
  const handleAddToCart = (item: MenuItem) => {
    const cartItem = {
      ...item,         // Spread the properties of MenuItem
      item,            // Add the reference to the MenuItem (or keep the item)
      quantity: 1      // Set the default quantity for the item
    };

    addToCart(cartItem);  // Call the addToCart function from CartContext
  };

  return (
    <div className="menu-page-container">
      <h1 className="menu-page-title">Our Menu</h1>
      <div className="menu-grid">
        {menuItems.map((item) => (
          <MenuItemCard 
            key={item.id} 
            item={item} 
            onAddToCart={handleAddToCart} // Pass onAddToCart to MenuItemCard
          />
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
