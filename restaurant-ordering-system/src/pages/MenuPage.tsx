import React, { useContext } from 'react';
import { useCart } from '../context/CartContext'; // Ensure you use the custom hook

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

const MenuPage: React.FC = () => {
  const { addToCart } = useCart(); // Using custom hook to access addToCart function

  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: 'Classic Lasagna',
      description: 'Layers of love with our rich tomato sauce, cheese, and a secret touch.',
      price: 14.99,
      image: '/images/lasagna.jpg',
    },
    {
      id: 2,
      name: 'Grilled Chicken Alfredo',
      description: 'Tender chicken paired with creamy Alfredo sauce on perfectly cooked pasta.',
      price: 16.99,
      image: '/images/alfredo.jpg',
    },
    {
      id: 3,
      name: 'Caesar Salad',
      description: 'Crisp romaine lettuce, crunchy croutons, and a rich Caesar dressing.',
      price: 9.99,
      image: '/images/salad.jpg',
    },
  ];

  return (
    <div className="menu-page">
      <h2 className="menu-title">Our Menu</h2>
      <div className="menu-items">
        {menuItems.map((item) => (
          <div key={item.id} className="menu-item">
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p className="price">${item.price.toFixed(2)}</p>
            <button onClick={() => addToCart(item)} className="add-to-cart-btn">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
