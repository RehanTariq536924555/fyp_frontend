
import { Animal, Purchase, Stats, User } from '@/types';

// Mock user data
export const currentUser: User = {
  id: 'user-1',
  name: 'Ahmed Khan',
  email: 'ahmed.khan@example.com',
  phone: '+92 300 1234567',
  avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop',
  address: '123 Main Street',
  city: 'Lahore',
  country: 'Pakistan',
  bio: 'Experienced animal breeder with over 10 years in the industry. Specializing in high-quality livestock.',
  rating: 4.8,
  isVerified: true,
  joinedDate: '2021-04-15',
};

// Mock stats data
export const sellerStats: Stats = {
  totalSales: 42,
  activeListings: 7,
  totalEarnings: 245000,
  viewsThisMonth: 320,
};


export const animalListings: Animal[] = [
 

];

// Mock purchase history
export const purchaseHistory: Purchase[] = [
  {
    id: 'purchase-1',
    animalId: 'animal-4',
    animal: animalListings.find(animal => animal.id === 'animal-4')!,
    buyerId: 'buyer-1',
    buyerName: 'Imran Ali',
    price: 48000,
    date: '2024-02-10',
    status: 'completed',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'purchase-2',
    animalId: 'animal-8',
    animal: {
      id: 'animal-8',
      sellerId: 'user-1',
      title: 'Premium Sheep for Qurbani',
      type: 'sheep',
      breed: 'Afghani',
      age: 1.5,
      weight: 55,
      price: 60000,
      description: 'Healthy sheep, perfect for Qurbani. Well fed and cared for.',
      images: [
        'https://images.unsplash.com/photo-1484557985045-edf25e08da73?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3'
      ],
      location: 'Peshawar, KPK',
      listed: '2023-06-10',
      status: 'sold',
    },
    buyerId: 'buyer-2',
    buyerName: 'Zain Ahmed',
    price: 58000,
    date: '2023-06-20',
    status: 'completed',
    paymentMethod: 'Cash on Delivery',
  },
  {
    id: 'purchase-3',
    animalId: 'animal-9',
    animal: {
      id: 'animal-9',
      sellerId: 'user-1',
      title: 'Brown Swiss Cow',
      type: 'cow',
      breed: 'Brown Swiss',
      age: 3,
      weight: 520,
      price: 180000,
      description: 'Imported Brown Swiss cow with excellent milk production. Prime health condition.',
      images: [
        'https://images.unsplash.com/photo-1533716146233-91bb3a5e5520?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3'
      ],
      location: 'Islamabad',
      listed: '2023-09-05',
      status: 'sold',
    },
    buyerId: 'buyer-3',
    buyerName: 'Farhan Shah',
    price: 175000,
    date: '2023-09-25',
    status: 'completed',
    paymentMethod: 'Bank Transfer',
  },
];
