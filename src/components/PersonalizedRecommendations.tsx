import React from 'react';
import RecommendationSystem from '../components/RecommendedAnimals';

interface PersonalizedRecommendationsProps {
  userId?: number;
  className?: string;
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  userId,
  className
}) => {
  return (
    <RecommendationSystem
      userId={userId}
      title="Personalized Recommendations"
      showReasons={true}
      limit={8}
      className={className}
    />
  );
};

export default PersonalizedRecommendations;