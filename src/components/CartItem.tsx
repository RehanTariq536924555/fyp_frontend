import React from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Animal } from '@/data/animals';
import { useCart } from '@/contexts/CartContext';

interface CartItemProps {
  item: Animal & { quantity: number };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const baseUrl = 'http://localhost:3001';
  const fallbackImage = '/placeholder-image.jpg'; // Ensure this exists in public/

  const getImageUrl = () => {
    console.log('Item images:', { images: item?.images, image: item?.image });
    if (item?.images && Array.isArray(item.images) && item.images.length > 0) {
      const imagePath = item.images[0];
      if (!imagePath) return fallbackImage;
      return imagePath.startsWith('http') ? imagePath : `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    }
    if (item?.image) {
      return item.image.startsWith('http') ? item.image : `${baseUrl}${item.image.startsWith('/') ? '' : '/'}${item.image}`;
    }
    return fallbackImage;
  };

  const imageUrl = getImageUrl();
  console.log('Image URL:', imageUrl);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex gap-3 py-2 subtle-border rounded-lg p-3 min-w-0">
      {/* Item Image */}
      <div className="relative bg-gray-200 rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 aspect-[4/3] w-32">
        <img
          src={imageUrl} // Fixed: Use imageUrl instead of imageSrc
          alt={item?.title || item?.type || 'Animal'}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            console.error('Image failed to load:', imageUrl); // Fixed: Use imageUrl
            e.currentTarget.src = fallbackImage;
          }}
          onLoad={() => console.log('Image loaded successfully:', imageUrl)} // Fixed: Use imageUrl
          loading="lazy"
        />
      </div>

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <div className=" flex justify-between items-start">
          <div>
            <h4 className="font-medium text-sm truncate pr-2">{item.title}</h4>
            <p className="text-muted-foreground text-xs">{item.type} - {item.breed}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 bg-gradient-to-r from-teal-600 to-coral-600"
            onClick={() => removeFromCart(item.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-2 flex justify-between items-center">
          <p className="font-medium">{formatPrice(item.price)}</p>

          {/* Quantity Controls */}
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-none bg-gradient-to-r from-teal-600 to-coral-600"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-none bg-gradient-to-r from-teal-600 to-coral-600"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;