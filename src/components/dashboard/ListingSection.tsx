import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import AnimalCard from '@/components/ui/AnimalCard';
import { Animal } from '@/types';
import { Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const ListingSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<
    'latest' | 'oldest' | 'price-high' | 'price-low'
  >('latest');
  const [filterType, setFilterType] = useState<string>('all');
  const [listings, setListings] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch listings from the server
  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3001/listings');
      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }
      const data = await response.json();
      console.log('Fetched listings:', data);
      // Ensure the data matches the Animal type
      const formattedData: Animal[] = data.map((item: any) => ({
        id: item.id,
        title: item.title || '',
        name: item.title || '',
        type: item.type || '',
        breed: item.breed || '',
        age: item.age || undefined,
        weight: item.weight || undefined,
        price: item.price || undefined,
        location: item.location || '',
        description: item.description || '',
        images: item.images || [], // Ensure images is an array
        status: item.status || 'active',
        listed: item.listed || new Date().toISOString(),
        rating: item.rating || 4.5,
        forEid: item.forEid || false,
      }));
      setListings(formattedData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch listings');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch listings when the component mounts
  useEffect(() => {
    fetchListings();
  }, []);

  function getFilteredAnimals(animals: Animal[]) {
    return animals
      .filter((animal) => {
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            animal.title.toLowerCase().includes(query) ||
            animal.breed.toLowerCase().includes(query) ||
            animal.description.toLowerCase().includes(query)
          );
        }
        return true;
      })
      .filter((animal) => (filterType !== 'all' ? animal.type === filterType : true))
      .sort((a, b) => {
        const dateA = a.listed ? new Date(a.listed).getTime() : 0;
        const dateB = b.listed ? new Date(b.listed).getTime() : 0;
        switch (sortBy) {
          case 'latest':
            return dateB - dateA;
          case 'oldest':
            return dateA - dateB;
          case 'price-high':
            return (b.price || 0) - (a.price || 0);
          case 'price-low':
            return (a.price || 0) - (b.price || 0);
          default:
            return 0;
        }
      });
  }

  const activeListings = listings.filter((animal) => animal.status === 'active');
  const soldListings = listings.filter((animal) => animal.status === 'sold');

  const filteredActive = getFilteredAnimals(activeListings);
  const filteredSold = getFilteredAnimals(soldListings);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 mt-6 ml-4 sm:ml-6 md:ml-8"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Listings</h1>
          <p className="text-muted-foreground">Manage your active and sold animal listings</p>
        </div>
        <Link to="/dashboard/listings">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Listing
          </Button>
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <p>Loading listings...</p>
        </div>
      )}
      {error && (
        <div className="flex justify-center py-12 text-red-600">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Input
                placeholder="Search listings..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Dog">Dogs</SelectItem>
                <SelectItem value="Cow">Cows</SelectItem>
                <SelectItem value="Goat">Goats</SelectItem>
                <SelectItem value="Sheep">Sheep</SelectItem>
                <SelectItem value="Camel">Camels</SelectItem>
                <SelectItem value="Horse">Horses</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value) =>
                setSortBy(value as 'latest' | 'oldest' | 'price-high' | 'price-low')
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="active">Active ({filteredActive.length})</TabsTrigger>
              <TabsTrigger value="sold">Sold ({filteredSold.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-4">
              {filteredActive.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <h3 className="text-lg font-medium">No active listings found</h3>
                  <p className="text-muted-foreground">Try changing your search or filter</p>
                  <Link to="/dashboard/listings">
                    <Button className="mt-4">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add New Listing
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredActive.map((animal) => (
                    <AnimalCard key={animal.id} animal={animal} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="sold" className="mt-4">
              {filteredSold.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <h3 className="text-lg font-medium">No sold listings found</h3>
                  <p className="text-muted-foreground">Your sold listings will appear here</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredSold.map((animal) => (
                    <AnimalCard key={animal.id} animal={animal} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </motion.div>
  );
};

export default ListingSection;