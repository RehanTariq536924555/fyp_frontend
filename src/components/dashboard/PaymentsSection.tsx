import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentHistory, PaymentMethod } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Check, Copy, CreditCard, Download, Edit, Plus, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { useState, useEffect } from 'react';

const PaymentsSection = () => {
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentHistoryData, setPaymentHistoryData] = useState<PaymentHistory[]>([]);
  const [accountBalance, setAccountBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch payment data from APIs
  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          // Use mock data for non-authenticated users
          setPaymentMethods([
            {
              id: 'pm1',
              type: 'bank',
              name: 'HBL Account',
              details: 'XXXX-XXXX-XXXX-1234',
              isDefault: true,
              lastUsed: '2023-12-01'
            }
          ]);
          setPaymentHistoryData([]);
          setAccountBalance(0);
          return;
        }

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        // Fetch user's orders to calculate balance and history
        const ordersResponse = await fetch('http://localhost:3001/payment', { headers });
        const ordersData = await ordersResponse.json();

        // Calculate account balance from completed orders
        const completedOrders = ordersData.filter((order: any) => order.status === 'completed');
        const totalBalance = completedOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
        setAccountBalance(totalBalance);

        // Convert orders to payment history format
        const paymentHistory: PaymentHistory[] = ordersData.map((order: any) => ({
          id: order.id,
          amount: order.total || 0,
          date: order.date || new Date().toISOString(),
          status: order.status === 'completed' ? 'completed' : order.status === 'pending' ? 'pending' : 'failed',
          method: 'Bank Transfer',
          description: `Payment for order #${order.id}`
        }));

        setPaymentHistoryData(paymentHistory);

        // Set default payment methods (mock for now - can be replaced with real payment methods API)
        setPaymentMethods([
          {
            id: 'pm1',
            type: 'bank',
            name: 'HBL Account',
            details: 'XXXX-XXXX-XXXX-1234',
            isDefault: true,
            lastUsed: new Date().toISOString().split('T')[0]
          }
        ]);

      } catch (error) {
        console.error('Error fetching payment data:', error);
        // Fallback to empty data
        setPaymentMethods([]);
        setPaymentHistoryData([]);
        setAccountBalance(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, []);
  
  const handleCopyAccountNumber = () => {
    navigator.clipboard.writeText('XXXX-XXXX-XXXX-1234');
    toast({
      title: "Account number copied",
      description: "Account number has been copied to clipboard."
    });
  };
  
  const handleDeletePaymentMethod = (id: string) => {
    toast({
      title: "Payment method deleted",
      description: "The payment method has been removed."
    });
  };
  
  const handleSetDefault = (id: string) => {
    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been updated."
    });
  };
  
  const handleAddPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddPaymentMethod(false);
    toast({
      title: "Payment method added",
      description: "Your new payment method has been saved."
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">
            Manage your payment methods and transaction history
          </p>
        </div>
      \
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account Balance</CardTitle>
            <CardDescription>
              Your current balance and payment information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-6 border rounded-lg bg-primary/5">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <h2 className="text-4xl font-bold mt-1">
                {loading ? 'Loading...' : `PKR ${accountBalance.toLocaleString()}`}
              </h2>
              <Button className="mt-4 bg-teal-600 hover:bg-teal-700 text-white">
                Withdraw Funds
              </Button>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline">Transaction History</Button>
                <Button variant="outline">Invoices</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Schedule</CardTitle>
            <CardDescription>
              Your upcoming payments and withdrawals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Next Payout</p>
                  <p className="text-muted-foreground text-sm">
                    {new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </p>
                </div>
                <p className="font-bold">PKR {Math.floor(accountBalance * 0.3).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Payout Schedule</h3>
              <div className="flex gap-2">
                <Badge>Monthly</Badge>
                <Badge variant="outline">15th of each month</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                You can change your payout schedule in settings
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="methods" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="methods" className="mt-6 space-y-4">
          {showAddPaymentMethod ? (
            <Card>
              <CardHeader>
                <CardTitle>Add Payment Method</CardTitle>
                <CardDescription>
                  Add a new payment method to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddPaymentMethod} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="method-type">Payment Method Type</Label>
                    <select 
                      id="method-type" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="bank">Bank Account</option>
                      <option value="card">Credit/Debit Card</option>
                      <option value="wallet">Digital Wallet</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="method-name">Name</Label>
                    <Input id="method-name" placeholder="e.g. My Bank Account" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="account-number">Account Number</Label>
                    <Input id="account-number" placeholder="Enter your account number" />
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="bank-name">Bank Name</Label>
                      <Input id="bank-name" placeholder="Enter bank name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="branch-code">Branch Code</Label>
                      <Input id="branch-code" placeholder="Enter branch code" />
                    </div>
                  </div>
                  
                  <div className="pt-2 flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowAddPaymentMethod(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      Save Payment Method
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <>
              {paymentMethods.map((method) => (
                <Card key={method.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          <CreditCard className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{method.name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <p>{method.details}</p>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 ml-1"
                              onClick={handleCopyAccountNumber}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center mt-1 space-x-2">
                            {method.isDefault && (
                              <Badge variant="secondary" className="text-xs">
                                Default
                              </Badge>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Last used: {new Date(method.lastUsed || '').toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {!method.isDefault && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSetDefault(method.id)}
                          >
                            Set Default
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => {}}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleDeletePaymentMethod(method.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                View your recent transactions and payment history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentHistoryData.map((transaction) => {
                  const statusColors = {
                    completed: 'text-teal-600 bg-teal-50',
                    pending: 'text-amber-600 bg-amber-50',
                    failed: 'text-red-600 bg-red-50',
                  };
                  
                  return (
                    <div 
                      key={transaction.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border p-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{transaction.description}</h3>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "capitalize font-normal",
                              statusColors[transaction.status]
                            )}
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted-foreground">
                          <span>ID: #{transaction.id}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{new Date(transaction.date).toLocaleDateString()}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{transaction.method}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-lg font-semibold">
                          {new Intl.NumberFormat('en-PK', { 
                            style: 'currency',
                            currency: 'PKR',
                            maximumFractionDigits: 0
                          }).format(transaction.amount)}
                        </div>
                        
                        <Button size="icon" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 flex justify-center">
                <Button variant="outline">Load More Transactions</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default PaymentsSection;