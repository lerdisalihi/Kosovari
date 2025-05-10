// Import necessary React and library functions
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook for navigation
import { useAuthStore } from '../lib/services/auth'; // Custom authentication store
import { toast } from 'react-hot-toast'; // Toast notifications for success/error

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
            // Call the sign-up function with user inputs
            const result = await signUp(email, password, emri.trim(), role);

            // If successful, notify and redirect to login
            if (result?.user) {
                toast.success('Registration successful! Please log in.');
                navigate('/login');
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
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Page title */}
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {/* Registration form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Email input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        {/* Full name input */}
                        <div>
                            <label htmlFor="emri" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="emri"
                                    name="emri"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={emri}
                                    onChange={(e) => setEmri(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>

                        {/* Password input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    placeholder="At least 6 characters"
                                />
                            </div>
                        </div>

                        {/* Confirm password input */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    placeholder="Confirm your password"
                                />
                            </div>
                        </div>

                        {/* Role selection */}
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                Roli
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
                                <option value="citizen">Qytetar</option>
                                <option value="institution">Institucion</option>
                            </select>
                        </div>

                        {/* Secret Key Field (only for institution) */}
                        {role === 'institution' && (
                            <div>
                                <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700">
                                    Çelësi sekret për institucionin
                                </label>
                                <input
                                    type="password"
                                    id="secretKey"
                                    value={secretKey}
                                    onChange={e => setSecretKey(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
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
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                            >
                                {loading ? 'Creating account...' : 'Sign up'}
                            </button>
                        </div>

                        {/* Link to login page */}
                        <div className="text-sm text-center">
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="font-medium text-green-600 hover:text-green-500"
                            >
                                Already have an account? Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
