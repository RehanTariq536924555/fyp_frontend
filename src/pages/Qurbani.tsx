import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import AnimalCard from '@/components/AnimalCard';
import { Button } from '@/components/ui/button';

const qurbaniImages = [
  {
    url: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?ixlib=rb-4.0.3",
    title: "Healthy Livestock for Sale",
    subtitle: "Find the best breeds with trusted sellers worldwide.",
  },
  {
    url: 'https://images.pexels.com/photos/458991/pexels-photo-458991.jpeg?auto=compress&cs=tinysrgb&w=2000&h=600',
    title: 'Premium Cow',
    subtitle: 'Healthy and well-cared-for cows for your Qurbani sacrifice.',
    animalType: 'Cow',
  },
 
];

const fetchQurbaniAnimals = async () => {
  const response = await fetch('http://localhost:3001/listings');
  if (!response.ok) {
    throw new Error(`Failed to fetch animals: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  console.log('Raw data from API:', data); // Log the raw data for debugging
  if (!Array.isArray(data)) {
    throw new Error('API returned invalid data: Expected an array');
  }
  
  // Filter to include only Qurbani animals
  return data.filter(animal => 
    ['Cow', 'Goat', 'Sheep', 'Camel'].includes(animal.type)
  );
};

const Animals = () => {
  const { data: animals = [], isLoading, error, refetch } = useQuery({
    queryKey: ['qurbaniAnimals'],
    queryFn: fetchQurbaniAnimals,
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });

  console.log('Animals component:', { isLoading, error, animals });

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p className="text-xl font-medium text-gray-700">Loading Qurbani animals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium mb-2 text-red-600">{error.message}</h3>
        <p className="text-gray-600 mb-6">Please check your server or try again later.</p>
        <Button
          onClick={() => refetch()}
          className="bg-gradient-to-r from-teal-600 to-coral-600 text-white"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold mb-4 text-black">Browse Qurbani Animals</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We've carefully selected these animals for Qurbani. Each one meets the religious requirements and has been well-cared for.
        </p>
      </div>

      {animals.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-xl font-medium mb-2 text-black">No Qurbani animals available</h3>
          <p className="text-gray-600 mb-6">
            We're currently restocking our Qurbani animals.
          </p>
          <Button className="bg-gradient-to-r from-teal-600 to-coral-600 text-white">
            Contact Us for Updates
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {animals.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
      )}
    </div>
  );
};

const QurbaniPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % qurbaniImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative pb-16 overflow-hidden">
          <div className="relative w-full h-[400px]">
            {qurbaniImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === activeIndex ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  backgroundImage: `url("${image.url}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />
                <div className="container mx-auto px-4 pt-10 pb-12 relative z-10 h-full flex items-center">
                  <div className="max-w-2xl text-white">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                      {image.title}
                    </h1>
                    <p className="text-lg text-white mb-6">{image.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Animals />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-teal-600 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/70 text-sm">
            © {new Date().getFullYear()} QurbaniMandi. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default QurbaniPage;