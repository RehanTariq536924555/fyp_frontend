import { useState, useEffect } from 'react';
import { Animal } from '@/data/animals';

interface RecommendedAnimal extends Animal {
  recommendationScore?: number;
  recommendationReasons?: string[];
}

interface UseRecommendationsProps {
  userId?: number;
  currentAnimalId?: number;
  limit?: number;
}

export const useRecommendations = ({ 
  userId, 
  currentAnimalId, 
  limit = 6 
}: UseRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<RecommendedAnimal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      let url = '';
      let headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token && userId) {
        url = `http://localhost:3001/recommendations/user?currentAnimalId=${currentAnimalId || ''}&limit=${limit}`;
        headers.Authorization = `Bearer ${token}`;
      } else if (currentAnimalId) {
        url = `http://localhost:3001/recommendations/animal/${currentAnimalId}?limit=${limit}`;
      } else {
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
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [userId, currentAnimalId, limit]);

  return {
    recommendations,
    loading,
    error,
    refetch: fetchRecommendations
  };
};