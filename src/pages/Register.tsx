import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [serverConnected, setServerConnected] = useState(false);
    const navigate = useNavigate();

    // Test server connection on component mount
    useEffect(() => {
        const testConnection = async () => {
            try {
                console.log('Testing server connection...');
                const response = await fetch('http://localhost/server/api/test_connection.php');
                const text = await response.text();
                console.log('Raw response:', text);
                
                try {
                    const data = JSON.parse(text);
                    if (data.success) {
                        setServerConnected(true);
                        console.log('Server connection successful:', data);
                    } else {
                        console.error('Server test failed:', data);
                        setError('Server connection failed: ' + data.message);
                    }
                } catch (parseError) {
                    console.error('Failed to parse server response:', parseError);
                    setError('Server returned invalid response. Please check server configuration.');
                }
            } catch (err) {
                console.error('Failed to connect to server:', err);
                setError('Failed to connect to server. Please ensure the server is running.');
            }
        };
        testConnection();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!serverConnected) {
            setError('Server connection failed. Please try again later.');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            console.log('Attempting to register...');
            const response = await fetch('http://localhost/server/api/register.php', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    emri: email.split('@')[0],
                    email,
                    password_hash: password,
                    roli: 'citizen',
                    leveli: 0,
                    pike_eksperience: 0
                })
            });

            console.log('Response status:', response.status);
            const text = await response.text();
            console.log('Raw response:', text);

            try {
                const data = JSON.parse(text);
                if (response.ok) {
                    toast.success('Registration successful!');
                    navigate('/login');
                } else {
                    setError(data.message || 'Failed to sign up');
                    toast.error(data.message || 'Failed to sign up');
                }
            } catch (parseError) {
                console.error('Failed to parse registration response:', parseError);
                setError('Server returned invalid response. Please try again later.');
                toast.error('Server returned invalid response');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Failed to connect to server. Please check your connection and try again.');
            toast.error('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
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
                                />
                            </div>
                        </div>

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
                                />
                            </div>
                        </div>

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
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                            >
                                {loading ? 'Creating account...' : 'Sign up'}
                            </button>
                        </div>

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