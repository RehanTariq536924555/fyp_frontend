import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Admin credentials check
    if (email === "admin@example.com" && password === "NewAdmin123") {
      setError("");
      // Store admin auth in localStorage/session
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("adminId", "admin-001");
      localStorage.setItem("adminName", "System Administrator");
      
      // Create a mock admin token for backend authentication
      // In a real app, this should come from a proper admin login API
      const adminToken = btoa(JSON.stringify({
        id: "admin-001",
        email: "admin@example.com",
        role: "admin",
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      }));
      localStorage.setItem("token", adminToken);
      
      navigate("/admin");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white p-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?ixlib=rb-4.0.3"
            alt="BakraMandi Animal"
            className="w-full h-auto rounded-xl shadow-md"
          />
        </div>

        <div className="w-full">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-2">Admin Panel</h2>
          <p className="text-center mb-6">
            Secure access to <span className="font-semibold text-teal-600">BakraMandi360</span>
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 shadow-sm focus-within:ring-2 focus-within:ring-teal-400">
              <Mail className="text-gray-400 mr-3" size={20} />
              <input
                type="email"
                placeholder="Admin Email"
                className="w-full bg-transparent outline-none text-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 shadow-sm focus-within:ring-2 focus-within:ring-teal-400">
              <Lock className="text-gray-400 mr-3" size={20} />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-transparent outline-none text-gray-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-[#00785C] text-white py-3 rounded-lg font-bold tracking-wide shadow-md transition-all duration-300"
            >
              Login as Admin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
