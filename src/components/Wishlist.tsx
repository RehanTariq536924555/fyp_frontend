import React from 'react';
import { useWishlist } from '../context/WishlistContext'; // Adjust path based on your structure
import { Button } from '@/components/ui/button';
import { Trash, MapPin } from 'lucide-react';
import { Animal } from '@/data/animals';
import { Link } from 'react-router-dom';

// Utility function to get the correct image URL
export const getImageUrl = (animal: Animal): string => {
  const baseUrl = 'http://localhost:3001';
  const fallbackImage = 'https://via.placeholder.com/300';

  if (animal.images && Array.isArray(animal.images) && animal.images.length > 0) {
    const imagePath = animal.images[0];
    return imagePath
      ? imagePath.startsWith('http')
        ? imagePath
        : `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
      : fallbackImage;
  }

  if (animal.image) {
    return animal.image.startsWith('http')
      ? animal.image
      : `${baseUrl}${animal.image.startsWith('/') ? '' : '/'}${animal.image}`;
  }

  return fallbackImage;
};

const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist, wishlistCount } = useWishlist();

  if (wishlistCount === 0) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Your Wishlist</h1>
        <p className="text-lg text-gray-600 mb-6">Your wishlist is empty. Add some animals to see them here!</p>
        <Link to="/animals">
          <Button className="mt-4 bg-teal-600 text-white hover:bg-teal-700 px-6 py-2 rounded-full transition-colors duration-200">
            Browse Animals
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Your Wishlist ({wishlistCount})</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((animal: Animal) => (
          <div
            key={animal.id}
            className="relative bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <Link to={`/animal/${animal.id}`}>
              <div className="relative">
                <img
                  src={getImageUrl(animal)}
                  alt={animal.name}
                  className="w-full h-60 object-cover transition-transform duration-300 hover:scale-110"
                />
                {/* Age Badge in Top-Right */}
                <div className="absolute top-2 right-2 bg-teal-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  Age: {animal.age || 'N/A'}
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 truncate mb-2">{animal.title}</h2>
                <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {animal.location || 'Unknown'}
                </p>
                <p className="text-lg font-bold text-black">
                  Rs {animal.price.toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            </Link>
            <div className="p-6 pt-0">
              <Button
                className="w-full bg-teal-500 text-white hover:bg-teal-600 flex items-center justify-center gap-2 rounded-lg py-2.5 transition-colors duration-200"
                onClick={() => removeFromWishlist(animal.id)}
                aria-label={`Remove ${animal.name} from wishlist`}
              >
                <Trash className="h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;