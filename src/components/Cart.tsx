
import React, { useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import CartItem from '@/components/CartItem';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';

interface CartProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen: externalIsOpen, onClose }) => {
  const { cartItems, cartTotal } = useCart();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const navigate = useNavigate();

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  // Calculate 2% company tax
  const companyTaxRate = 0.02;
  const companyTax = cartTotal * companyTaxRate;
  const grandTotal = cartTotal + companyTax;

  const setIsOpen = (value: boolean) => {
    if (externalIsOpen !== undefined && onClose && !value) {
      onClose();
    } else {
      setInternalIsOpen(value);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setIsOpen(false);
    navigate('/checkout');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative bg-gradient-to-r from-teal-600 to-coral-600">
          <ShoppingCart className="h-[1.2rem] w-[1.2rem] text-white" />
          {cartItems.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
              {cartItems.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground text-center mb-6">
              Looks like you haven't added any animals to your cart yet.
            </p>
            <Link to="/animals" onClick={() => setIsOpen(false)}>
              <Button className="bg-gradient-to-r from-teal-600 to-coral-600 text-white">
                Browse Animals
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto py-4">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            <div className="border-t pt-4 mt-auto">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Subtotal</span>
                <span>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'PKR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(cartTotal)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Company Tax (2%)</span>
                <span>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'PKR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(companyTax)}
                </span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-muted-foreground">Delivery</span>
                <span>Free</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between mb-6">
                <span className="font-medium">Total</span>
                <span className="font-bold">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'PKR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(grandTotal)}
                </span>
              </div>
              <div className="space-y-2">
                <Button
                  className="w-full bg-gradient-to-r from-teal-600 to-coral-600 text-white"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-gradient-to-r from-teal-600 to-coral-600 text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
