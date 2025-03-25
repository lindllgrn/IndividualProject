/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";
import { MenuItem } from "../components/MenuItemCard.tsx";

// Define the CartItem interface
export default interface CartItem {
  id: number,
  name: string,
  price: number,
  image: string,
  item: MenuItem;
  quantity: number;
}

// Define the CartContextType interface
export interface CartContextType {
  cart: CartItem[]; // The current items in the cart
  archivedOrders: CartItem[][]; // Archived orders (completed orders)
  addToCart: (item: CartItem) => void; // Adds an item to the cart
  removeFromCart: (id: number) => void; // Removes an item from the cart
  clearCart: () => void; // Clears the cart
  archiveOrder: (order: CartItem[]) => void; // Archives a completed order
}

// Create CartContext with a default value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Use React.PropsWithChildren to include the children prop typing
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const CartProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]); // State for the cart items
  const [archivedOrders, setArchivedOrders] = useState<CartItem[][]>([]); // State for archived orders

  // Add an item to the cart
  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };
  // Remove an item from the cart based on its id
  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Clear the cart (used when an order is completed)
  const clearCart = () => {
    setCart([]);
  };
  // Archive the completed order (move items to archivedOrders)
  const archiveOrder = (order: CartItem[]) => {
    setArchivedOrders([...archivedOrders, order]);
  };

  return (
    <CartContext.Provider
      value={{ cart, archivedOrders, addToCart, removeFromCart, clearCart, archiveOrder }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use CartContext
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
