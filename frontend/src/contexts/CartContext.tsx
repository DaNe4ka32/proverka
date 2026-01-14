import React, { useState } from "react";
import type { ReactNode } from "react";
import type { CartItem } from "../hooks/useCart";
import { CartContext } from "./CartContextValue";

const CART_STORAGE_KEY = "cart";

const getInitialCart = (): CartItem[] => {
  const storedCart = localStorage.getItem(CART_STORAGE_KEY);
  return storedCart ? JSON.parse(storedCart) : [];
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(getInitialCart);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
  };

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    const existingItem = cart.find(
      (cartItem) => cartItem.id === item.id && cartItem.size === item.size
    );
    if (existingItem) {
      const updatedCart = cart.map((cartItem) =>
        cartItem.id === item.id && cartItem.size === item.size
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      saveCart(updatedCart);
    } else {
      saveCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }
    const updatedCart = cart.map((item) =>
      item.id === id && item.size === size ? { ...item, quantity } : item
    );
    saveCart(updatedCart);
  };

  const removeFromCart = (id: number, size: string) => {
    const updatedCart = cart.filter(
      (item) => !(item.id === id && item.size === size)
    );
    saveCart(updatedCart);
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    getTotal,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
