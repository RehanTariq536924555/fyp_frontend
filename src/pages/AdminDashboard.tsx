import { useState, useEffect } from "react";
import { LayoutDashboard, ShoppingCart, Users, Tag, TrendingUp, Clock, ListFilter, UserCheck, Store } from "lucide-react";
import { StatsCard } from "@/components/Admindashboard/StatsCard";
import { LineChart } from "@/components/Admindashboard/LineChart";
import { BarChart } from "@/components/Admindashboard/BarChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DashboardStats {
  totalSales: number;
  monthlyRevenue: number;
  totalBuyers: number;
  totalSellers: number;
  activeListings: number;
  salesTrend: number;
  revenueTrend: number;
  buyersTrend: number;
  sellersTrend: number;
  listingsTrend: number;
}

interface Transaction {
  id: string;
  orderId: string;
  buyer: string;
  animal: string;
  amount: number;
  status: string;
  date: string;
}

interface ChartData {
  name: string;
  value: number;
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    monthlyRevenue: 0,
    totalBuyers: 0,
    totalSellers: 0,
    activeListings: 0,
    salesTrend: 0,
    revenueTrend: 0,
    buyersTrend: 0,
    sellersTrend: 0,
    listingsTrend: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState({
    salesData: [] as ChartData[],
    revenueData: [] as ChartData[],
    userGrowthData: [] as ChartData[],
    activeListingsData: [] as ChartData[],
  });

  // Fetch real data from APIs
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all orders for admin
      const ordersResponse = await fetch('http://localhost:3001/payment/admin/all');
      const ordersData = await ordersResponse.json();
      
      // Fetch all listings
      const listingsResponse = await fetch('http://localhost:3001/listings');
      const listingsData = await listingsResponse.json();
      
      // Get admin token for authenticated requests
      const token = localStorage.getItem('token');
      const sellerToken = localStorage.getItem('sellerToken');
      const buyerToken = localStorage.getItem('buyerToken');
      
      // Create headers for different endpoints
      const createHeaders = (authToken?: string) => {
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        if (authToken) {
          headers.Authorization = `Bearer ${authToken}`;
        }
        return headers;
      };

      // Fetch buyers
      let buyersData = [];
      for (const authToken of [token, buyerToken, null]) {
        if (buyersData.length > 0) break;
        
        try {
          const buyersHeaders = createHeaders(authToken);
          const buyersResponse = await fetch('http://localhost:3001/users', { headers: buyersHeaders });
          if (buyersResponse.ok) {
            buyersData = await buyersResponse.json();
            break;
          }
        } catch (error) {
          console.log('Buyers endpoint error:', error);
        }
      }
      
      // Fetch sellers
      let sellersData = [];
      for (const authToken of [sellerToken, token, null]) {
        if (sellersData.length > 0) break;
        
        try {
          const sellersHeaders = createHeaders(authToken);
          const sellersResponse = await fetch('http://localhost:3001/auther/Seller', { headers: sellersHeaders });
          if (sellersResponse.ok) {
            sellersData = await sellersResponse.json();
            break;
          }
        } catch (error) {
          console.log('Sellers /auther/Seller error:', error);
        }
      }
      
      // If no sellers found, try /seller endpoint
      if (!Array.isArray(sellersData) || sellersData.length === 0) {
        for (const authToken of [sellerToken, token, null]) {
          if (sellersData.length > 0) break;
          
          try {
            const sellersHeaders = createHeaders(authToken);
            const sellersResponse = await fetch('http://localhost:3001/seller', { headers: sellersHeaders });
            if (sellersResponse.ok) {
              sellersData = await sellersResponse.json();
              break;
            }
          } catch (error) {
            console.log('Sellers /seller error:', error);
          }
        }
      }
      
      // Calculate stats from real data
      const totalSales = ordersData.length;
      const monthlyRevenue = ordersData.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
      const activeListings = listingsData.length;
      const totalBuyers = Array.isArray(buyersData) ? buyersData.length : 0;
      const totalSellers = Array.isArray(sellersData) ? sellersData.length : 0;
      
