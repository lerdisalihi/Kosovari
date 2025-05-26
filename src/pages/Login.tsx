// Import necessary modules and hooks
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation between routes
import { toast } from 'react-hot-toast'; // For displaying toast notifications
import { useAuthStore } from '../lib/services/auth'; // Custom auth store for sign-in logic

// Define the Login component
const Login: React.FC = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input
  const [loading, setLoading] = useState(false); // State to manage loading indicator
  const { signIn } = useAuthStore(); // Function to handle user sign-in from the auth store
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form behavior
    setLoading(true); // Set loading state to true during API call

    try {
      await signIn(email, password); // Attempt to sign in with email and password
      toast.success('Signed in successfully!'); // Show success toast
      navigate('/'); // Redirect to homepage after successful login
    } catch (error) {
      // Handle error and display an appropriate message
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Reset loading state regardless of outcome
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-gradient-to-tr from-green-200 via-green-100 to-blue-200 animate-fadeIn">
      {/* Left Side Illustration/Brand */}
      <div className="hidden md:flex w-1/2 flex-col justify-center items-center bg-gradient-to-br from-green-400 to-blue-500 text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center" />
        <div className="relative z-10 flex flex-col items-center">
          {/* Logo Image */}
          <div className="mb-8">
            <div className="w-40 h-40 rounded-full bg-white bg-opacity-30 shadow-lg relative">
               <img src="/assets/logoja.png" alt="Logo" className="absolute left-1/2 top-1/2 w-[120rem] h-[120rem] -translate-x-1/2 -translate-y-1/2 object-contain" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold mb-4 drop-shadow-lg">Welcome Back!</h2>
          <p className="text-lg font-medium text-white/90 mb-8 text-center max-w-xs">Sign in to access your personalized dashboard and explore new features.</p>
          <div className="flex flex-col gap-2 mt-8">
            <span className="text-sm text-white/70">"Empowering your journey, one login at a time."</span>
          </div>
        </div>
      </div>

      {/* Right Side Login Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md bg-white bg-opacity-90 rounded-2xl shadow-2xl p-8 space-y-8 animate-fadeInUp">
          {/* Logo for mobile */}
          <div className="md:hidden flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center shadow-md">
              <img src="/assets/logoja.png" alt="Logo" className="w-96 h-96 object-contain" />
            </div>
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email input with icon */}
              <div className="relative">
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v1a4 4 0 01-8 0v-1" /></svg>
                </span>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-md block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {/* Password input with icon */}
              <div className="relative">
                <label htmlFor="password" className="sr-only">Password</label>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 0v2m0 4h.01" /></svg>
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-md block w-full pl-10 pr-12 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center focus:outline-none z-10 hover:bg-gray-100 rounded p-1"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{ pointerEvents: 'auto' }}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95m3.249-2.383A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.973 9.973 0 01-4.21 5.442M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 disabled:opacity-50 shadow-lg transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                    Signing in...
                  </span>
                ) : 'Sign in'}
              </button>
            </div>
            {/* Navigation to registration/forgot password */}
            <div className="text-sm text-center space-y-2 mt-2">
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="font-medium text-green-600 hover:text-green-500 transition"
              >
                Don't have an account? <span className="underline">Sign up</span>
              </button>
              <br />
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="font-medium text-blue-600 hover:text-blue-500 transition"
              >
                Forgot password? <span className="underline">Click to change</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Animations */}
      <style>{`
        .animate-fadeIn { animation: fadeIn 1s ease; }
        .animate-fadeInUp { animation: fadeInUp 1s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

// Export the Login component for use in other parts of the app
export default Login;
