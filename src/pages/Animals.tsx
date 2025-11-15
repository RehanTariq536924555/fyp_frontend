import React from 'react';
import { Loader2 } from 'lucide-react';
import AnimalCard from '@/components/AnimalCard';
import SearchFilters from '@/components/SearchFilters';
import { useSearch } from '@/contexts/SearchContext';

const Animals: React.FC = () => {
  const { filteredAnimals, isLoading, error } = useSearch();

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchFilters />
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
        </div>
      ) : error ? (
        <div className="text-center text-muted-foreground">
          <p className="text-xl">{error}</p>
          <p>Try refreshing or contact support.</p>
        </div>
      ) : filteredAnimals.length === 0 ? (
        <div className="text-center text-muted-foreground">
          <p className="text-xl">No animals found.</p>
          <p>Try adjusting your filters or adding a new listing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnimals.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function AnimalsPage() {
  return <Animals />;
}