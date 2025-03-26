import React from 'react';
import { MenuItem } from '../types';
import MenuItemCard from '../components/MenuItemCard';

const MenuPage: React.FC<{ menuItems: MenuItem[] }> = ({ menuItems }) => {
  return (
    <div className="menu-page-container">
      <h1 className="menu-page-title">Our Menu</h1>
      <div className="menu-grid">
        {menuItems.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
