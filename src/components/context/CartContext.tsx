import React, { createContext, useContext, useState, useEffect } from 'react';
import { Animal } from '@/data/animals';

interface WishlistContextType {
  wishlist: Animal[];
  wishlistCount: number;
  addToWishlist: (animal: Animal) => void;
  removeFromWishlist: (animalId: string | number) => void;
  isInWishlist: (animalId: string | number) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  wishlistCount: 0,
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
  clearWishlist: () => {},
});

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Animal[]>([]);

  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (animal: Animal) => {
    setWishlist((prev) => {
      if (!prev.some(item => item.id === animal.id)) {
        return [...prev, animal];
      }
      return prev;
    });
  };

  const removeFromWishlist = (animalId: string | number) => {
    setWishlist((prev) => prev.filter(item => item.id !== animalId));
  };

  const isInWishlist = (animalId: string | number) => {
    return wishlist.some(item => item.id === animalId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};