
export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  address: string;
  city: string;
  country: string;
  bio: string;
  rating: number;
  isVerified: boolean;
  joinedDate: string;
};

export type AnimalType = 'cow' | 'goat' | 'sheep' | 'camel' | 'horse' | 'other';

export type Animal = {
  id: string;
  sellerId: string;
  title: string;
  type: AnimalType;
  breed: string;
  age: number;
  weight: number;
  price: number;
  description: string;
  images: string[];
  location: string;
  listed: string;
  status: 'active' | 'sold' | 'archived';
};

export type Purchase = {
  id: string;
  animalId: string;
  animal: Animal;
  buyerId: string;
  buyerName: string;
  price: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  paymentMethod: string;
};

export type Stats = {
  totalSales: number;
  activeListings: number;
  totalEarnings: number;
  viewsThisMonth: number;
};

export type DashboardSection = 'profile' | 'listings' | 'purchases' | 'settings' | 'payments';

export type PaymentMethod = {
  id: string;
  type: 'bank' | 'card' | 'wallet';
  name: string;
  details: string;
  isDefault: boolean;
  lastUsed?: string;
};

export type PaymentHistory = {
  id: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  method: string;
  description: string;
};
