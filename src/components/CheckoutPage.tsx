
import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentMethodSection from '@/components/PaymentMethodSection';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_test_51RLgU02R9Vg2DGVBURLjCaSKlywU3eWq5rk1uL8w8A4h7IyDgIkrhROuzfRP0AM7a6h07rK6eDCCmmcCkv3Ugyor00wdNQeJqU', {
  locale: 'en',
});

const CheckoutPage: React.FC = () => {
  const { cartItems, cartTotal, clearCart } = useCart(); // Added clearCart
  const navigate = useNavigate();
  const [stripeError, setStripeError] = useState<string | null>(null);

  // Calculate 2% company tax
  const companyTaxRate = 0.02;
  const companyTax = cartTotal * companyTaxRate;
  const grandTotal = cartTotal + companyTax;

  // Debug Stripe loading
  useEffect(() => {
    stripePromise.then(stripe => {
      if (!stripe) {
        console.error('Stripe failed to initialize');
        setStripeError('Failed to load Stripe. Please check your publishable key and network connection.');
      } else {
        console.log('Stripe initialized successfully');
      }
    }).catch(error => {
      console.error('Stripe load error:', error);
      setStripeError('Error loading Stripe: ' + error.message);
    });
  }, []);

  const handlePaymentCompleted = () => {
    clearCart(); // Clear cart after successful payment
    toast.success('Order placed successfully!');
    navigate('/orders', { state: { orderConfirmed: true } });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto max-w-4xl pt-24 pb-16 px-4">
          <h1 className="text-3xl font-bold text-teal-800 mb-4">Checkout</h1>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button
              className="mt-4 bg-gradient-to-r from-teal-600 to-coral-600 text-white"
              onClick={() => navigate('/animals')}
            >
              Browse Animals
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (stripeError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto max-w-4xl pt-24 pb-16 px-4">
          <h1 className="text-3xl font-bold text-teal-800 mb-4">Checkout</h1>
          <div className="text-center py-8">
            <p className="text-red-600">{stripeError}</p>
            <Button
              className="mt-4 bg-gradient-to-r from-teal-600 to-coral-600 text-white"
              onClick={() => navigate('/cart')}
            >
              Return to Cart
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto max-w-4xl pt-24 pb-16 px-4">
        <h1 className="text-3xl font-bold text-teal-800 mb-4">Checkout</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>
            <div className="border rounded-md p-4 bg-white">
              <p className="text-sm text-muted-foreground mb-2">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in cart
              </p>
              <div className="space-y-2 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.title}</span>
                    <span>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'PKR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(item.price)}
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-sm mb-2">
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
              <div className="flex justify-between text-sm mb-2">
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
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span>Free</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-sm font-medium">
                <span>Total</span>
                <span>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'PKR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(grandTotal)}
                </span>
              </div>
            </div>
          </div>
          <div>
            <Elements stripe={stripePromise}>
              <PaymentMethodSection
                onCompleted={handlePaymentCompleted}
                totalAmount={grandTotal}
              />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;