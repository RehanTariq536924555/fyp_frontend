import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  ShoppingCart,
  Phone,
  MessageCircle,
  Star,
  PawPrint,
  Dna,
  Scale,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Animal } from '@/data/animals';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import RecommendationSystem from '../components/RecommendedAnimals';
import Reviews from '../pages/Review';

type SellerProfile = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  bio: string;
  image: string;
};

type Seller = {
  id: number;
  name: string;
  email: string;
  profile: SellerProfile;
};

interface Review {
  id: number;
  rating: number;
  comment: string;
  // Add other fields as per your API response
}

interface AnimalDetailProps {
  currentUserEmail?: string; // logged-in user email
}

interface ReviewsProps {
  animal: Animal;
  reviews: Review[];
}

// Helper function to get user ID from token
const getUserIdFromToken = (): number | null => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    // Decode JWT token to get user ID
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || payload.id || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Helper component to render star ratings
const StarRating = ({ rating, reviews, maxRating = 5 }: { rating: number | null; reviews: Review[]; maxRating?: number }) => {
  if (rating === null) {
    return <span className="text-gray-500 text-sm">No ratings yet</span>;
  }

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center space-x-1">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="h-5 w-5 text-yellow-400" fill="currentColor" />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star className="h-5 w-5 text-gray-300" fill="currentColor" />
          <Star className="h-5 w-5 text-yellow-400 absolute top-0 left-0" fill="currentColor" style={{ clipPath: 'inset(0 50% 0 0)' }} />
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" fill="currentColor" />
      ))}
      <span className="text-gray-700 font-medium text-sm ml-2">
        {rating.toFixed(1)} / {maxRating} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
      </span>
    </div>
  );
};

