// AnimalCard.tsx
import { Animal } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AnimalCardProps {
  animal: Animal;
  className?: string;
}

const AnimalCard = ({ animal, className }: AnimalCardProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const serverBaseUrl = 'http://localhost:3001'; // Adjust if your server runs on a different URL
  const defaultImage = '/placeholder-animal.jpg';

  const formattedPrice = new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(animal.price || 0);

  const statusColors = {
    active: 'bg-teal-500',
    sold: 'bg-gray-500',
    archived: 'bg-red-500',
  };

  const navigateImage = (direction: 'next' | 'prev') => {
    if (!animal.images?.length) return;
    setCurrentImage((prev) =>
      direction === 'next'
        ? prev === animal.images.length - 1 ? 0 : prev + 1
        : prev === 0 ? animal.images.length - 1 : prev - 1
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group overflow-hidden rounded-xl bg-white shadow-sm border border-border card-hover',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-52 w-full overflow-hidden">
        {animal.images?.length > 1 && isHovered && (
          <>
            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => navigateImage('next')}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </>
        )}

        <img
          src={
            animal.images?.[currentImage]
              ? `${serverBaseUrl}${animal.images[currentImage]}`
              : defaultImage
          }
          alt={animal.title || 'Animal image'}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => (e.currentTarget.src = defaultImage)}
        />

        {animal.images?.length > 1 && (
          <div className="absolute bottom-2 right-2 flex gap-1">
            {animal.images.map((_, idx) => (
              <span
                key={idx}
                className={cn(
                  'inline-block h-1.5 w-1.5 rounded-full',
                  idx === currentImage ? 'bg-white' : 'bg-white/50'
                )}
              />
            ))}
          </div>
        )}

        <div
          className={cn(
            'absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium text-white',
            statusColors[animal.status]
          )}
        >
          {animal.status.charAt(0).toUpperCase() + animal.status.slice(1)}
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-medium truncate">{animal.title}</h3>

          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-white">
              <DropdownMenuItem>Edit Listing</DropdownMenuItem>
              <DropdownMenuItem>Promote</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">
                {animal.status === 'active' ? 'Archive' : 'Delete'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mb-3 flex items-center text-sm text-muted-foreground">
          <span>{animal.type.charAt(0).toUpperCase() + animal.type.slice(1)}</span>
          <span className="mx-1.5">•</span>
          <span>{animal.breed}</span>
          <span className="mx-1.5">•</span>
          <span>
            {animal.age} {animal.age === 1 ? 'year' : 'years'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">{formattedPrice}</p>
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          Listed on {new Date(animal.listed).toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  );
};

export default AnimalCard;