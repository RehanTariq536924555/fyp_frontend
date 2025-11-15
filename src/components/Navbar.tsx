import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, Mail, Lock, User, ArrowLeft, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import axios from 'axios';
import Cart from './Cart';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from './context/WishlistContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginView, setLoginView] = useState<'signin' | 'signup' | 'forget' | 'notfound'>('signin');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: 'http://localhost:3001/auth',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  const SignInForm = ({ setLoginView }: { setLoginView: (view: 'signin' | 'signup' | 'forget' | 'notfound') => void }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<{ text: string; type: string } | null>(null);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validateForm = () => {
      const newErrors: { email?: string; password?: string } = {};
      const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|aol\.com)$/;
      
      if (!email) {
        newErrors.email = 'Email is required';
      } else if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address (supported domains: gmail.com, yahoo.com, hotmail.com, outlook.com, aol.com)';
      }

      if (!password) {
        newErrors.password = 'Password is required';
      } else if (password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSignIn = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      try {
        const response = await api.post('/login', { email, password });
        console.log('Sign In 000000:', response);
        localStorage.setItem('token', response.data.access_token);
        setIsAuthenticated(true);
        setMessage({ text: 'Sign In successful! Welcome back.', type: 'success' });
        setTimeout(() => setIsLoginOpen(false), 2000);
      } catch (err: any) {
        setMessage({ text: err.response?.data?.message || 'Sign In failed. Please check your credentials.', type: 'error' });
      }
    };

    return (
      <div className="space-y-6 p-8 bg-white rounded-2xl shadow-lg animate-fade-in border border-teal-100">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-gray-800">Sign In</DialogTitle>
          <p className="text-center mt-2 text-gray-500 text-sm">Welcome back to BakraMandi360</p>
        </DialogHeader>
        {message && (
          <div className={cn(
            "p-3 rounded-lg text-center text-sm font-medium",
            message.type === 'success' ? 'bg-teal-100 text-teal-600' : 'bg-teal-100 text-teal-400'
          )}>
            {message.text}
          </div>
        )}
        <form className="space-y-5" onSubmit={handleSignIn}>
          <div className="relative">
            <Mail className={cn(
              "absolute top-1/2 transform -translate-y-1/2 text-teal-600 transition-all duration-200",
              email.length > 0 ? "right-3" : "left-3"
            )} size={20} />
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className={cn(
                "w-full py-3 border rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200",
                email.length > 0 ? "pr-10 pl-4" : "pl-10 pr-4",
                errors.email && "border-teal-400"
              )} 
              placeholder="Email" 
            />
            {errors.email && <p className="text-teal-400 text-xs mt-1 animate-pulse">{errors.email}</p>}
          </div>
          <div className="relative">
            <Lock className={cn(
              "absolute top-1/2 transform -translate-y-1/2 text-teal-600 transition-all duration-200",
              password.length > 0 ? "right-3" : "left-3"
            )} size={20} />
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className={cn(
                "w-full py-3 border rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200",
                password.length > 0 ? "pr-10 pl-4" : "pl-10 pr-4",
                errors.password && "border-teal-400"
              )} 
              placeholder="Password" 
            />
            {errors.password && <p className="text-teal-400 text-xs mt-1 animate-pulse">{errors.password}</p>}
          </div>
          <Button 
            type="submit" 
            className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 hover:scale-105 transition-all duration-200 font-semibold"
          >
            Sign In
          </Button>
        </form>
        <div className="flex justify-between text-sm text-gray-500">
          <button onClick={() => setLoginView('signup')} className="hover:text-teal-600 transition-colors duration-200">Create Account</button>
          <button onClick={() => setLoginView('forget')} className="hover:text-teal-600 transition-colors duration-200">Forgot Password?</button>
        </div>
      </div>
    );
  };

  const SignUpForm = ({ setLoginView }: { setLoginView: (view: 'signin' | 'signup' | 'forget' | 'notfound') => void }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<{ text: string; type: string } | null>(null);
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

    const validateForm = () => {
      const newErrors: { name?: string; email?: string; password?: string } = {};
      const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|aol\.com)$/;
      const nameRegex = /^[a-zA-Z\s]{2,}$/;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!name) {
        newErrors.name = 'Name is required';
      } else if (!nameRegex.test(name)) {
        newErrors.name = 'Name must be at least 2 characters and contain only letters';
      }

      if (!email) {
        newErrors.email = 'Email is required';
      } else if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address (supported domains: gmail.com, yahoo.com, hotmail.com, outlook.com, aol.com)';
      }

      if (!password) {
        newErrors.password = 'Password is required';
      } else if (!passwordRegex.test(password)) {
        newErrors.password = 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSignUp = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      try {
        await api.post('/register', { name, email, password });
        setMessage({ text: 'Sign Up successful! Please sign in to continue.', type: 'success' });
        setTimeout(() => setLoginView('signin'), 2000);
      } catch (err: any) {
        setMessage({ text: err.response?.data?.message || 'Sign Up failed. Please try again.', type: 'error' });
      }
    };

    return (
      <div className="space-y-6 p-8 bg-white rounded-2xl shadow-lg animate-fade-in border border-teal-100">
        <DialogHeader>
          <button onClick={() => setLoginView('signin')} className="absolute left-4 top-4 text-gray-500 hover:text-teal-600 transition-colors duration-200">
            <ArrowLeft size={20} />
          </button>
          <DialogTitle className="text-3xl font-bold text-center text-gray-800">Sign Up</DialogTitle>
          <p className="text-center mt-2 text-gray-500 text-sm">Join BakraMandi360 today</p>
        </DialogHeader>
        {message && (
          <div className={cn(
            "p-3 rounded-lg text-center text-sm font-medium",
            message.type === 'success' ? 'bg-teal-100 text-teal-600' : 'bg-teal-100 text-teal-400'
          )}>
            {message.text}
          </div>
        )}
        <form className="space-y-5" onSubmit={handleSignUp}>
          <div className="relative">
            <User className={cn(
              "absolute top-1/2 transform -translate-y-1/2 text-teal-600 transition-all duration-200",
              name.length > 0 ? "right-3" : "left-3"
            )} size={20} />
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className={cn(
                "w-full py-3 border rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200",
                name.length > 0 ? "pr-10 pl-4" : "pl-10 pr-4",
                errors.name && "border-teal-400"
              )} 
              placeholder="Full Name" 
            />
            {errors.name && <p className="text-teal-400 text-xs mt-1 animate-pulse">{errors.name}</p>}
          </div>
          <div className="relative">
            <Mail className={cn(
              "absolute top-1/2 transform -translate-y-1/2 text-teal-600 transition-all duration-200",
              email.length > 0 ? "right-3" : "left-3"
            )} size={20} />
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className={cn(
                "w-full py-3 border rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200",
                email.length > 0 ? "pr-10 pl-4" : "pl-10 pr-4",
                errors.email && "border-teal-400"
              )} 
              placeholder="Email" 
            />
            {errors.email && <p className="text-teal-400 text-xs mt-1 animate-pulse">{errors.email}</p>}
          </div>
          <div className="relative">
            <Lock className={cn(
              "absolute top-1/2 transform -translate-y-1/2 text-teal-600 transition-all duration-200",
              password.length > 0 ? "right-3" : "left-3"
            )} size={20} />
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className={cn(
                "w-full py-3 border rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200",
                password.length > 0 ? "pr-10 pl-4" : "pl-10 pr-4",
                errors.password && "border-teal-400"
              )} 
              placeholder="Password" 
            />
            {errors.password && <p className="text-teal-400 text-xs mt-1 animate-pulse">{errors.password}</p>}
          </div>
          <Button 
            type="submit" 
            className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 hover:scale-105 transition-all duration-200 font-semibold"
          >
            Sign Up
          </Button>
        </form>
      </div>
    );
  };

  const ForgetPasswordForm = ({ setLoginView }: { setLoginView: (view: 'signin' | 'signup' | 'forget' | 'notfound') => void }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<{ text: string; type: string } | null>(null);
    const [errors, setErrors] = useState<{ email?: string }>({});

    const validateForm = () => {
      const newErrors: { email?: string } = {};
      const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|aol\.com)$/;

      if (!email) {
        newErrors.email = 'Email is required';
      } else if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address (supported domains: gmail.com, yahoo.com, hotmail.com, outlook.com, aol.com)';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleForgetPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      try {
        const response = await api.post('/forgot-password', { email });
        setMessage({ text: `Reset link sent successfully to ${email}! Check your email.`, type: 'success' });
        setTimeout(() => setLoginView('signin'), 3000);
      } catch (err: any) {
        setMessage({ text: err.response?.data?.message || 'Failed to send reset link. Please try again.', type: 'error' });
      }
    };

    return (
      <div className="space-y-6 p-8 bg-white rounded-2xl shadow-lg animate-fade-in border border-teal-100">
        <DialogHeader>
          <button onClick={() => setLoginView('signin')} className="absolute left-4 top-4 text-gray-500 hover:text-teal-600 transition-colors duration-200">
            <ArrowLeft size={20} />
          </button>
          <DialogTitle className="text-3xl font-bold text-center text-gray-800">Forgot Password</DialogTitle>
          <p className="text-center mt-2 text-gray-500 text-sm">Reset your password</p>
        </DialogHeader>
        {message && (
          <div className={cn(
            "p-3 rounded-lg text-center text-sm font-medium",
            message.type === 'success' ? 'bg-teal-100 text-teal-600' : 'bg-teal-100 text-teal-400'
          )}>
            {message.text}
          </div>
        )}
        <form className="space-y-5" onSubmit={handleForgetPassword}>
          <div className="relative">
            <Mail className={cn(
              "absolute top-1/2 transform -translate-y-1/2 text-teal-600 transition-all duration-200",
              email.length > 0 ? "right-3" : "left-3"
            )} size={20} />
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className={cn(
                "w-full py-3 border rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200",
                email.length > 0 ? "pr-10 pl-4" : "pl-10 pr-4",
                errors.email && "border-teal-400"
              )} 
              placeholder="Email" 
            />
            {errors.email && <p className="text-teal-400 text-xs mt-1 animate-pulse">{errors.email}</p>}
          </div>
          <Button 
            type="submit" 
            className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 hover:scale-105 transition-all duration-200 font-semibold"
          >
            Send Reset Link
          </Button>
        </form>
      </div>
    );
  };

  const NotFoundForm = ({ setLoginView }: { setLoginView: (view: 'signin' | 'signup' | 'forget' | 'notfound') => void }) => {
    return (
      <div className="space-y-6 p-8 bg-white rounded-2xl shadow-lg animate-fade-in border border-teal-100">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-gray-800">404 - Oops! Page not found</DialogTitle>
          <p className="text-center mt-2 text-gray-500 text-sm">The reset link is invalid or expired.</p>
        </DialogHeader>
        <div className="text-center space-y-4">
          <Button 
            onClick={() => { setLoginView('forget'); navigate('/'); }} 
            className="bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 hover:scale-105 transition-all duration-200 font-semibold"
          >
            Request a New Link
          </Button>
          <div>
            <button 
              onClick={() => { setLoginView('signin'); navigate('/'); }} 
              className="text-sm text-gray-500 hover:text-teal-600 transition-colors duration-200"
            >
              Return to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-teal-600", 
          isScrolled 
            ? "bg-teal-600/90 backdrop-blur-md shadow-sm py-3"
            : "bg-teal-600 py-5"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <h1 className="text-xl font-medium transition-all duration-300 text-white">
                <span className="font-bold">BakraMandi</span>360
              </h1>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-sm font-medium text-white hover:bg-teal-700 transition-colors px-2 py-1 rounded">Home</Link>
              <Link to="/animals" className="text-sm font-medium text-white hover:bg-teal-700 transition-colors px-2 py-1 rounded">All Animals</Link>
              <Link to="/qurbani" className="text-sm font-medium text-white hover:bg-teal-700 transition-colors px-2 py-1 rounded">Qurbani Special</Link>
              <Link to="/orders" className="text-sm font-medium text-white hover:bg-teal-700 transition-colors px-2 py-1 rounded">Order</Link>
              {isAuthenticated ? (
                <Button onClick={handleLogout} className="text-white bg-transparent hover:bg-teal-700">Logout</Button>
              ) : (
                <Link 
                  to="#" 
                  onClick={(e) => { e.preventDefault(); setIsLoginOpen(true); }} 
                  className="text-sm font-medium text-white hover:bg-teal-700 transition-colors px-2 py-1 rounded"
                >
                  Login
                </Link>
              )}
            </nav>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" aria-label="Search" className="relative text-white hover:bg-teal-700" asChild>
                <Link to="/animals">
                  <Search className="h-5 w-5" />
                </Link>
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                aria-label="Wishlist"
                className="relative text-white hover:bg-teal-700"
                onClick={() => navigate('/wishlist')}
                disabled={!isAuthenticated}
                title={isAuthenticated ? "View Wishlist" : "Please sign in to view wishlist"}
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && isAuthenticated && (
                  <span className="absolute -top-1 -right-1 bg-white text-teal-600 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                aria-label="Cart"
                className="relative text-white hover:bg-teal-700"
                onClick={() => setIsCartOpen(!isCartOpen)}
                disabled={!isAuthenticated}
                title={isAuthenticated ? "View Cart" : "Please sign in to view cart"}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && isAuthenticated && (
                  <span className="absolute -top-1 -right-1 bg-white text-teal-600 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden text-white hover:bg-teal-700"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div 
        className={cn(
          "fixed inset-0 bg-teal-600 z-40 pt-20 px-4 md:hidden transition-transform duration-300",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="flex flex-col space-y-6 py-8">
          <Link to="/" className="text-lg font-medium text-white hover:bg-teal-700 transition-colors px-2 py-1 rounded" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/animals" className="text-lg font-medium text-white hover:bg-teal-700 transition-colors px-2 py-1 rounded" onClick={() => setIsMobileMenuOpen(false)}>All Animals</Link>
          <Link to="/qurbani" className="text-lg font-medium text-white hover:bg-teal-700 transition-colors px-2 py-1 rounded" onClick={() => setIsMobileMenuOpen(false)}>Qurbani Special</Link>
          {isAuthenticated && (
            <Link to="/wishlist" className="text-lg font-medium text-white hover:bg-teal-700 transition-colors px-2 py-1 rounded" onClick={() => setIsMobileMenuOpen(false)}>Wishlist ({wishlistCount})</Link>
          )}
          {isAuthenticated ? (
            <Button 
              onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} 
              className="text-white bg-transparent hover:bg-teal-700 w-fit"
            >
              Logout
            </Button>
          ) : (
            <Link 
              to="#" 
              className="text-lg font-medium text-white hover:bg-teal-700 transition-colors px-2 py-1 rounded" 
              onClick={(e) => {e.preventDefault(); setIsLoginOpen(true); setIsMobileMenuOpen(false); }}
            >
              Login
            </Link>
          )}
        </nav>
      </div>

      {isCartOpen && <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}
      {isLoginOpen && (
        <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
          <DialogContent className="sm:max-w-[450px] p-0 bg-gradient-to-br from-teal-50 to-teal-100 border-none">
            {loginView === 'signin' && <SignInForm setLoginView={setLoginView} />}
            {loginView === 'signup' && <SignUpForm setLoginView={setLoginView} />}
            {loginView === 'forget' && <ForgetPasswordForm setLoginView={setLoginView} />}
            {loginView === 'notfound' && <NotFoundForm setLoginView={setLoginView} />}
          </DialogContent>
        </Dialog>
      )}
      <div>{/* Main content goes here */}</div>
    </>
  );
};

export default Navbar;