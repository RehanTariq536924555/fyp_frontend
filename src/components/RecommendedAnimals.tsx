import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, MapPin, Heart, Star, TrendingUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Animal } from '@/data/animals';

interface RecommendedAnimal extends Animal {
  recommendationScore?: number;
  recommendationReasons?: string[];
}

interface RecommendationSystemProps {
  currentAnimalId?: number;
  userId?: number;
  className?: string;
  title?: string;
  showReasons?: boolean;
  limit?: number;
}

const RecommendationSystem: React.FC<RecommendationSystemProps> = ({
  currentAnimalId,
  userId,
  className,
  title = "Recommended for You",
  showReasons = true,
  limit = 6
}) => {
  const [recommendations, setRecommendations] = useState<RecommendedAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetchRecommendations();
  }, [currentAnimalId, userId]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      let url = '';
      let headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Determine which endpoint to use based on authentication
      if (token && userId) {
        // Authenticated user - get personalized recommendations
        url = `http://localhost:3001/recommendations/user?currentAnimalId=${currentAnimalId || ''}&limit=${limit}`;
        headers.Authorization = `Bearer ${token}`;
      } else if (currentAnimalId) {
        // Non-authenticated user viewing animal detail - get popular recommendations
        url = `http://localhost:3001/recommendations/animal/${currentAnimalId}?limit=${limit}`;
      } else {
        // General popular recommendations
        url = `http://localhost:3001/recommendations/popular?limit=${limit}`;
      }

      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data || []);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Unable to load recommendations');
      // Fallback to empty array
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, animal: RecommendedAnimal) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(animal);
  };

  const handleWishlistToggle = (e: React.MouseEvent, animal: RecommendedAnimal) => {
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

  const getImageUrl = (animal: RecommendedAnimal): string => {
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/listings', '') || 'http://localhost:3001';
    const fallbackImage = 'https://via.placeholder.com/300x200?text=No+Image';

    // Handle images array (priority)
    if (animal.images && Array.isArray(animal.images) && animal.images.length > 0) {
      const imagePath = animal.images[0];
      if (imagePath) {
        if (imagePath.startsWith('http')) {
          return imagePath;
        }
        // Handle both /uploads/filename and uploads/filename formats
        const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        return `${baseUrl}${cleanPath}`;
      }
    }

    // Handle single image property
    if (animal.image) {
      if (animal.image.startsWith('http')) {
        return animal.image;
      }
      const cleanPath = animal.image.startsWith('/') ? animal.image : `/${animal.image}`;
      return `${baseUrl}${cleanPath}`;
    }

    return fallbackImage;
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-500';
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  // const getScoreLabel = (score?: number) => {
  //   if (!score) return 'Good Match';
  //   if (score >= 80) return 'Perfect Match';
  //   if (score >= 60) return 'Great Match';
  //   return 'Good Match';
  // };

  if (loading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-teal-600" />
          <h2 className="text-2xl font-bold text-teal-800 font-quicksand">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-xl h-64 mb-4"></div>
              <div className="bg-gray-200 rounded h-4 mb-2"></div>
              <div className="bg-gray-200 rounded h-4 w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || recommendations.length === 0) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-teal-600" />
          <h2 className="text-2xl font-bold text-teal-800 font-quicksand">{title}</h2>
        </div>
        <div className="text-center py-8 bg-teal-50 rounded-xl">
          <TrendingUp className="h-12 w-12 text-teal-400 mx-auto mb-4" />
          <p className="text-gray-600 font-roboto">
            {error || 'No recommendations available at the moment'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center gap-3">
        <Sparkles className="h-6 w-6 text-teal-600" />
        <h2 className="text-2xl font-bold text-teal-800 font-quicksand">{title}</h2>
        {userId && (
          <Badge className="bg-gradient-to-r from-teal-600 to-coral-600 text-white">
            Personalized
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((animal) => (
          <Link key={animal.id} to={`/animal/${animal.id}`}>
            <Card className="overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative">
              {/* Recommendation Score Badge */}
              {animal.recommendationScore && (
                <div className="absolute top-3 left-3 z-10">
                  <Badge className={cn(
                    'text-white font-semibold shadow-sm',
                    getScoreColor(animal.recommendationScore)
                  )}>
                    {/* {getScoreLabel(animal.recommendationScore)} */}
                  </Badge>
                </div>
              )}

              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={getImageUrl(animal)}
                  alt={animal.title || animal.name || 'Animal'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
                
                {animal.forEid && (
                  <Badge className="absolute top-3 right-12 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold shadow-sm">
                    Qurbani
                  </Badge>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-3 right-3 p-1 rounded-full bg-white/90 hover:bg-white shadow-md transition-colors"
                  onClick={(e) => handleWishlistToggle(e, animal)}
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
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-800 truncate">
                    {animal.title || animal.name || 'Unnamed Animal'}
                  </h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                    <span className="text-gray-600 text-sm">{animal.rating || 4.5}</span>
                  </div>
                </div>

                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <MapPin className="h-4 w-4 text-teal-600 mr-1" />
                  <span>{animal.location || 'Unknown Location'}</span>
                </div>

                {/* Recommendation Reasons */}
                {showReasons && animal.recommendationReasons && animal.recommendationReasons.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {animal.recommendationReasons.slice(0, 2).map((reason, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs text-teal-700 border-teal-200 bg-teal-50"
                        >
                          {reason}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
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
                    onClick={(e) => handleAddToCart(e, animal)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    {isInCart(animal.id) ? 'Added' : 'Add'}
                  </Button>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {recommendations.length > 0 && (
        <div className="text-center">
          <Button
            variant="outline"
            className="border-teal-200 text-teal-600 hover:bg-teal-50"
            onClick={fetchRecommendations}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Refresh Recommendations
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecommendationSystem;