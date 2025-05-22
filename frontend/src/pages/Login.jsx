import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save user info (optional: JWT token can be stored too)
        localStorage.setItem('user', JSON.stringify(data.user));
        if (!rememberMe) {
          sessionStorage.setItem('user', JSON.stringify(data.user));
        }

        navigate('/');
      } else {
        setError(data.error || 'Invalid username or password');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#242424] rounded-lg shadow-2xl overflow-hidden p-8">
        <h1 className="text-5xl font-bold mb-12 text-white">Sign In</h1>

        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500 text-red-500 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-2xl font-medium mb-3 text-white">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-14 px-4 rounded-md border border-gray-600 bg-[#2a2a2a] text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-2xl font-medium mb-3 text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 px-4 rounded-md border border-gray-600 bg-[#2a2a2a] text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-5 h-5 text-blue-600 bg-[#2a2a2a] border-gray-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="rememberMe" className="ml-3 text-xl font-medium text-white">
              Stay Signed In
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-[#4CAF50] hover:bg-[#45a049] transition-colors rounded-md text-white text-xl font-medium focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Update the link to "/register" */}
        <p className="mt-4 text-xl text-white">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#4CAF50] hover:text-[#45a049] underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;