      // Format recent transactions
      const recentTransactions: Transaction[] = ordersData
        .slice(0, 4)
        .map((order: any) => ({
          id: order.id,
          orderId: order.orderId,
          buyer: order.buyer || 'Unknown Buyer',
          animal: order.items?.[0]?.title || 'Animal Purchase',
          amount: order.total || 0,
          status: order.status || 'pending',
          date: new Date(order.date || Date.now()).toLocaleDateString(),
        }));

      // Generate chart data from orders (group by month)
      const monthlyData = ordersData.reduce((acc: any, order: any) => {
        const month = new Date(order.date || Date.now()).toLocaleDateString('en-US', { month: 'short' });
        if (!acc[month]) {
          acc[month] = { sales: 0, revenue: 0 };
        }
        acc[month].sales += 1;
        acc[month].revenue += order.total || 0;
        return acc;
      }, {});

      const salesData = Object.entries(monthlyData).map(([name, data]: [string, any]) => ({
        name,
        value: data.sales,
      }));

      const revenueData = Object.entries(monthlyData).map(([name, data]: [string, any]) => ({
        name,
        value: data.revenue,
      }));

      setStats({
        totalSales,
        monthlyRevenue,
        totalBuyers,
        totalSellers,
        activeListings,
        salesTrend: 12,
        revenueTrend: 8,
        buyersTrend: 24,
        sellersTrend: 15,
        listingsTrend: -5,
      });

