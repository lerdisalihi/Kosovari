// Import necessary React and library functions
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook for navigation
import { useAuthStore } from '../lib/services/auth'; // Custom authentication store
import { toast } from 'react-hot-toast'; // Toast notifications for success/error
import supabase from '../lib/supabase'; // Import the Supabase client
import PasswordStrength from '../components/Auth/PasswordStrength';
import logoja from '/assets/logoja.png';

// Register component definition
export default function Register() {
    // State for form inputs and validation
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emri, setEmri] = useState(''); // Full name
    const [loading, setLoading] = useState(false); // Controls button state during async action
    const [error, setError] = useState<string | null>(null); // Holds error message to display
    const [role, setRole] = useState<'citizen' | 'institution'>('citizen');
    const [secretKey, setSecretKey] = useState('');
    const [isPasswordActive, setIsPasswordActive] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate(); // Hook to navigate programmatically
    const { signUp } = useAuthStore(); // Custom sign-up function from auth store

    // Form submission handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submit behavior
        setLoading(true);
        setError(null); // Clear previous errors

        // Basic form validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        if (!emri.trim()) {
            setError('Name is required');
            setLoading(false);
            return;
        }

        // Secret key validation for institution
        if (role === 'institution') {
            if (!secretKey || secretKey !== 'çelsisekretperadmin') {
                setError('Çelësi sekret është i pasaktë ose i zbrazët.');
                setLoading(false);
                return;
            }
        }

        try {
            // Call the Supabase stored procedure for signup
            const { data, error: rpcError } = await supabase.rpc('register_user', {
                emri: emri.trim(),
                email,
                password,
                roli: role,
                secret_key: secretKey || null,
            });

            if (rpcError) {
                setError(rpcError.message);
                toast.error(rpcError.message);
                setLoading(false);
                return;
            }

            if (data && data.error) {
                setError(data.error);
                toast.error(data.error);
                setLoading(false);
                return;
            }

            if (data && data.success) {
                toast.success('Registration successful! Please log in.');
                navigate('/login');
            } else {
                setError('Unknown error occurred');
                toast.error('Unknown error occurred');
            }
        } catch (err: any) {
            // Handle errors and show a toast
            console.error('Registration error:', err);
            const errorMessage = err.message || 'Failed to sign up';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false); // Always reset loading
        }
    };

    // Render the registration form
    return (
        <div className="min-h-screen flex items-stretch bg-gradient-to-tr from-green-200 via-green-100 to-blue-200 animate-fadeIn">
            {/* Left Side Illustration/Brand */}
            <div className="hidden md:flex w-1/2 flex-col justify-center items-center bg-gradient-to-br from-green-400 to-blue-500 text-white p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center" />
                <div className="relative z-10 flex flex-col items-center">
                    {/* Logo Image */}
                    <div className="mb-8">
                        <div className="w-40 h-40 rounded-full bg-white bg-opacity-30 shadow-lg relative">
                            <img src={logoja} alt="Logo" className="absolute left-1/2 top-1/2 w-[120rem] h-[120rem] -translate-x-1/2 -translate-y-1/2 object-contain" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-extrabold mb-4 drop-shadow-lg">Join KosovAR!</h2>
                    <p className="text-lg font-medium text-white/90 mb-8 text-center max-w-xs">Create your account to start reporting issues and making a difference in Kosovo.</p>
                    <div className="flex flex-col gap-2 mt-8">
                        <span className="text-sm text-white/70">"Empowering your journey, one registration at a time."</span>
                    </div>
                </div>
            </div>

            {/* Right Side Registration Form */}
            <div className="flex w-full md:w-1/2 items-center justify-center p-8">
                <div className="w-full max-w-md bg-white bg-opacity-90 rounded-2xl shadow-2xl p-8 space-y-8 animate-fadeInUp">
                    {/* Logo for mobile */}
                    <div className="md:hidden flex justify-center mb-4">
                        <div className="w-20 h-20 rounded-full bg-green-100 shadow-md relative">
                            <img src={logoja} alt="Logo" className="absolute left-1/2 top-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 object-contain" />
                        </div>
                    </div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Email input with icon */}
                        <div className="relative">
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v1a4 4 0 01-8 0v-1" /></svg>
                            </span>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-md block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white"
                                placeholder="Enter your email"
                            />
                        </div>
                        {/* Full name input with icon */}
                        <div className="relative">
                            <label htmlFor="emri" className="sr-only">Full Name</label>
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </span>
                            <input
                                id="emri"
                                name="emri"
                                type="text"
                                autoComplete="name"
                                required
                                value={emri}
                                onChange={(e) => setEmri(e.target.value)}
                                className="appearance-none rounded-md block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white"
                                placeholder="Enter your full name"
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
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setIsPasswordActive(true)}
                                onBlur={() => setIsPasswordActive(false)}
                                className="appearance-none rounded-md block w-full pl-10 pr-12 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white"
                                placeholder="At least 6 characters"
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
                        {/* Password strength meter */}
                        {isPasswordActive && (
                            <PasswordStrength password={password} isActive={isPasswordActive} />
                        )}
                        {/* Confirm password input with icon */}
                        <div className="relative">
                            <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 0v2m0 4h.01" /></svg>
                            </span>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="appearance-none rounded-md block w-full pl-10 pr-12 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white"
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center focus:outline-none z-10 hover:bg-gray-100 rounded p-1"
                                tabIndex={-1}
                                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                style={{ pointerEvents: 'auto' }}
                            >
                                {showConfirmPassword ? (
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
                        {/* Role selection */}
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                Role
                            </label>
                            <select
                                id="role"
                                value={role}
                                onChange={e => {
                                    setRole(e.target.value as 'citizen' | 'institution');
                                    setSecretKey('');
                                    setError(null);
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            >
                                <option value="citizen">Citizen</option>
                                <option value="institution">Institution</option>
                            </select>
                        </div>
                        {/* Secret Key Field (only for institution) */}
                        {role === 'institution' && (
                            <div className="relative">
                                <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700">
                                    Secret Key for Institution
                                </label>
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 0v2m0 4h.01" /></svg>
                                </span>
                                <input
                                    type="password"
                                    id="secretKey"
                                    value={secretKey}
                                    onChange={e => setSecretKey(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 pl-10"
                                    required
                                />
                            </div>
                        )}
                        {/* Display error messages if any */}
                        {error && (
                            <div className="text-red-600 text-sm">
                                {error}
                            </div>
                        )}
                        {/* Submit button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 disabled:opacity-50 shadow-lg transition-all duration-200"
                            >
                                {loading ? 'Creating account...' : 'Sign up'}
                            </button>
                        </div>
                        {/* Link to login page */}
                        <div className="text-sm text-center mt-2">
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="font-medium text-green-600 hover:text-green-500 transition"
                            >
                                Already have an account? <span className="underline">Sign in</span>
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
}
