import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import AnimalCard from '@/components/AnimalCard';
import QurbaniSection from '@/components/QurbaniSection';
import { Animal } from '@/data/animals';

const Index = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch animals from backend
  useEffect(() => {
    const fetchAnimals = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3001/listings');
        if (!response.ok) {
          throw new Error('Failed to fetch animals');
        }
        const data = await response.json();
        console.log('Fetched animals:', data); // Debug: Log the data
        setAnimals(data);
      } catch (error) {
        console.error('Error fetching animals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Categorize animals based on title
  const featuredAnimals = animals.filter(animal => animal.title?.toLowerCase() === 'featured').slice(0, 3);
  const trendingAnimals = animals.filter(animal => animal.title?.toLowerCase() === 'trending').slice(0, 4);
  const qurbaniAnimals = animals.filter(animal => animal.title?.toLowerCase() === 'qurbani' || animal.forEid).slice(0, 4);

  // Debug: Log categorized animals
  console.log('Featured Animals:', featuredAnimals);
  console.log('Trending Animals:', trendingAnimals);
  console.log('Qurbani Animals:', qurbaniAnimals);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Featured Animals */}
        

        {/* Qurbani Special Section */}
        <QurbaniSection animals={qurbaniAnimals} isLoading={isLoading} />

        {/* Trending Now */}
      
            
        
      </main>

      {/* Footer */}
      <footer className="bg-teal-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">BakraMandi360</h3>
              <p className="text-white/80 text-sm">
                The premier platform for buying and selling quality livestock.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-white/80 hover:text-white text-sm">Home</Link></li>
                <li><Link to="/animals" className="text-white/80 hover:text-white text-sm">Browse Animals</Link></li>
                <li><Link to="/qurbani" className="text-white/80 hover:text-white text-sm">Qurbani Special</Link></li>
                <li><Link to="/orders" className="text-white/80 hover:text-white text-sm">My Orders</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Customer Service</h4>
              <ul className="space-y-2">
                <li><Link to="/contact" className="text-white/80 hover:text-white text-sm">Contact Us</Link></li>
                <li><Link to="/faq" className="text-white/80 hover:text-white text-sm">FAQs</Link></li>
                <li><Link to="/terms" className="text-white/80 hover:text-white text-sm">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-white/80 hover:text-white text-sm">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Contact</h4>
              <address className="not-italic text-white/80 text-sm space-y-2">
                <p>1234 Market Street</p>
                <p>Karachi, Pakistan</p>
                <p className="mt-4">info@BakraMandi360.com</p>
                <p>+92 300 1234567</p>
              </address>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/20 text-center text-white/70 text-sm">
            © {new Date().getFullYear()} BakraMandi360. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;