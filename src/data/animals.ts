// types/animal.ts
export interface Animal {
  id: number;
  name: string;
  type: 'cow' | 'goat' | 'sheep' | 'camel';
  breed: string;
  age: number;
  weight: number;
  price: number;
  description: string;
  title?: string;
  location: string;
  sellerId: number;
  sellerName?: string;
  sellerPhone?: string;
  sellerWhatsapp?: string;
  rating?: number;
  reviews?: number;
  forEid: boolean;
  category: 'featured' | 'trending' | 'qurbani';
  image?: string;
  images?: string[];
  
  isFeatured?: boolean; // Optional property
  isTrending?: boolean;
}

// Empty array as fallback
export const animals: Animal[] = [];

// Helper functions (kept for potential future use)
export const getRecommendedAnimals = (currentAnimalId?: number, forEid?: boolean): Animal[] => {
  let recommendations = currentAnimalId
    ? animals.filter((animal) => animal.id !== currentAnimalId)
    : [...animals];

  if (forEid) {
    recommendations = recommendations.filter((animal) => animal.forEid);
  }

  return recommendations
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);
};

export const getEidAnimals = (): Animal[] => {
  return animals
    .filter((animal) => animal.forEid)
    .sort(() => 0.5 - Math.random())
    .slice(0, 6);
};

export const getPriceRange = (): { min: number; max: number } => {
  const prices = animals.map((animal) => animal.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
};