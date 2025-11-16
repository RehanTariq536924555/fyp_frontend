import React, { createContext, useContext, useState, useEffect } from 'react';
import { Animal } from '@/data/animals';

export type AnimalType = 'all' | 'cow' | 'goat' | 'sheep' | 'camel';

interface SearchContextType {
  animals: Animal[];
  filteredAnimals: Animal[];
  filters: {
    query: string;
    type: AnimalType;
    location: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    forEid: boolean;
  };
  isLoading: boolean;
  updateFilters: (newFilters: Partial<SearchContextType['filters']>) => void;
  resetFilters: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<SearchContextType['filters']>({
    query: '',
    type: 'all',
    location: null,
    minPrice: null,
    maxPrice: null,
    forEid: false,
  });

  // Fetch animals from the API
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3001/listings');
        if (!response.ok) {
          throw new Error('Failed to fetch animals');
        }
        const data: Animal[] = await response.json();
        setAnimals(data);
        setFilteredAnimals(data);
      } catch (error) {
        console.error('Error fetching animals:', error);
        setAnimals([]);
        setFilteredAnimals([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  // Apply filters whenever filters or animals change
  useEffect(() => {
    let result = [...animals];

    // Filter by search query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      result = result.filter(
        (animal) =>
          animal.name.toLowerCase().includes(query) ||
          animal.breed.toLowerCase().includes(query) ||
          animal.description.toLowerCase().includes(query)
      );
    }

    // Filter by animal type
    if (filters.type !== 'all') {
      result = result.filter((animal) => animal.type === filters.type);
    }

    // Filter by location
    if (filters.location) {
      result = result.filter((animal) =>
        animal.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Filter by price range
    if (filters.minPrice !== null) {
      result = result.filter((animal) => animal.price >= filters.minPrice);
    }
    if (filters.maxPrice !== null) {
      result = result.filter((animal) => animal.price <= filters.maxPrice);
    }

    // Filter by Qurbani suitability
    if (filters.forEid) {
      result = result.filter((animal) => animal.forEid);
    }

    setFilteredAnimals(result);
  }, [filters, animals]);

  const updateFilters = (newFilters: Partial<SearchContextType['filters']>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      query: '',
      type: 'all',
      location: null,
      minPrice: null,
      maxPrice: null,
      forEid: false,
    });
  };

  return (
    <SearchContext.Provider
      value={{
        animals,
        filteredAnimals,
        filters,
        isLoading,
        updateFilters,
        resetFilters,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};