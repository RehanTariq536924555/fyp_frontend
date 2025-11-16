import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useSearch, AnimalType } from '@/contexts/SearchContext';
import { toast } from 'sonner';

interface SearchFiltersProps {
  className?: string;
  compact?: boolean;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ className, compact = false }) => {
  const { filters, updateFilters, resetFilters, allAnimals } = useSearch();
  const [showFilters, setShowFilters] = useState(false);
  const [location, setLocation] = useState(filters.location || '');

  // Compute price range from allAnimals
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

  useEffect(() => {
    if (allAnimals.length > 0) {
      const prices = allAnimals.map((animal) => animal.price);
      const minAvailable = Math.min(...prices) || 0;
      const maxAvailable = Math.max(...prices) || 100000;
      setPriceRange([
        filters.minPrice ?? minAvailable,
        filters.maxPrice ?? maxAvailable,
      ]);
    }
  }, [allAnimals, filters.minPrice, filters.maxPrice]);

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const applyPriceFilter = () => {
    updateFilters({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleReset = () => {
    resetFilters();
    setLocation('');
    if (allAnimals.length > 0) {
      const prices = allAnimals.map((animal) => animal.price);
      setPriceRange([Math.min(...prices) || 0, Math.max(...prices) || 100000]);
    } else {
      setPriceRange([0, 100000]);
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const applyLocationFilter = () => {
    if (location.trim()) {
      updateFilters({ location: location.trim() });
      toast.success(`Location set to ${location.trim()}`);
    } else {
      updateFilters({ location: null });
    }
  };

  const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      applyLocationFilter();
    }
  };

  const clearLocation = () => {
    setLocation('');
    updateFilters({ location: null });
  };

  return (
    <div className={className}>
      {/* Search bar with filter toggle */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search animals..."
            className="pl-10 pr-4 py-2 border-black/10 focus-visible:ring-black"
            value={filters.query}
            onChange={(e) => updateFilters({ query: e.target.value })}
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={toggleFilters}
          className="border-black/10 bg-gradient-to-r from-teal-600 to-coral-600 text-white"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Expanded filters */}
      {(showFilters || !compact) && (
        <div className="bg-white rounded-lg subtle-border p-4 mb-6 space-y-5 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Animal Type Filter */}
            <div className="flex-1 space-y-2">
              <Label htmlFor="animal-type">Animal Type</Label>
              <Select
                value={filters.type}
                onValueChange={(value) => updateFilters({ type: value as AnimalType })}
              >
                <SelectTrigger id="animal-type" className="border-black/10">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="cow">Cow</SelectItem>
                  <SelectItem value="goat">Goat</SelectItem>
                  <SelectItem value="sheep">Sheep</SelectItem>
                  <SelectItem value="camel">Camel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter */}
            <div className="flex-1 space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="location"
                  placeholder="Enter your location..."
                  className="pl-10 pr-10 border-black/10"
                  value={location}
                  onChange={handleLocationChange}
                  onBlur={applyLocationFilter}
                  onKeyDown={handleLocationKeyDown}
                />
                {location && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    onClick={clearLocation}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Price Range</Label>
              <div className="text-sm text-muted-foreground">
                {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </div>
            </div>
            <Slider
              min={allAnimals.length > 0 ? Math.min(...allAnimals.map((a) => a.price)) : 0}
              max={allAnimals.length > 0 ? Math.max(...allAnimals.map((a) => a.price)) : 100000}
              step={5000}
              value={[priceRange[0], priceRange[1]]}
              onValueChange={handlePriceChange}
              onValueCommit={applyPriceFilter}
              className="my-6"
            />
          </div>

          <Separator />

          {/* Toggle for Qurbani animals */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="qurbani-filter">Qurbani Animals</Label>
              <p className="text-sm text-muted-foreground">Show only animals suitable for Qurbani</p>
            </div>
            <Switch
              id="qurbani-filter"
              checked={filters.forEid}
              onCheckedChange={(checked) => updateFilters({ forEid: checked })}
            />
          </div>

          <div className="flex justify-between pt-2">
            <Button
              variant="outline"
              onClick={handleReset}
              className="bg-gradient-to-r from-teal-600 to-coral-600 text-white"
            >
              Reset Filters
            </Button>
            <Button
              onClick={() => setShowFilters(false)}
              className="hidden md:flex bg-gradient-to-r from-teal-600 to-coral-600 text-white"
            >
              Apply Filters <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;