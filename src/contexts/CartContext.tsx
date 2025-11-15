
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { Animal } from '@/data/animals';

interface CartItem extends Animal {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (animal: Animal) => void;
  removeFromCart: (animalId: number) => void;
  updateQuantity: (animalId: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (animalId: number) => boolean;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Calculate totals
    setCartCount(cartItems.reduce((total, item) => total + item.quantity, 0));
    setCartTotal(cartItems.reduce((total, item) => total + (item.price * item.quantity), 0));
  }, [cartItems]);

  const addToCart = (animal: Animal) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === animal.id);
      
      if (existingItem) {
        toast("Animal already in cart", {
          description: "You can adjust the quantity in your cart.",
        });
        return prevItems.map(item => 
          item.id === animal.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        toast("Added to cart", {
          description: `${animal.name} has been added to your cart.`,
        });
        return [...prevItems, { ...animal, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (animalId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== animalId));
    toast("Removed from cart", {
      description: "Item has been removed from your cart.",
    });
  };

  const updateQuantity = (animalId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(animalId);
      return;
    }

    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === animalId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast("Cart cleared", {
      description: "All items have been removed from your cart.",
    });
  };

  const isInCart = (animalId: number) => {
    return cartItems.some(item => item.id === animalId);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
