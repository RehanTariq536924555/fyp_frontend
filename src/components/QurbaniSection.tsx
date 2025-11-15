import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimalCard from './AnimalCard';
import { Animal } from '@/data/animals';

interface QurbaniSectionProps {
  animals: Animal[];
  isLoading: boolean;
}

const QurbaniSection: React.FC<QurbaniSectionProps> = ({ animals, isLoading }) => {
  // Calculate days until Eid-ul-Adha (assuming Eid is June 16, 2025)
  const calculateDaysUntilEid = () => {
    const today = new Date();
    const eidDate = new Date('2025-06-16'); // Adjust based on actual Eid date
    const timeDiff = eidDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };
  const daysUntilEid = calculateDaysUntilEid();

  return (
    <section className="py-16 md:py-24 bg-teal-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-3xl mx-auto text-center"
        >
          <div className="inline-block mb-4 px-4 py-2 bg-teal-100 rounded-full shadow-sm">
            <p className="text-sm font-semibold text-teal-700">Qurbani Special</p>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-800">
            Premium Animals for Eid-ul-Adha
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Discover our carefully selected Qurbani animals, verified for health and quality.
          </p>
          <div className="inline-block bg-teal-100 px-5 py-3 rounded-full text-sm font-medium text-teal-800 shadow-sm">
            <span className="font-semibold">{daysUntilEid} days</span> until Eid-ul-Adha
          </div>
        </motion.div>
        {isLoading ? (
          <p className="text-center text-gray-600 text-lg">Loading...</p>
        ) : animals.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No Qurbani animals available at the moment.
          </p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {animals.slice(0, 4).map((animal, index) => (
              <AnimalCard key={animal.id} animal={animal} featured={index === 0} />
            ))}
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Button
            asChild
            size="lg"
            className="bg-teal-600 text-white hover:bg-teal-700 rounded-full px-8 py-3 text-lg font-semibold transition-all"
          >
            <Link to="/qurbani">
              View All Qurbani Animals <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default QurbaniSection;