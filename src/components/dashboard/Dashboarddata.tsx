import { useEffect, useState } from "react";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from "recharts";
import { motion } from "framer-motion";

interface ChartData {
  month: string;
  sales?: number;
  revenue?: number;
  users?: number;
  listings?: number;
}

const GraphicalStatistics = () => {
  const [stats, setStats] = useState({
    salesData: [] as ChartData[],
    revenueData: [] as ChartData[],
    userGrowth: [] as ChartData[],
    activeListings: [] as ChartData[],
  });
  const [loading, setLoading] = useState(true);

  // Fetch real data from APIs
  const fetchStatistics = async () => {
    try {
      setLoading(true);
      
      // Get user ID from token for seller-specific data
      const token = localStorage.getItem('token');
      let userId = null;
      
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.userId || payload.id;
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }

      // Fetch orders (all for admin, user-specific for sellers)
      const ordersUrl = userId 
        ? `http://localhost:3001/payment` 
        : `http://localhost:3001/payment/admin/all`;
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const ordersResponse = await fetch(ordersUrl, { headers });
      const ordersData = await ordersResponse.json();
      
      // Fetch listings
      const listingsResponse = await fetch('http://localhost:3001/listings');
      const listingsData = await listingsResponse.json();
      
      // Process data by month
      const monthlyData: { [key: string]: { sales: number; revenue: number; listings: number } } = {};
      
      // Process orders data
      ordersData.forEach((order: any) => {
        const month = new Date(order.date || Date.now()).toLocaleDateString('en-US', { month: 'short' });
        if (!monthlyData[month]) {
          monthlyData[month] = { sales: 0, revenue: 0, listings: 0 };
        }
        monthlyData[month].sales += 1;
        monthlyData[month].revenue += order.total || 0;
      });

      // Process listings data
      listingsData.forEach((listing: any) => {
        const month = new Date(listing.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short' });
        if (!monthlyData[month]) {
          monthlyData[month] = { sales: 0, revenue: 0, listings: 0 };
        }
        monthlyData[month].listings += 1;
      });

      // Convert to chart format
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      const last4Months = months.slice(Math.max(0, currentMonth - 3), currentMonth + 1);

      const salesData = last4Months.map(month => ({
        month,
        sales: monthlyData[month]?.sales || 0,
      }));

      const revenueData = last4Months.map(month => ({
        month,
        revenue: monthlyData[month]?.revenue || 0,
      }));

      const activeListings = last4Months.map(month => ({
        month,
        listings: monthlyData[month]?.listings || 0,
      }));

      // Mock user growth data (can be replaced with real user API)
      const userGrowth = last4Months.map((month, index) => ({
        month,
        users: 200 + (index * 150) + Math.floor(Math.random() * 100),
      }));

      setStats({
        salesData,
        revenueData,
        userGrowth,
        activeListings,
      });
      
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Fallback to empty data
      setStats({
        salesData: [],
        revenueData: [],
        userGrowth: [],
        activeListings: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-teal-800 mb-8 text-center tracking-tight">
        Business Analytics Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Total Sales Graph */}
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-lg border border-teal-100 hover:shadow-xl transition-shadow"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="text-xl font-semibold text-teal-700 mb-4 flex items-center">
            <span className="h-2 w-2 bg-teal-500 rounded-full mr-2"></span>
            Total Sales
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="month" 
                stroke="#666" 
                fontSize={14} 
                tickLine={false}
              />
              <YAxis stroke="#666" fontSize={14} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.9)", 
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={{ r: 5, fill: "#10b981" }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly Revenue Graph */}
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-lg border border-teal-100 hover:shadow-xl transition-shadow"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="text-xl font-semibold text-teal-700 mb-4 flex items-center">
            <span className="h-2 w-2 bg-coral-500 rounded-full mr-2"></span>
            Monthly Revenue
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="month" 
                stroke="#666" 
                fontSize={14} 
                tickLine={false}
              />
              <YAxis stroke="#666" fontSize={14} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.9)", 
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              />
              <Bar 
                dataKey="revenue" 
                fill="#f97316" 
                radius={[4, 4, 0, 0]} 
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* User Growth Graph */}
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-lg border border-teal-100 hover:shadow-xl transition-shadow"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="text-xl font-semibold text-teal-700 mb-4 flex items-center">
            <span className="h-2 w-2 bg-amber-500 rounded-full mr-2"></span>
            User Growth
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="month" 
                stroke="#666" 
                fontSize={14} 
                tickLine={false}
              />
              <YAxis stroke="#666" fontSize={14} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.9)", 
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#fbbf24" 
                strokeWidth={3} 
                dot={{ r: 5, fill: "#fbbf24" }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Active Listings Graph */}
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-lg border border-teal-100 hover:shadow-xl transition-shadow"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="text-xl font-semibold text-teal-700 mb-4 flex items-center">
            <span className="h-2 w-2 bg-indigo-500 rounded-full mr-2"></span>
            Active Listings
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.activeListings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="month" 
                stroke="#666" 
                fontSize={14} 
                tickLine={false}
              />
              <YAxis stroke="#666" fontSize={14} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.9)", 
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              />
              <Bar 
                dataKey="listings" 
                fill="#6366f1" 
                radius={[4, 4, 0, 0]} 
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default GraphicalStatistics;