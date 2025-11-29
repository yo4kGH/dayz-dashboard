'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://kill-feed-101-8k0h.onrender.com';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('adminKey');
    if (savedKey) {
      setAdminKey(savedKey);
      verifyAndLogin(savedKey);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyAndLogin = async (key) => {
    try {
      const response = await axios.get(`${API_URL}/api/config`, {
        headers: { Authorization: `Bearer ${key}` }
      });
      console.log('Auth success:', response.data);
      setIsLoggedIn(true);
      setLoading(false);
    } catch (err) {
      console.error('Auth failed:', err);
      setDebugInfo(`Error: ${err.message} - ${err.response?.status} - ${err.response?.data?.error}`);
      localStorage.removeItem('adminKey');
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setDebugInfo('');
    setLoading(true);

    console.log('Attempting login with key:', adminKey);
    console.log('API URL:', API_URL);

    try {
      const response = await axios.get(`${API_URL}/api/config`, {
        headers: { Authorization: `Bearer ${adminKey}` }
      });
      
      console.log('Login successful:', response.data);
      localStorage.setItem('adminKey', adminKey);
      setIsLoggedIn(true);
      setLoading(false);
    } catch (err) {
      console.error('Login error:', err);
      console.error('Response:', err.response);
      
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to API server. Check if backend is running.');
        setDebugInfo('Network error - CORS or server offline');
      } else if (err.response?.status === 401) {
        setError('Invalid admin key');
        setDebugInfo(`Server says: ${err.response.data.error}`);
      } else {
        setError(`Error: ${err.message}`);
        setDebugInfo(`Status: ${err.response?.status}, Details: ${JSON.stringify(err.response?.data)}`);
      }
      setLoading(false);
    }
  };

  const handleServerSelect = () => {
    router.push('/feeds');
  };

  if (loading && !debugInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-md border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            DayZ Bot Dashboard
          </h1>
          
          {/* Debug Info */}
          <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500 rounded text-blue-200 text-xs">
            <div>API: {API_URL}</div>
            <div>Endpoint: /api/config</div>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 font-semibold">Admin Key</label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Enter admin key"
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-200">
                {error}
              </div>
            )}

            {debugInfo && (
              <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500 rounded text-yellow-200 text-xs">
                {debugInfo}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Quick Test Button */}
          <button
            onClick={async () => {
              try {
                const res = await axios.get(`${API_URL}/api/stats`);
                alert('API is reachable! Stats: ' + JSON.stringify(res.data).substring(0, 100));
              } catch (err) {
                alert('API test failed: ' + err.message);
              }
            }}
            className="w-full mt-3 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded text-sm"
          >
            Test API Connection
          </button>
        </div>
      </div>
    );
  }

  // Server selection screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Select Server</h1>
          <button
            onClick={() => {
              localStorage.removeItem('adminKey');
              setIsLoggedIn(false);
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            onClick={handleServerSelect}
            className="bg-gray-800 border border-gray-700 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">KILL FEED 101</h2>
                <p className="text-gray-400 text-sm">Server ID: 17740510</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition">
                Settings
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Map:</span>
                <span className="text-white">Livonia</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Slots:</span>
                <span className="text-white">64</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Location:</span>
                <span className="text-white">US</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}