      setTransactions(recentTransactions);
      setChartData({
        salesData,
        revenueData,
        userGrowthData: [
          { name: "Jan", value: 250 },
          { name: "Feb", value: 450 },
          { name: "Mar", value: 650 },
          { name: "Apr", value: 820 },
        ],
        activeListingsData: [
          { name: "Jan", value: 50 },
          { name: "Feb", value: 75 },
          { name: "Mar", value: 100 },
          { name: "Apr", value: activeListings },
        ],
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-float">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Header */}
      <div className="py-6 px-8 flex items-center justify-between border-b bg-card/50 sticky top-0 z-10 backdrop-blur">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 py-2 rounded-full"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <ListFilter className="h-4 w-4" />
            </div>
          </div>
          <Avatar className="h-9 w-9 transition-transform hover:scale-105">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="p-8">
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatsCard 
            title="Total Sales" 
            value={stats.totalSales.toString()} 
            icon={<ShoppingCart className="h-5 w-5" />} 
            trend={{ value: stats.salesTrend, positive: stats.salesTrend > 0 }}
          />
          <StatsCard 
            title="Monthly Revenue" 
            value={`Rs ${stats.monthlyRevenue.toLocaleString()}`} 
            icon={<TrendingUp className="h-5 w-5" />} 
            trend={{ value: stats.revenueTrend, positive: stats.revenueTrend > 0 }}
          />
          <StatsCard 
            title="Total Buyers" 
            value={stats.totalBuyers.toString()} 
            icon={<UserCheck className="h-5 w-5" />} 
            trend={{ value: stats.buyersTrend, positive: stats.buyersTrend > 0 }}
          />
          <StatsCard 
            title="Total Sellers" 
            value={stats.totalSellers.toString()} 
            icon={<Store className="h-5 w-5" />} 
            trend={{ value: stats.sellersTrend, positive: stats.sellersTrend > 0 }}
          />
          <StatsCard 
            title="Active Listings" 
            value={stats.activeListings.toString()} 
            icon={<Tag className="h-5 w-5" />} 
            trend={{ value: stats.listingsTrend, positive: stats.listingsTrend > 0 }}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <LineChart title="Total Sales" data={chartData.salesData} color="#6366f1" />
          <BarChart title="Monthly Revenue" data={chartData.revenueData} color="#3d8f62" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <LineChart title="User Growth" data={chartData.userGrowthData} color="#f59e0b" />
          <BarChart title="Active Listings" data={chartData.activeListingsData} color="#f59e0b" />
        </div>

        {/* Recent transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 animate-fade-up overflow-hidden" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
                  <CardDescription>Latest animal purchases and sales</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 bg-teal-600 hover:bg-teal-700 text-white border-none"
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction, index) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors animate-fade-in" style={{ animationDelay: `${index * 100 + 300}ms` }}>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border">
                        <AvatarFallback>{transaction.buyer.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{transaction.buyer}</p>
                        <p className="text-sm text-muted-foreground">{transaction.animal}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="font-medium">Rs {transaction.amount.toLocaleString()}</p>
                      <div className="flex items-center gap-1">
                        <Badge variant={
                          transaction.status === "completed" ? "default" : 
                          transaction.status === "pending" ? "outline" : 
                          "secondary"
                        } className="text-xs py-0 h-5">
                          {transaction.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming sales */}
          <Card className="animate-fade-up h-full" style={{ animationDelay: '250ms' }}>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Upcoming Events</CardTitle>
              <CardDescription>Important dates and sales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 animate-fade-in" style={{ animationDelay: '350ms' }}>
                  <div className="bg-primary/10 rounded-md p-2 text-primary mt-1">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Eid-ul-Adha Campaign</p>
                    <p className="text-sm text-muted-foreground mb-1">Special promotions for Qurbani animals</p>
                    <Badge variant="outline" className="text-xs">12 days left</Badge>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 animate-fade-in" style={{ animationDelay: '400ms' }}>
                  <div className="bg-bakra-100 rounded-md p-2 text-bakra-600 mt-1">
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Weekend Flash Sale</p>
                    <p className="text-sm text-muted-foreground mb-1">20% off on selected animals</p>
                    <Badge variant="outline" className="text-xs">3 days left</Badge>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 animate-fade-in" style={{ animationDelay: '450ms' }}>
                  <div className="bg-orange-100 rounded-md p-2 text-orange-600 mt-1">
                    <Tag className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Bulk Purchase Offer</p>
                    <p className="text-sm text-muted-foreground mb-1">Special rates for wholesale buyers</p>
                    <Badge variant="outline" className="text-xs">Ongoing</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management Section */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <Card className="animate-fade-up" style={{ animationDelay: '300ms' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-medium">User Management</CardTitle>
                  <CardDescription>All registered buyers and sellers</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    {stats.totalBuyers} Buyers
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {stats.totalSellers} Sellers
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <UserManagementTable />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// User Management Component
const UserManagementTable = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'buyers' | 'sellers'>('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Get admin token for authenticated requests
        const token = localStorage.getItem('token');
        const sellerToken = localStorage.getItem('sellerToken'); // Check for seller token
        const buyerToken = localStorage.getItem('buyerToken'); // Check for buyer token
        
        // Create headers for different endpoints
        const createHeaders = (authToken?: string) => {
          const headers: HeadersInit = {
            'Content-Type': 'application/json',
          };
          if (authToken) {
            headers.Authorization = `Bearer ${authToken}`;
          }
          return headers;
        };

        // Fetch buyers from users endpoint
        console.log('Fetching buyers from /users...');
        let buyersData = [];
        
        // Try with different tokens for buyers
        for (const authToken of [token, buyerToken, null]) {
          if (buyersData.length > 0) break;
          
          try {
            const buyersHeaders = createHeaders(authToken);
            console.log(`Trying buyers with token: ${authToken ? 'present' : 'none'}`);
            const buyersResponse = await fetch('http://localhost:3001/users', { headers: buyersHeaders });
            if (buyersResponse.ok) {
              buyersData = await buyersResponse.json();
              console.log('Buyers data:', buyersData);
              break;
            } else {
              console.log(`Buyers endpoint failed with status: ${buyersResponse.status}`);
            }
          } catch (error) {
            console.log('Buyers endpoint error:', error);
          }
        }
        
        // Fetch sellers from multiple endpoints with different tokens
        console.log('Fetching sellers...');
        let sellersData = [];
        
        // Try auther/Seller endpoint first (requires seller authentication)
        for (const authToken of [sellerToken, token, null]) {
          if (sellersData.length > 0) break;
          
          try {
            const sellersHeaders = createHeaders(authToken);
            console.log(`Trying sellers /auther/Seller with token: ${authToken ? 'present' : 'none'}`);
            const sellersResponse = await fetch('http://localhost:3001/auther/Seller', { headers: sellersHeaders });
            if (sellersResponse.ok) {
              sellersData = await sellersResponse.json();
              console.log('Sellers data from /auther/Seller:', sellersData);
              break;
            } else {
              console.log(`Sellers /auther/Seller failed with status: ${sellersResponse.status}`);
            }
          } catch (error) {
            console.log('Sellers /auther/Seller error:', error);
          }
        }
        
        // If no sellers found, try /seller endpoint
        if (!Array.isArray(sellersData) || sellersData.length === 0) {
          for (const authToken of [sellerToken, token, null]) {
            if (sellersData.length > 0) break;
            
            try {
              const sellersHeaders = createHeaders(authToken);
              console.log(`Trying sellers /seller with token: ${authToken ? 'present' : 'none'}`);
              const sellersResponse = await fetch('http://localhost:3001/seller', { headers: sellersHeaders });
              if (sellersResponse.ok) {
                sellersData = await sellersResponse.json();
                console.log('Sellers data from /seller:', sellersData);
                break;
              } else {
                console.log(`Sellers /seller failed with status: ${sellersResponse.status}`);
              }
            } catch (error) {
              console.log('Sellers /seller error:', error);
            }
          }
        }

        // Combine and format user data
        const buyersFormatted = (Array.isArray(buyersData) ? buyersData : []).map((user: any) => ({
          id: `buyer_${user.id}`,
          name: user.name || user.username || user.firstName || user.lastName || 'Unknown',
          email: user.email || 'No email',
          type: 'Buyer',
          joinDate: user.createdAt || user.created_at || new Date().toISOString(),
          status: user.isActive !== false ? 'Active' : 'Inactive',
          phone: user.phone || user.phoneNumber || 'N/A'
        }));

        const sellersFormatted = (Array.isArray(sellersData) ? sellersData : []).map((seller: any) => ({
          id: `seller_${seller.id}`,
          name: seller.name || seller.username || seller.firstName || seller.lastName || 'Unknown',
          email: seller.email || 'No email',
          type: 'Seller',
          joinDate: seller.createdAt || seller.created_at || new Date().toISOString(),
          status: seller.isActive !== false ? 'Active' : 'Inactive',
          phone: seller.phone || seller.phoneNumber || 'N/A'
        }));

        const allUsers = [...buyersFormatted, ...sellersFormatted];

        console.log('Buyers formatted:', buyersFormatted);
        console.log('Sellers formatted:', sellersFormatted);
        console.log('Combined users data:', allUsers);
        console.log('Total users count:', allUsers.length);
        setUsers(allUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    if (filter === 'buyers') return user.type === 'Buyer';
    if (filter === 'sellers') return user.type === 'Seller';
    return true;
  });

  if (loading) {
    return <div className="text-center py-4">Loading users...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Filter buttons */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All Users ({users.length})
        </Button>
        <Button
          variant={filter === 'buyers' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('buyers')}
        >
          Buyers ({users.filter(u => u.type === 'Buyer').length})
        </Button>
        <Button
          variant={filter === 'sellers' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('sellers')}
        >
          Sellers ({users.filter(u => u.type === 'Seller').length})
        </Button>
      </div>

      {/* Users table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Email</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-left p-3 font-medium">Phone</th>
                <th className="text-left p-3 font-medium">Join Date</th>
                <th className="text-left p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id} className="border-t hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">{user.email}</td>
                  <td className="p-3">
                    <Badge variant={user.type === 'Seller' ? 'default' : 'secondary'}>
                      {user.type}
                    </Badge>
                  </td>
                  <td className="p-3 text-sm">{user.phone}</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <Badge variant={user.status === 'Active' ? 'default' : 'outline'}>
                      {user.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No {filter === 'all' ? 'users' : filter} found
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;