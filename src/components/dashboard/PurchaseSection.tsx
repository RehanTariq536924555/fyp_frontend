
import { Purchase } from '@/types';
import { purchaseHistory } from '@/utils/data';
import { motion } from 'framer-motion';
import { Check, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatCard from '../ui/StatCard';
import { BarChart2, Calendar, CreditCard, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const PurchaseSection = () => {
  const completedPurchases = purchaseHistory.filter(
    (purchase) => purchase.status === 'completed'
  );
  
  const pendingPurchases = purchaseHistory.filter(
    (purchase) => purchase.status === 'pending'
  );
  
  const cancelledPurchases = purchaseHistory.filter(
    (purchase) => purchase.status === 'cancelled'
  );
  
  const totalSales = completedPurchases.length;
  const totalRevenue = completedPurchases.reduce(
    (sum, purchase) => sum + purchase.price,
    0
  );
  
  const renderPurchaseItem = (purchase: Purchase) => {
    const statusColors = {
      completed: 'text-teal-600 bg-teal-50',
      pending: 'text-amber-600 bg-amber-50',
      cancelled: 'text-red-600 bg-red-50',
    };
    
    const formattedPrice = new Intl.NumberFormat('en-PK', { 
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(purchase.price);
    
    return (
      <div 
        key={purchase.id}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border p-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 overflow-hidden rounded-md flex-shrink-0">
            <img 
              src={purchase.animal.images[0]} 
              alt={purchase.animal.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div>
            <h3 className="font-medium">{purchase.animal.title}</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted-foreground">
              <span>#{purchase.id.slice(-5)}</span>
              <span className="hidden sm:inline">•</span>
              <span>{new Date(purchase.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <Badge 
            variant="outline" 
            className={cn(
              "capitalize font-normal",
              statusColors[purchase.status]
            )}
          >
            {purchase.status}
          </Badge>
          
          <div className="font-medium">{formattedPrice}</div>
          
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost">
              <Eye className="h-4 w-4" />
            </Button>
            
            <Button size="icon" variant="ghost">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sales History</h1>
        <p className="text-muted-foreground">
          Track your sales and revenue
        </p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Sales" 
          value={totalSales} 
          icon={<Check className="h-5 w-5" />}
          trend={{ value: 12, isPositive: true }}
        />
        
        <StatCard 
          title="Total Revenue" 
          value={totalRevenue} 
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: 8, isPositive: true }}
        />
        
        <StatCard 
          title="Active Listings" 
          value={7} 
          icon={<BarChart2 className="h-5 w-5" />}
          trend={{ value: 5, isPositive: true }}
        />
        
        <StatCard 
          title="Avg. Sale Price" 
          value={Math.round(totalRevenue / totalSales)} 
          icon={<CreditCard className="h-5 w-5" />}
          trend={{ value: 3, isPositive: true }}
        />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Buyers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedPurchases.slice(0, 5).map((purchase) => (
                <div key={purchase.id} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {purchase.buyerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{purchase.buyerName}</h4>
                    <p className="text-xs text-muted-foreground">
                      Purchased: {purchase.animal.title}
                    </p>
                  </div>
                  
                  <div className="text-sm font-medium">
                    {new Intl.NumberFormat('en-PK', { 
                      style: 'currency',
                      currency: 'PKR',
                      maximumFractionDigits: 0
                    }).format(purchase.price)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Qurbani Eid Season</h4>
                  <p className="text-xs text-muted-foreground">
                    Starting June 15, 2024
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Spring Livestock Fair</h4>
                  <p className="text-xs text-muted-foreground">
                    March 10, 2024
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Animal Health Workshop</h4>
                  <p className="text-xs text-muted-foreground">
                    April 5, 2024
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">
            All Sales
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4 space-y-4">
          {purchaseHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <h3 className="text-lg font-medium">No sales yet</h3>
              <p className="text-muted-foreground">
                Your sales history will appear here
              </p>
            </div>
          ) : (
            purchaseHistory.map(renderPurchaseItem)
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4 space-y-4">
          {completedPurchases.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <h3 className="text-lg font-medium">No completed sales</h3>
              <p className="text-muted-foreground">
                Your completed sales will appear here
              </p>
            </div>
          ) : (
            completedPurchases.map(renderPurchaseItem)
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="mt-4 space-y-4">
          {pendingPurchases.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <h3 className="text-lg font-medium">No pending sales</h3>
              <p className="text-muted-foreground">
                Your pending sales will appear here
              </p>
            </div>
          ) : (
            pendingPurchases.map(renderPurchaseItem)
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default PurchaseSection;
