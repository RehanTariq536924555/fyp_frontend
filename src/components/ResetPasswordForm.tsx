import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ text: string; type: string } | null>(null);
  const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});
  const location = useLocation();
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: 'http://localhost:3001/auth',
  });

  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get('token');

  useEffect(() => {
    console.log('ResetPasswordPage mounted, token:', token);
    if (!token) {
      console.log('No token found, redirecting to notfound');
      setMessage({ text: 'Invalid or missing reset token. Please request a new link.', type: 'error' });
      navigate('/notfound', { replace: true });
    }
  }, [token, navigate]);

  const validateForm = () => {
    const newErrors: { newPassword?: string; confirmPassword?: string } = {};
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (!passwordRegex.test(newPassword)) {
      newErrors.newPassword = 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!token) {
      console.log('No token found during submission, redirecting to notfound');
      setMessage({ text: 'Invalid or missing reset token. Please request a new link.', type: 'error' });
      navigate('/notfound', { replace: true });
      return;
    }

    try {
      console.log('Sending reset request with token:', token);
      const response = await api.post(`/reset-password?token=${encodeURIComponent(token)}`, {
        newPassword,
        confirmPassword,
      });
      setMessage({ text: response.data.message || 'Password reset successfully! You can now sign in.', type: 'success' });
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      console.error('Reset Password Error:', err.response?.data);
      setMessage({ text: err.response?.data?.message || 'Failed to reset password. Please try again.', type: 'error' });
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="relative max-w-md w-full mx-4 p-6 bg-white/90 backdrop-blur-md rounded-xl shadow-lg space-y-4 border border-teal-100/50 transition-all duration-300 hover:border-teal-300">
        {/* Close Button and Header */}
        <div className="relative text-center">
          <button
            onClick={() => navigate('/')}
            className="absolute right-0 top-0 text-gray-500 hover:text-teal-600 transition-colors duration-200"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
          <p className="mt-1 text-sm text-gray-500">Create a strong, secure password</p>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={cn(
              'p-2 rounded-lg text-center text-sm font-medium transition-all duration-300',
              message.type === 'success' ? 'bg-teal-100 text-teal-700' : 'bg-red-100 text-red-700',
            )}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <form className="space-y-3" onSubmit={handleResetPassword}>
          {/* New Password Field */}
          <div className="relative">
            <Lock
              className={cn(
                'absolute top-1/2 -translate-y-1/2 left-3 text-teal-600',
                newPassword.length > 0 && 'left-3',
              )}
              size={18}
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={cn(
                'w-full py-2.5 pl-10 pr-4 border border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 outline-none bg-white',
                errors.newPassword && 'border-red-300 focus:ring-red-400 focus:border-red-400',
              )}
              placeholder="New Password"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <Lock
              className={cn(
                'absolute top-1/2 -translate-y-1/2 left-3 text-teal-600',
                confirmPassword.length > 0 && 'left-3',
              )}
              size={18}
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={cn(
                'w-full py-2.5 pl-10 pr-4 border border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 outline-none bg-white',
                errors.confirmPassword && 'border-red-300 focus:ring-red-400 focus:border-red-400',
              )}
              placeholder="Confirm Password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-teal-600 text-white py-2.5 rounded-full font-semibold text-base hover:bg-teal-700 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;