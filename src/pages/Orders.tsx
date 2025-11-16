
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Clock, CheckCircle, XCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

interface Order {
  id: string;
  date: string;
  items: { id: number; name: string; quantity: number; price: number }[];
  status: 'Completed' | 'Pending' | 'Cancelled';
  total: number;
}

const Orders: React.FC = () => {
  const { state } = useLocation();
  const orderConfirmed = state?.orderConfirmed;
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Orders page - Token exists:', !!token);
        
        if (!token) {
          console.log('Orders page - No token found, redirecting to home');
          toast.error('Please log in to view your orders.');
          navigate('/');
          return;
        }

        console.log('Orders page - Fetching orders with token');
        const response = await axios.get('http://localhost:3001/payment', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log('Orders page - Response received:', response.data);
        setOrders(
          response.data.map((order: any) => ({
            id: order.orderId,
            date: order.date,
            items: order.items.map((item: any) => ({
              id: item.id,
              name: item.title,
              quantity: 1, // Assuming quantity is 1; adjust if backend provides quantity
              price: item.price,
            })),
            status: order.status,
            total: order.total,
          }))
        );
        console.log('Orders page - Orders set successfully');
      } catch (error) {
        console.error('Orders page - Error fetching orders:', error);
        console.error('Orders page - Error response:', error.response);
        
        if (error.response?.status === 401) {
          console.log('Orders page - 401 error, removing token and redirecting');
          toast.error('Session expired. Please log in again.');
          localStorage.removeItem('token');
          navigate('/');
        } else {
          console.log('Orders page - Other error:', error.message);
          toast.error('Failed to load orders. Please try again.');
        }
      }
    };
    fetchOrders();
  }, [navigate]);

  const cancelOrder = async (orderId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to cancel orders.');
        return;
      }

      console.log(`User cancelling/deleting order ${orderId}`);
      await axios.delete(`http://localhost:3001/payment/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(orders.filter(order => order.id !== orderId));
      toast.success(`Order ${orderId.slice(0, 8)} cancelled and removed`);
    } catch (error) {
      console.error(`Error cancelling order ${orderId}:`, error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/');
      } else {
        toast.error(`Failed to cancel order ${orderId.slice(0, 8)}.`);
      }
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <Badge className="bg-teal-600 hover:bg-teal-700 text-white font-roboto">
            Completed
          </Badge>
        );
      case 'Pending':
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-roboto">
            Pending
          </Badge>
        );
      case 'Cancelled':
        return (
          <Badge className="bg-coral-600 hover:bg-coral-700 text-white font-roboto">
            Cancelled
          </Badge>
        );
      default:
        return <Badge className="bg-gray-500 text-white font-roboto">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-5 w-5 text-teal-600" />;
      case 'Pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'Cancelled':
        return <XCircle className="h-5 w-5 text-coral-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-teal-50">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-teal-800 mb-3 font-quicksand tracking-tight">
                My Orders
              </h1>
              <p className="text-lg text-gray-600 font-roboto">
                View and manage your purchase history
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="border-teal-200 text-teal-600 hover:bg-teal-100 rounded-full"
              onClick={() => navigate('/')}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Order Confirmation Message */}
          {orderConfirmed && (
            <div className="mb-8 p-6 bg-teal-100 rounded-xl shadow-md animate-fade-in">
              <div className="flex items-center justify-center gap-3">
                <CheckCircle className="h-8 w-8 text-teal-600" />
                <div>
                  <h3 className="text-xl font-semibold text-teal-800 font-quicksand">
                    Order Confirmed!
                  </h3>
                  <p className="text-gray-600 font-roboto">
                    Thank you for your purchase. We've sent a confirmation to your email.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-teal-100 rounded-xl p-1.5 shadow-sm">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-teal-800 hover:bg-teal-200 rounded-lg py-2.5 font-roboto transition-all duration-300"
              >
                All Orders
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-teal-800 hover:bg-teal-200 rounded-lg py-2.5 font-roboto transition-all duration-300"
              >
                Pending
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-teal-800 hover:bg-teal-200 rounded-lg py-2.5 font-roboto transition-all duration-300"
              >
                Completed
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {orders.length === 0 ? (
                <EmptyOrders />
              ) : (
                orders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    formatPrice={formatPrice}
                    formatDate={formatDate}
                    getStatusBadge={getStatusBadge}
                    getStatusIcon={getStatusIcon}
                    cancelOrder={cancelOrder}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-6">
              {orders.filter((order) => order.status === 'Pending').length === 0 ? (
                <EmptyOrders message="No pending orders found" />
              ) : (
                orders
                  .filter((order) => order.status === 'Pending')
                  .map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      formatPrice={formatPrice}
                      formatDate={formatDate}
                      getStatusBadge={getStatusBadge}
                      getStatusIcon={getStatusIcon}
                      cancelOrder={cancelOrder}
                    />
                  ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              {orders.filter((order) => order.status === 'Completed').length === 0 ? (
                <EmptyOrders message="No completed orders found" />
              ) : (
                orders
                  .filter((order) => order.status === 'Completed')
                  .map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      formatPrice={formatPrice}
                      formatDate={formatDate}
                      getStatusBadge={getStatusBadge}
                      getStatusIcon={getStatusIcon}
                      cancelOrder={cancelOrder}
                    />
                  ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-teal-700 to-coral-700 text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/80 text-sm font-roboto">
            © {new Date().getFullYear()} BakraMandi360. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

const OrderCard = ({
  order,
  formatPrice,
  formatDate,
  getStatusBadge,
  getStatusIcon,
  cancelOrder,
}: {
  order: Order;
  formatPrice: (price: number) => string;
  formatDate: (dateString: string) => string;
  getStatusBadge: (status: string) => JSX.Element;
  getStatusIcon: (status: string) => JSX.Element | null;
  cancelOrder: (orderId: string) => void;
}) => (
  <div className="bg-white rounded-xl border border-teal-200 shadow-md hover:shadow-xl transition-all duration-300 p-6">
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        {getStatusIcon(order.status)}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-teal-800 font-roboto">
              Order #{order.id.slice(0, 8)}
            </h3>
            {getStatusBadge(order.status)}
          </div>
          <p className="text-sm text-gray-600 font-roboto">
            Placed on {formatDate(order.date)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-3 md:mt-0">
        <p className="text-xl font-bold text-teal-800 font-quicksand">
          {formatPrice(order.total)}
        </p>
        <Button
          variant="outline"
          size="icon"
          className="border-coral-600 text-coral-600 hover:bg-coral-100 rounded-full"
          onClick={() => cancelOrder(order.id)}
          title="Cancel Order"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>

    <div className="space-y-3">
      {order.items.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center border-t pt-3 first:border-t-0"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal-600"></div>
            <span className="text-teal-800 font-roboto">{item.name}</span>
            {item.quantity > 1 && (
              <span className="text-gray-600 font-roboto">x{item.quantity}</span>
            )}
          </div>
          <span className="text-teal-800 font-roboto">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const EmptyOrders = ({ message = "You don't have any orders yet" }: { message?: string }) => (
  <div className="text-center py-16 bg-teal-50 rounded-xl shadow-sm">
    <div className="flex justify-center mb-4">
      <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center">
        <ShoppingBag className="h-10 w-10 text-teal-600" />
      </div>
    </div>
    <h3 className="text-2xl font-semibold text-teal-800 mb-3 font-quicksand">
      {message}
    </h3>
    <p className="text-gray-600 mb-6 font-roboto">
      Start shopping to see your orders here
    </p>
    <Button
      asChild
      className="bg-gradient-to-r from-teal-600 to-coral-600 text-white hover:from-teal-700 hover:to-coral-700 font-roboto px-6 py-2 rounded-full"
    >
      <Link to="/animals">Browse Animals</Link>
    </Button>
  </div>
);

export default Orders;
