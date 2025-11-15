import React, { useState, useEffect } from 'react';
import { Star, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Animal } from '@/data/animals';
import axios from 'axios';

interface Review {
  id: number;
  userId?: number; // Optional userId
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsProps {
  animal: Animal;
}

const Reviews = ({ animal }: ReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ userName: '', rating: 0, comment: '' });
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch reviews for the animal
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/reviews/${animal.id}`);
      setReviews(response.data);
      setLoading(false);
    };

    fetchReviews();
  }, [animal.id]);

  // Handle review submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.rating === 0 || !newReview.comment.trim() || !newReview.userName.trim()) return;

    const review = {
      animalId: animal.id,
      userName: newReview.userName,
      rating: newReview.rating,
      comment: newReview.comment,
    };

    const response = await axios.post('http://localhost:3001/reviews', review);
    setReviews([...reviews, response.data]);
    setNewReview({ userName: '', rating: 0, comment: '' });
    setHoverRating(0);
  };

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : animal.rating?.toFixed(1) || '0.0';

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white text-center">
        <p className="text-xl text-gray-700">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Reviews for {animal.title || animal.type || 'Unnamed Animal'}
        </h1>
        <div className="flex items-center">
          <Star className="h-5 w-5 text-yellow-400 mr-1" fill="currentColor" />
          <span className="text-gray-700 font-medium text-base">{averageRating}</span>
        </div>
      </div>

      <div className="flex items-center mb-8">
        <div className="flex items-center mr-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-6 w-6 ${
                star <= parseFloat(averageRating)
                  ? 'fill-amber-500 text-amber-500'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-lg font-medium">
          {averageRating} ({reviews.length} reviews)
        </span>
      </div>

      <div className="space-y-6 mb-8">
        {reviews.map((review) => (
          <div key={review.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-gray-500" />
                <span className="font-medium">{review.userName}</span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString('en-US')}
              </span>
            </div>
            <div className="flex items-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= review.rating
                      ? 'fill-amber-500 text-amber-500'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600">{review.comment}</p>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-gray-600">No reviews yet. Be the first to review!</p>
        )}
      </div>

      <Separator />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label htmlFor="userName" className="block mb-2 font-medium">Your Name</label>
            <Input
              id="userName"
              value={newReview.userName}
              onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
              placeholder="Enter your name..."
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Your Rating</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-8 w-8 cursor-pointer ${
                    star <= (hoverRating || newReview.rating)
                      ? 'fill-amber-500 text-amber-500'
                      : 'text-gray-300'
                  }`}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="comment" className="block mb-2 font-medium">Your Review</label>
            <Textarea
              id="comment"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Share your experience..."
              className="min-h-[100px]"
            />
          </div>
          <Button
            type="submit"
            className="bg-gradient-to-r from-teal-600 to-coral-600 text-white"
            disabled={newReview.rating === 0 || !newReview.comment.trim() || !newReview.userName.trim()}
          >
            <Send className="h-4 w-4 mr-2" />
            Submit Review
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Reviews;