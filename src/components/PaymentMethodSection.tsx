
import React, { useState } from 'react';
import { Building, DollarSign, CheckCircle, ChevronRight } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

interface PaymentMethodSectionProps {
  onCompleted: () => void;
  totalAmount: number;
}

type PaymentMethod = 'bank-transfer' | 'cash';

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  onCompleted,
  totalAmount,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank-transfer');
  const [paymentDetails, setPaymentDetails] = useState({
    bankName: '',
    accountNumber: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { cartItems } = useCart();

  // Calculate subtotal and tax from totalAmount
  const companyTaxRate = 0.02;
  const subtotal = totalAmount / (1 + companyTaxRate);
  const companyTax = totalAmount - subtotal;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting payment, method:', paymentMethod); // Debug
    if (!cartItems.length) {
      toast.error('Cart is empty');
      return;
    }
    if (
      paymentMethod === 'bank-transfer' &&
      (!paymentDetails.bankName || !paymentDetails.accountNumber)
    ) {
      toast.error('Please provide bank name and account number');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to place an order');
      return;
    }

    setIsProcessing(true);

    try {
      const orderId = uuidv4();

      // No need to decode JWT token manually - backend will extract user ID from token

      const paymentData = {
        amount: totalAmount,
        currency: 'pkr',
        paymentMethod,
        orderId,
        items: cartItems.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
        })),
        paymentDetails:
          paymentMethod === 'bank-transfer'
            ? {
                bankName: paymentDetails.bankName,
                accountNumber: paymentDetails.accountNumber,
              }
            : undefined,
      };

      console.log('Sending payment data:', paymentData); // Debug
      await axios.post('http://localhost:3001/payment', paymentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await axios.post(`http://localhost:3001/payment/confirm/${orderId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(
        paymentMethod === 'cash'
          ? 'Order placed! Awaiting delivery confirmation.'
          : 'Order placed! Awaiting bank transfer verification.'
      );
      console.log('Calling onCompleted for', paymentMethod); // Debug
      onCompleted();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(
        error.response?.data?.message || error.message || 'Order placement failed'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4 font-quicksand">Payment Method</h3>

      <form onSubmit={handleSubmit}>
        <RadioGroup
          value={paymentMethod}
          onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
          className="space-y-3 mb-6"
        >
          <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50 cursor-pointer">
            <RadioGroupItem value="bank-transfer" id="bank-transfer" />
            <Label
              htmlFor="bank-transfer"
              className="flex items-center cursor-pointer"
            >
              <Building className="h-5 w-5 mr-2 text-teal-600" />
              Bank Transfer
            </Label>
          </div>

          <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50 cursor-pointer">
            <RadioGroupItem value="cash" id="cash" />
            <Label htmlFor="cash" className="flex items-center cursor-pointer">
              <DollarSign className="h-5 w-5 mr-2 text-teal-600" />
              Cash on Delivery
            </Label>
          </div>
        </RadioGroup>

        {paymentMethod === 'bank-transfer' && (
          <div className="space-y-4 border p-4 rounded-md bg-teal-50/50">
            <div>
              <Label htmlFor="bankName" className="font-roboto">
                Bank Name
              </Label>
              <Input
                id="bankName"
                name="bankName"
                placeholder="Enter Bank Name"
                value={paymentDetails.bankName}
                onChange={handleInputChange}
                required
                className="border-teal-200 focus:ring-teal-600"
              />
            </div>

            <div>
              <Label htmlFor="accountNumber" className="font-roboto">
                Account Number
              </Label>
              <Input
                id="accountNumber"
                name="accountNumber"
                placeholder="Enter Account Number"
                value={paymentDetails.accountNumber}
                onChange={handleInputChange}
                required
                className="border-teal-200 focus:ring-teal-600"
              />
            </div>
          </div>
        )}

        {paymentMethod === 'cash' && (
          <div className="border p-4 rounded-md bg-teal-50/50">
            <div className="flex items-start mb-3">
              <CheckCircle className="h-5 w-5 mr-2 text-teal-600 shrink-0 mt-0.5" />
              <p className="text-sm font-roboto">
                Pay when your order is delivered. Our delivery person will carry a
                portable card machine if you prefer not to use cash.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6">
          <div className="border-t pt-3">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 font-roboto">Subtotal</span>
              <span className="font-roboto">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'PKR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 font-roboto">Company Tax (2%)</span>
              <span className="font-roboto">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'PKR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(companyTax)}
              </span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between items-center py-3">
              <span className="font-medium font-roboto">Total</span>
              <span className="font-bold text-xl font-quicksand">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'PKR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(totalAmount)}
              </span>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full mt-3 bg-gradient-to-r from-teal-600 to-coral-600 text-white hover:from-teal-700 hover:to-coral-700 rounded-lg font-roboto"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Place Order'}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentMethodSection;
