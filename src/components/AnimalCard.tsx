import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, MapPin, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Animal } from '../data/animals';

interface AnimalCardProps {
  animal: Animal;
  featured?: boolean;
  className?: string;
}

export const getImageUrl = (animal: Animal): string => {
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/listings', '') || 'http://localhost:3001';
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

const AnimalCard: React.FC<AnimalCardProps> = ({ animal, featured = false, className }) => {
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(animal);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(animal.id)) {
      removeFromWishlist(animal.id);
    } else {
      addToWishlist(animal);
    }
  };

  const formatPrice = (price: number = 0) => {
    return `Rs ${price.toLocaleString('en-PK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const imageUrl = imageError ? 'https://via.placeholder.com/300' : getImageUrl(animal);

  return (
    <Link to={`/animal/${animal.id}`}>
      <Card
        className={cn(
          'overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group',
          featured ? 'md:row-span-2' : '',
          className
        )}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={animal.title || animal.name || 'Animal'}
            className={cn(
              'w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
            )}
            onError={() => setImageError(true)}
          />
          {animal.forEid && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold shadow-sm hover:bg-green-600">
              Qurbani
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 p-1 rounded-full bg-white/90 hover:bg-white shadow-md transition-colors"
            onClick={handleWishlistToggle}
          >
            <Heart
              className={cn(
                'h-5 w-5 transition-colors',
                isInWishlist(animal.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
              )}
            />
          </Button>
        </div>
        <div className="p-4 bg-gradient-to-b from-white to-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xl text-gray-800 truncate">
              {animal.title || animal.name || 'Unnamed Animal'}
            </h3>
            <span className="text-gray-500 text-sm">
              {animal.age ? `${animal.age} ${animal.age === 1 ? 'year' : 'years'}` : 'N/A'}
            </span>
          </div>
          <div className="mt-2 flex items-center text-gray-500 text-sm space-x-1">
            <MapPin className="h-4 w-4 text-teal-600" />
            <span>{animal.location || 'Unknown Location'}</span>
          </div>
          {animal.sellerName && (
            <div className="mt-2 flex items-center text-gray-500 text-sm">
              <span>Seller: {animal.sellerName}</span>
            </div>
          )}
          {animal.rating && animal.reviews !== undefined && (
            <div className="mt-2 flex items-center text-gray-500 text-sm">
              <span>Rating: {animal.rating} ({animal.reviews} reviews)</span>
            </div>
          )}
          <div className="mt-3 flex items-center justify-between">
            <p className="font-bold text-lg text-black">{formatPrice(animal.price)}</p>
            <Button
              variant={isInCart(animal.id) ? 'secondary' : 'default'}
              size="sm"
              className={cn(
                'rounded-full px-4 py-1 text-sm font-medium transition-all',
                isInCart(animal.id)
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-gradient-to-r from-teal-600 to-coral-600 text-white hover:from-teal-700 hover:to-coral-700'
              )}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {isInCart(animal.id) ? 'Added' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default AnimalCard;