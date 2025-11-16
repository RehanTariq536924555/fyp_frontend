import { User, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar1 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the current route is a seller route
  const isSellerRoute = location.pathname.includes('/seller');

  return (
    <header className="top-0 z-30 flex h-16 w-full items-center justify-between bg-teal-600 px-6 shadow-lg mb-0">
      {/* Left Section - Logo or Company Name */}
      <div className="flex items-center gap-4 ml-[30px]">
        <h1
          className="text-white text-2xl font-bold tracking-tight cursor-pointer hover:text-white/90 transition-colors"
          onClick={() => navigate('/')}
        >
          BakraMandi360
        </h1>
      </div>

      {/* Right Section - Navigation and User */}
      <div className="flex items-center gap-4">
        {!isSellerRoute && (
          <Button
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-teal-700 rounded-full px-4"
            onClick={() => navigate('/animals')}
          >
            Buy Animals
          </Button>
        )}

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 border-2 border-white/30 hover:border-white transition-all"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatar-placeholder.png" alt="User" />
                <AvatarFallback className="bg-white/20 text-white">U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl rounded-lg mt-2"
          >
            <DropdownMenuItem
              onClick={() => {
                // Clear all localStorage data
                localStorage.removeItem('token');
                localStorage.removeItem('sellerId');
                localStorage.removeItem('sellerName');
                localStorage.removeItem('userId');
                localStorage.removeItem('userName');
                localStorage.clear(); // Clear all localStorage items
                
                // Navigate to home page
                navigate('/');
              }}
              className="flex items-center gap-2 px-3 py-2 hover:bg-teal-50 cursor-pointer"
            >
              <LogOut className="h-4 w-4 text-teal-600" />
              <span className="text-teal-800">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar1;
