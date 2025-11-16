import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";
import { cn } from "@/lib/utils";

const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?ixlib=rb-4.0.3",
    title: "Healthy Livestock for Sale",
    subtitle: "Find the best breeds with trusted sellers worldwide.",
  },
  {
    url: "https://images.unsplash.com/photo-1598113972215-96c018fb1a0b?ixlib=rb-4.0.3",
    title: "Sindhi Camel",
    subtitle: "High-quality dairy and meat breeds.",
  },
  {
    url: "https://images.pexels.com/photos/847393/pexels-photo-847393.jpeg?auto=compress&cs=tinysrgb&w=2000&h=600",
    title: "Goat Trading",
    subtitle: "Healthy goats for farming or sacrifice.",
  },
];

const Hero: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginView, setLoginView] = useState<'signin' | 'signup' | 'notfound'>('signin');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: 'http://localhost:3001/auther',
  });

  const token = localStorage.getItem('token');
  if (token) {
    let isMounted = true;
    api
      .get('/verify-token', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        if (isMounted) setIsAuthenticated(true);
      })
      .catch(() => {
        if (isMounted) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      });
    isMounted = false;
  }

  const handleSellAnimalsClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setIsLoginOpen(true);
      setLoginView('signin');
    }
  };

  const SignInForm = ({
    setLoginView,
    setIsLoginOpen,
    setIsAuthenticated,
  }: {
    setLoginView: (view: 'signin' | 'signup' | 'notfound') => void;
    setIsLoginOpen: (open: boolean) => void;
    setIsAuthenticated: (auth: boolean) => void;
  }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<{ text: string; type: string } | null>(null);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
      const newErrors: { email?: string; password?: string } = {};
      const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|aol\.com)$/;

      if (!email) newErrors.email = 'Email is required';
      else if (!emailRegex.test(email))
        newErrors.email = 'Please enter a valid email address (supported domains: gmail.com, yahoo.com, hotmail.com, outlook.com, aol.com)';

      if (!password) newErrors.password = 'Password is required';
      else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters long';

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSignIn = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      setIsSubmitting(true);
      try {
        const response = await api.post('/login', { email, password });
        console.log('Sign In response:', response);
        localStorage.setItem('token', response.data.access_token);
        setIsAuthenticated(true);
        setMessage({ text: 'Sign In successful! Welcome back.', type: 'success' });
        setEmail('');
        setPassword('');
        setErrors({});
        const navigateTimer = setTimeout(() => {
          setIsLoginOpen(false);
          navigate('/dashboard/Seller');
        }, 2000);
        return () => clearTimeout(navigateTimer);
      } catch (err: any) {
        setMessage({ text: err.response?.data?.message || 'Sign In failed. Please check your credentials.', type: 'error' });
        setIsSubmitting(false);
      }
    };

    
    return (
      <div className="space-y-6 p-8 bg-white rounded-2xl shadow-lg border border-teal-100">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-gray-800">Sign In</DialogTitle>
          <p className="text-center mt-2 text-gray-500 text-sm">Welcome back to BakraMandi360</p>
        </DialogHeader>
        {message && (
          <div
            className={cn(
              'p-3 rounded-lg text-center text-sm font-medium',
              message.type === 'success' ? 'bg-teal-100 text-teal-600' : 'bg-teal-100 text-teal-400'
            )}
          >
            {message.text}
          </div>
        )}
        <form className="space-y-5" onSubmit={handleSignIn}>
          <div className="relative">
            <Mail
              className={cn(
                'absolute top-1/2 transform -translate-y-1/2 text-teal-600 transition-all duration-200',
                email.length > 0 ? 'right-3' : 'left-3'
              )}
              size={20}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                'w-full py-3 border rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200',
                email.length > 0 ? 'pr-10 pl-4' : 'pl-10 pr-4',
                errors.email && 'border-teal-400'
              )}
              placeholder="Email"
            />
            {errors.email && <p className="text-teal-400 text-xs mt-1 animate-pulse">{errors.email}</p>}
          </div>
          <div className="relative">
            <Lock
              className={cn(
                'absolute top-1/2 transform -translate-y-1/2 text-teal-600 transition-all duration-200',
                password.length > 0 ? 'right-3' : 'left-3'
              )}
              size={20}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                'w-full py-3 border rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200',
                password.length > 0 ? 'pr-10 pl-4' : 'pl-10 pr-4',
                errors.password && 'border-teal-400'
              )}
              placeholder="Password"
            />
            {errors.password && <p className="text-teal-400 text-xs mt-1 animate-pulse">{errors.password}</p>}
          </div>
          <div className="flex gap-4">
            <Button
              type="submit"
              className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 hover:scale-105 transition-all duration-200 font-semibold"
            >
              Sign In
            </Button>
          </div>
        </form>
        <div className="text-center text-sm text-gray-500">
          <button onClick={() => setLoginView('signup')} className="hover:text-teal-600 transition-colors duration-200">
            Create Account
          </button>
        </div>
      </div>
    );
  };

  const SignUpForm = ({
    setLoginView,
    setIsLoginOpen,
  }: {
    setLoginView: (view: 'signin' | 'signup' | 'notfound') => void;
    setIsLoginOpen: (open: boolean) => void;
  }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<{ text: string; type: string } | null>(null);
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
      const newErrors: { name?: string; email?: string; password?: string } = {};
      const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|aol\.com)$/;
      const nameRegex = /^[a-zA-Z\s]{2,}$/;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!name) newErrors.name = 'Name is required';
      else if (!nameRegex.test(name)) newErrors.name = 'Name must be at least 2 characters and contain only letters';

      if (!email) newErrors.email = 'Email is required';
      else if (!emailRegex.test(email))
        newErrors.email = 'Please enter a valid email address (supported domains: gmail.com, yahoo.com, hotmail.com, outlook.com, aol.com)';

      if (!password) newErrors.password = 'Password is required';
      else if (!passwordRegex.test(password))
        newErrors.password = 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character';

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSignUp = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      setIsSubmitting(true);
      try {
        await api.post('/register', { name, email, password });
        setMessage({ text: 'Sign Up successful! Please sign in to continue.', type: 'success' });
        setName('');
        setEmail('');
        setPassword('');
        setErrors({});
        const navigateTimer = setTimeout(() => {
          setLoginView('signin');
          setIsLoginOpen(false);
          navigate('/');
        }, 2000);
        return () => clearTimeout(navigateTimer);
      } catch (err: any) {
        setMessage({ text: err.response?.data?.message || 'Sign Up failed. Please try again.', type: 'error' });
        setIsSubmitting(false);
      }
    };

    return (
      <div className="space-y-6 p-8 bg-white rounded-2xl shadow-lg border border-teal-100">
        <DialogHeader>
          <button
            onClick={() => setLoginView('signin')}
            className="absolute left-4 top-4 text-gray-500 hover:text-teal-600 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
          </button>
          <DialogTitle className="text-3xl font-bold text-center text-gray-800">Sign Up</DialogTitle>
          <p className="text-center mt-2 text-gray-500 text-sm">Join BakraMandi360 today</p>
        </DialogHeader>
        {message && (
          <div
            className={cn(
              'p-3 rounded-lg text-center text-sm font-medium',
              message.type === 'success' ? 'bg-teal-100 text-teal-600' : 'bg-teal-100 text-teal-400'
            )}
          >
            {message.text}
          </div>
        )}
        <form className="space-y-5" onSubmit={handleSignUp}>
          <div className="relative">
            <User
              className={cn(
                'absolute top-1/2 transform -translate-y-1/2 text-teal-600 transition-all duration-200',
                name.length > 0 ? 'right-3' : 'left-3'
              )}
              size={20}
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cn(
                'w-full py-3 border rounded-lg bg-gray- Cleveland Clinic',
                name.length > 0 ? 'pr-10 pl-4' : 'pl-10 pr-4',
                errors.name && 'border-teal-400'
              )}
              placeholder="Full Name"
            />
            {errors.name && <p className="text-teal-400 text-xs mt-1 animate-pulse">{errors.name}</p>}
          </div>
          <div className="relative">
            <Mail
              className={cn(
                'absolute top-1/2 transform -translate-y-1/2 text-teal-600 transition-all duration-200',
                email.length > 0 ? 'right-3' : 'left-3'
              )}
              size={20}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                'w-full py-3 border rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200',
                email.length > 0 ? 'pr-10 pl-4' : 'pl-10 pr-4',
                errors.email && 'border-teal-400'
              )}
              placeholder="Email"
            />
            {errors.email && <p className="text-teal-400 text-xs mt-1 animate-pulse">{errors.email}</p>}
          </div>
          <div className="relative">
            <Lock
              className={cn(
                'absolute top-1/2 transform -translate-y-1/2 text-teal-600 transition-all duration-200',
                password.length > 0 ? 'right-3' : 'left-3'
              )}
              size={20}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                'w-full py-3 border rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200',
                password.length > 0 ? 'pr-10 pl-4' : 'pl-10 pr-4',
                errors.password && 'border-teal-400'
              )}
              placeholder="Password"
            />
            {errors.password && <p className="text-teal-400 text-xs mt-1 animate-pulse">{errors.password}</p>}
          </div>
          <div className="flex gap-4">
            <Button
              type="submit"
              className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 hover:scale-105 transition-all duration-200 font-semibold"
            >
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    );
  };

  const NotFoundForm = ({
    setLoginView,
    setIsLoginOpen,
  }: {
    setLoginView: (view: 'signin' | 'signup' | 'notfound') => void;
    setIsLoginOpen: (open: boolean) => void;
  }) => {
    const navigate = useNavigate();

    return (
      <div className="space-y-6 p-8 bg-white rounded-2xl shadow-lg border border-teal-100">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-gray-800">404 - Oops! Page not found</DialogTitle>
          <p className="text-center mt-2 text-gray-500 text-sm">The reset link is invalid or expired.</p>
        </DialogHeader>
        <div className="text-center space-y-4">
          <Button
            onClick={() => {
              setLoginView('signin');
              navigate('/');
            }}
            className="bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 hover:scale-105 transition-all duration-200 font-semibold"
          >
            Return to Sign In
          </Button>
          <div>
            <button
              onClick={() => {
                setLoginView('signin');
                setIsLoginOpen(false);
                navigate('/');
              }}
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
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 -z-10 w-full h-full">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("${heroImages[0].url}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/10" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <div className="inline-block mb-4 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <p className="text-sm font-medium text-white">Premium Animals for Every Need</p>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {heroImages[0].title}
          </h1>
          <p className="text-lg text-white/80 mb-8 max-w-lg">{heroImages[0].subtitle}</p>
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-teal-600 text-white hover:bg-teal-700 transition-all text-lg"
              asChild
            >
              <Link to="/animals">
                Browse Animals <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              className="bg-teal-600 text-white hover:bg-teal-700 transition-all text-lg"
              asChild
            >
              <Link to="/qurbani">
                Qurbani Special <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              className="bg-teal-600 text-white hover:bg-teal-700 transition-all text-lg"
              asChild
            >
              <Link to="/sell-animals" onClick={handleSellAnimalsClick}>
                Sell Animals <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {isLoginOpen && (
        <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
          <DialogContent className="sm:max-w-[450px] p-0 bg-gradient-to-br from-teal-50 to-teal-100 border-none">
            {loginView === 'signin' && (
              <SignInForm setLoginView={setLoginView} setIsLoginOpen={setIsLoginOpen} setIsAuthenticated={setIsAuthenticated} />
            )}
            {loginView === 'signup' && <SignUpForm setLoginView={setLoginView} setIsLoginOpen={setIsLoginOpen} />}
            {loginView === 'notfound' && <NotFoundForm setLoginView={setLoginView} setIsLoginOpen={setIsLoginOpen} />}
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};

export default Hero;