const AnimalDetail: React.FC<AnimalDetailProps> = ({ currentUserEmail }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, isInCart } = useCart();
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  useEffect(() => {
    const fetchAnimalAndReviews = async () => {
      if (!id) {
        setError('Invalid animal ID');
        setLoading(false);
        navigate('/animals');
        return;
      }

      try {
        // Fetch animal details
        const animalResponse = await fetch(`http://localhost:3001/listings/${id}`);
        if (!animalResponse.ok) throw new Error('Animal not found');
        const animalData: Animal & { seller?: Seller } = await animalResponse.json();
        setAnimal(animalData);
        setSeller(animalData.seller || null);

        // Fetch reviews for the animal
        const reviewsResponse = await fetch(`http://localhost:3001/reviews/${id}`);
        if (!reviewsResponse.ok) throw new Error('Failed to fetch reviews');
        const reviewsData: Review[] = await reviewsResponse.json();
        setReviews(reviewsData);

        // Calculate average rating
        if (reviewsData.length > 0) {
          const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
          const avgRating = totalRating / reviewsData.length;
          setAverageRating(Number(avgRating.toFixed(1))); // Round to 1 decimal place
        } else {
          setAverageRating(null); // No reviews available
        }
      } catch (err) {
        setError('Animal or reviews not found');
        navigate('/animals');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimalAndReviews();
  }, [id, navigate]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200">
        <p className="text-2xl text-gray-700 font-semibold">Loading animal details...</p>
      </div>
    );

  if (error || !animal)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200">
        <p className="text-2xl text-red-500 font-semibold">{error || 'Animal not found'}</p>
      </div>
    );

  const fallbackImage = '/placeholder-image.jpg';

  const getImageUrl = () => {
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/listings', '') || 'http://localhost:3001';
    
    if (animal.images && animal.images.length > 0) {
      const img = animal.images[0];
      if (img.startsWith('http')) {
        return img;
      }
      const cleanPath = img.startsWith('/') ? img : `/${img}`;
      return `${baseUrl}${cleanPath}`;
    }
    return 'https://via.placeholder.com/300x200?text=No+Image';
  };

  const sellerProfileImage = seller?.profile?.image || fallbackImage;

  const formatPhone = (phone: string) => {
    if (!phone) return '';
    let digits = phone.replace(/\D/g, '');
    if (digits.startsWith('0')) digits = '92' + digits.slice(1);
    if (!digits.startsWith('92')) digits = '92' + digits;
    return digits;
  };

  const phoneForLink = seller?.profile?.phone ? formatPhone(seller.profile.phone) : '';

  // Check if current user is admin
  const isAdmin = currentUserEmail === 'admin@example.com';
  
  // Check if this listing was created by admin (no seller relation)
  const isAdminListing = !seller;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 flex flex-col">
      <main className="flex-1 pt-12 pb-20">
        <div className="container mx-auto px-6 max-w-8xl">
          <Button
            variant="ghost"
            size="sm"
            className="mb-8 flex items-center text-teal-600 hover:text-teal-800 transition-colors font-semibold"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Back
          </Button>

          <div className="flex space-x-4 mb-6">
            <Button
              variant={activeTab === 'details' ? 'default' : 'outline'}
              className={cn(
                'font-semibold',
                activeTab === 'details'
                  ? 'bg-gradient-to-r from-teal-600 to-coral-600 text-white'
                  : 'text-teal-600 hover:bg-teal-50'
              )}
              onClick={() => setActiveTab('details')}
            >
              Details
            </Button>
            <Button
              variant={activeTab === 'reviews' ? 'default' : 'outline'}
              className={cn(
                'font-semibold',
                activeTab === 'reviews'
                  ? 'bg-gradient-to-r from-teal-600 to-coral-600 text-white'
                  : 'text-teal-600 hover:bg-teal-50'
              )}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </Button>
          </div>

          {activeTab === 'details' ? (
            <div className="grid grid-cols-1 lg:grid-cols-[5fr_3fr] gap-12">
              {/* Left Column */}
              <div className="space-y-10 animate-fade-in-up">
                {/* Animal Image */}
                <div className="relative bg-gray-200 rounded-2xl overflow-hidden border border-gray-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 aspect-[3/2]">
                  <img
                    src={getImageUrl()}
                    alt={animal.title || animal.type || 'Animal'}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image')}
                    loading="lazy"
                  />
                </div>

                {/* Animal Description */}
                <div className="bg-gradient-to-b from-white to-gray-50 p-10 rounded-2xl shadow-xl border border-gray-100">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">Description</h3>
                  <p className="text-gray-700 leading-relaxed text-base">
                    {animal.description || 'No description available'}
                  </p>
                </div>

                {/* Seller/Admin Info */}
                {seller?.profile ? (
                  <div className="bg-gradient-to-b from-white to-gray-50 p-8 rounded-2xl shadow-xl border border-gray-100 max-w-xl space-y-4">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Seller Information</h3>
                    <div className="flex items-center space-x-4">
                      <img
                        src={sellerProfileImage}
                        alt={seller.profile.name}
                        className="w-20 h-20 rounded-full object-cover border border-gray-300"
                        onError={(e) => { e.currentTarget.src = fallbackImage; }}
                      />
                      <div>
                        <h4 className="text-xl font-semibold">{seller.profile.name}</h4>
                        <p className="text-teal-700 font-semibold mt-1">Phone: {seller.profile.phone}</p>
                        <p className="text-gray-600 mt-1 max-w-xs">{seller.profile.bio}</p>
                        <div className="flex space-x-3 mt-4">
                          <a href={`tel:${phoneForLink}`}>
                            <Button size="sm" className="bg-gradient-to-r from-teal-600 to-coral-600 text-white rounded-xl font-semibold hover:shadow-md hover:scale-105 transition-all">
                              <Phone className="h-4 w-4 mr-2" /> Call
                            </Button>
                          </a>
                          <a href={`https://wa.me/${phoneForLink}`} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" className="bg-gradient-to-r from-teal-600 to-coral-600 text-white rounded-xl font-semibold hover:shadow-md hover:scale-105 transition-all">
                              <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : isAdminListing ? (
                  <div className="bg-gradient-to-b from-white to-gray-50 p-8 rounded-2xl shadow-xl border border-gray-100 max-w-xl space-y-4">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Admin Information</h3>
                    <div className="flex items-center space-x-4">
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                        alt="System Administrator"
                        className="w-20 h-20 rounded-full object-cover border border-gray-300"
                        onError={(e) => { e.currentTarget.src = fallbackImage; }}
                      />
                      <div>
                        <h4 className="text-xl font-semibold">System Administrator</h4>
                        <p className="text-teal-700 font-semibold mt-1">Phone: +92-300-1234567</p>
                        <p className="text-gray-600 mt-1 max-w-xs">Official BakraMandi360 administrator. Verified and trusted listings with quality assurance.</p>
                        <div className="flex space-x-3 mt-4">
                          <a href="tel:+923001234567">
                            <Button size="sm" className="bg-gradient-to-r from-teal-600 to-coral-600 text-white rounded-xl font-semibold hover:shadow-md hover:scale-105 transition-all">
                              <Phone className="h-4 w-4 mr-2" /> Call
                            </Button>
                          </a>
                          <a href="https://wa.me/923001234567?text=Hello%2C%20I%27m%20interested%20in%20your%20animal%20listing%20on%20BakraMandi360" target="_blank" rel="noopener noreferrer">
                            <Button size="sm" className="bg-gradient-to-r from-teal-600 to-coral-600 text-white rounded-xl font-semibold hover:shadow-md hover:scale-105 transition-all">
                              <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Right Column: Details & Cart */}
              <div className="space-y-10 animate-fade-in-up animation-delay-200">
                <div className="bg-gradient-to-b from-white to-gray-50 p-8 rounded-2xl shadow-xl border border-gray-100 max-w-xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <h1 className="text-3xl lg:text-3xl font-extrabold text-gray-800">
                      {animal.title || animal.type || 'Unnamed Animal'}
                    </h1>
                    <div className="bg-gray-100 rounded-lg p-2 shadow-sm">
                      <StarRating rating={averageRating} reviews={reviews} />
                    </div>
                  </div>

                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-teal-600" />
                    <span>{animal.location || 'Unknown Location'}</span>
                  </div>

                  <p className="text-3xl font-extrabold text-gray-800">{formatPrice(animal.price || 0)}</p>

                  <Button
                    size="lg"
                    className={cn(
                      'w-full text-white rounded-xl transition-all font-semibold hover:scale-105',
                      isInCart(animal.id)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-teal-600 to-coral-600 hover:from-teal-700 hover:to-coral-700 hover:shadow-xl'
                    )}
                    onClick={() => addToCart(animal)}
                    disabled={isInCart(animal.id)}
                    aria-label={isInCart(animal.id) ? 'Item already in cart' : 'Add item to cart'}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {isInCart(animal.id) ? 'Added to Cart' : 'Add to Cart'}
                  </Button>

                  {/* Specifications */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Specifications</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <SpecItem icon={PawPrint} label="Type" value={animal.type} />
                      <SpecItem icon={Dna} label="Breed" value={animal.breed} />
                      <SpecItem icon={Scale} label="Weight" value={animal.weight ? `${animal.weight} kg` : 'N/A'} />
                      <SpecItem icon={Calendar} label="Age" value={animal.age ? `${animal.age} ${animal.age === 1 ? 'year' : 'years'}` : 'N/A'} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Reviews animal={animal} reviews={reviews} />
          )}

          {activeTab === 'details' && (
            <div className="mt-20">
              {/* AI-Powered Recommendation System */}
              <RecommendationSystem 
                currentAnimalId={animal.id}
                userId={getUserIdFromToken()}
                title="Recommended Animals"
                showReasons={true}
                limit={4}
                className="animate-fade-in-up"
              />
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gradient-to-r from-teal-900 to-coral-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-white/80 text-base">© {new Date().getFullYear()} QurbaniMandi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const SpecItem = ({ icon: Icon, label, value }: { icon: any; label: string; value?: string }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 shadow-sm hover:bg-gray-100 hover:shadow-md transition-all min-h-[70px] flex items-center space-x-3">
    <Icon className="h-5 w-5 text-teal-600 flex-shrink-0" />
    <div>
      <span className="font-semibold text-gray-800">{label}: </span>
      <span>{value || 'N/A'}</span>
    </div>
  </div>
);

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(price);

export default AnimalDetail;