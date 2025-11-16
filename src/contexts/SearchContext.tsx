import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Animal } from '../data/animals';

export type AnimalType = 'cow' | 'goat' | 'sheep' | 'camel' | 'Rabit'| 'cat' | 'Dog' | 'all';

interface SearchFilters {
  query: string;
  type: AnimalType;
  minPrice: number | null;
  maxPrice: number | null;
  location: string | null;
  forEid: boolean;
}

interface SearchContextType {
  filters: SearchFilters;
  updateFilters: (newFilters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  filteredAnimals: Animal[];
  allAnimals: Animal[];
  isLoading: boolean;
  error: string | null;
}

const initialFilters: SearchFilters = {
  query: '',
  type: 'all',
  minPrice: null,
  maxPrice: null,
  location: null,
  forEid: false,
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [allAnimals, setAllAnimals] = useState<Animal[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch animals from the server
  useEffect(() => {
    const fetchAnimals = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3001/listings');
        if (!response.ok) {
          throw new Error(`Failed to fetch animals: ${response.status} ${response.statusText}`);
        }
        const data: Animal[] = await response.json();
        console.log('Fetched animals:', data);
        // Validate data
        if (!Array.isArray(data)) {
          throw new Error('API returned invalid data: Expected an array');
        }
        // Check if any animals have forEid: true
        const hasQurbaniAnimals = data.some((animal) => animal.forEid === true);
        console.log('Qurbani animals available:', hasQurbaniAnimals);
        setAllAnimals(data);
        setFilteredAnimals(data);
      } catch (err: any) {
        console.error('Error fetching animals:', err);
        setError(`Failed to load animals: ${err.message}. Please check your server or try again later.`);
        setAllAnimals([]);
        setFilteredAnimals([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  // Apply filters whenever filters or allAnimals change
  useEffect(() => {
    let results = [...allAnimals];

    console.log('Applying filters:', filters);
    console.log('Initial animal count:', results.length);

    // Search query filter
    if (filters.query) {
      const queryLower = filters.query.toLowerCase();
      results = results.filter(
        (animal) =>
          animal.name?.toLowerCase().includes(queryLower) ||
          animal.description?.toLowerCase().includes(queryLower)
      );
      console.log('After query filter:', results.length);
    }

    // Animal type filter
    if (filters.type !== 'all') {
      const filterTypeLower = filters.type.toLowerCase();
      results = results.filter((animal) => {
        if (!animal.type) {
          console.warn('Animal missing type:', animal);
          return false;
        }
        return animal.type.toLowerCase() === filterTypeLower;
      });
      console.log('After type filter:', results.length, 'Type:', filters.type);
    }

    // Price range filter
    if (filters.minPrice !== null) {
      results = results.filter((animal) => animal.price >= filters.minPrice);
      console.log('After minPrice filter:', results.length);
    }
    if (filters.maxPrice !== null) {
      results = results.filter((animal) => animal.price <= filters.maxPrice);
      console.log('After maxPrice filter:', results.length);
    }

    // Location filter
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      results = results.filter((animal) =>
        animal.location?.toLowerCase().includes(locationLower)
      );
      console.log('After location filter:', results.length);
    }

    // Qurbani filter
    if (filters.forEid) {
      results = results.filter((animal) => animal.forEid === true);
      console.log('After forEid filter:', results.length);
    }

    console.log('Final filtered animals:', results);
    setFilteredAnimals(results);
  }, [filters, allAnimals]);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    console.log('Updating filters with:', newFilters);
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    console.log('Resetting filters');
    setFilters(initialFilters);
  };

  return (
    <SearchContext.Provider
      value={{
        filters,
        updateFilters,
        resetFilters,
        filteredAnimals,
        allAnimals,
        isLoading,
        error,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};