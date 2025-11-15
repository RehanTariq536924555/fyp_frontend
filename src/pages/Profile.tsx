import { useState, useEffect } from "react";
import { User, Search, MoreVertical, CheckCircle, XCircle, Trash2, Edit } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const Profile = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all-users");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch users from APIs
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Get admin token for authenticated requests
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        // Fetch buyers
        console.log('Fetching buyers...');
        const buyerResponse = await fetch("http://localhost:3001/users", { headers });
        const buyersData = await buyerResponse.json();
        console.log('Buyers data:', buyersData);
        
        // Fetch sellers (try multiple endpoints)
        let sellersData = [];
        
        // Try the seller endpoint first
        try {
          console.log('Fetching sellers from /seller...');
          const sellerResponse = await fetch("http://localhost:3001/seller", { headers });
          if (sellerResponse.ok) {
            sellersData = await sellerResponse.json();
            console.log('Sellers data from /seller:', sellersData);
          }
        } catch (error) {
          console.log('Seller endpoint /seller failed:', error);
        }
        
        // If no sellers found, try the auther endpoint
        if (sellersData.length === 0) {
          try {
            console.log('Fetching sellers from /auther/Seller...');
            const sellerResponse = await fetch("http://localhost:3001/auther/Seller", { headers });
            if (sellerResponse.ok) {
              sellersData = await sellerResponse.json();
              console.log('Sellers data from /auther/Seller:', sellersData);
            }
          } catch (error) {
            console.log('Seller endpoint /auther/Seller failed:', error);
          }
        }

        // Format buyers data
        const buyersWithRole = (Array.isArray(buyersData) ? buyersData : []).map((user: any) => ({ 
          id: user.id,
          name: user.name || user.username || user.firstName || user.lastName || 'Unknown',
          email: user.email || 'No email',
          status: user.isActive !== false ? 'Active' : 'Inactive',
          role: "Buyer" 
        }));

        // Format sellers data
        const sellersWithRole = (Array.isArray(sellersData) ? sellersData : []).map((user: any) => ({ 
          id: user.id,
          name: user.name || user.username || user.firstName || user.lastName || 'Unknown',
          email: user.email || 'No email',
          status: user.isActive !== false ? 'Active' : 'Inactive',
          role: "Seller" 
        }));

        // Add admin user (from localStorage if logged in as admin)
        const adminUsers: User[] = [];
        const isAdmin = localStorage.getItem('isAdmin');
        const adminName = localStorage.getItem('adminName');
        if (isAdmin === 'true') {
          adminUsers.push({
            id: 0, 
            name: adminName || "System Administrator", 
            email: "admin@example.com", 
            role: "Admin", 
            status: "Active"
          });
        }

        const allUsers = [...sellersWithRole, ...buyersWithRole, ...adminUsers];
        console.log('Combined users data:', allUsers);
        setUsers(allUsers);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch users. Please try again later.",
          variant: "destructive",
        });
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteUser = async () => {
    if (selectedUser) {
      try {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        // Determine the correct endpoint based on user role
        let deleteEndpoint = '';
        if (selectedUser.role === 'Buyer') {
          deleteEndpoint = `http://localhost:3001/users/${selectedUser.id}`;
        } else if (selectedUser.role === 'Seller') {
          deleteEndpoint = `http://localhost:3001/seller/${selectedUser.id}`;
        }

        if (deleteEndpoint && selectedUser.role !== 'Admin') {
          const response = await fetch(deleteEndpoint, {
            method: 'DELETE',
            headers
          });

          if (!response.ok) {
            throw new Error('Failed to delete user from server');
          }
        }

        // Update local state
        setUsers(users.filter(user => user.id !== selectedUser.id));
        
        toast({
          title: "User deleted",
          description: `${selectedUser.name} has been removed from the system.`,
        });
        
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user. Please try again.",
          variant: "destructive",
        });
        console.error("Error deleting user:", error);
      } finally {
        setIsDeleteDialogOpen(false);
        setSelectedUser(null);
      }
    }
  };
  
  const handleActivateUser = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: "Active" } : user
    ));
    
    toast({
      title: "User activated",
      description: "User status has been set to Active.",
    });
  };
  
  const handleDeactivateUser = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: "Inactive" } : user
    ));
    
    toast({
      title: "User deactivated",
      description: "User status has been set to Inactive.",
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="py-6 px-8 flex items-center justify-between border-b bg-card/50 sticky top-0 z-10 backdrop-blur">
        <div className="flex items-center gap-2">
          <User className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold">User Management</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-md border border-input bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="text-center">Loading users...</div>
        ) : (
          <Tabs defaultValue="all-users" onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all-users">All Users</TabsTrigger>
              <TabsTrigger value="sellers">Sellers</TabsTrigger>
              <TabsTrigger value="buyers">Buyers</TabsTrigger>
              <TabsTrigger value="admins">Admins</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all-users" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className={`mr-2 rounded-full w-2 h-2 ${
                              user.status === "Active" ? "bg-green-500" : 
                              user.status === "Inactive" ? "bg-red-500" : "bg-yellow-500"
                            }`}></span>
                            {user.status}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleActivateUser(user.id)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Activate
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeactivateUser(user.id)}>
                                <XCircle className="h-4 w-4 mr-2" />
                                Deactivate
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteUser(user)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="sellers" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.filter(user => user.role === "Seller").map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className={`mr-2 rounded-full w-2 h-2 ${
                              user.status === "Active" ? "bg-green-500" : 
                              user.status === "Inactive" ? "bg-red-500" : "bg-yellow-500"
                            }`}></span>
                            {user.status}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleActivateUser(user.id)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Activate
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeactivateUser(user.id)}>
                                <XCircle className="h-4 w-4 mr-2" />
                                Deactivate
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteUser(user)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="buyers" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.filter(user => user.role === "Buyer").map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className={`mr-2 rounded-full w-2 h-2 ${
                              user.status === "Active" ? "bg-green-500" : 
                              user.status === "Inactive" ? "bg-red-500" : "bg-yellow-500"
                            }`}></span>
                            {user.status}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleActivateUser(user.id)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Activate
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeactivateUser(user.id)}>
                                <XCircle className="h-4 w-4 mr-2" />
                                Deactivate
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteUser(user)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="admins" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.filter(user => user.role === "Admin").map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className={`mr-2 rounded-full w-2 h-2 ${
                              user.status === "Active" ? "bg-green-500" : 
                              user.status === "Inactive" ? "bg-red-500" : "bg-yellow-500"
                            }`}></span>
                            {user.status}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleActivateUser(user.id)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Activate
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeactivateUser(user.id)}>
                                <XCircle className="h-4 w-4 mr-2" />
                                Deactivate
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteUser(user)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
      
      {/* Delete User Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;