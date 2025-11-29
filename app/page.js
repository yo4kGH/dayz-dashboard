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
      await axios.get(`${API_URL}/api/config`, {
        headers: { Authorization: `Bearer ${key}` }
      });
      setIsLoggedIn(true);
      setLoading(false);
    } catch (err) {
      localStorage.removeItem('adminKey');
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.get(`${API_URL}/api/config`, {
        headers: { Authorization: `Bearer ${adminKey}` }
      });
      
      localStorage.setItem('adminKey', adminKey);
      setIsLoggedIn(true);
      setLoading(false);
    } catch (err) {
      setError('Invalid admin key');
      setLoading(false);
    }
  };

  const handleServerSelect = () => {
    router.push('/feeds');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4" style={{ backgroundImage: 'url(https://i.imgur.com/xN9qYmZ.jpg)', backgroundSize: 'cover' }}>
        <div className="bg-black/90 backdrop-blur-sm rounded-lg shadow-2xl p-8 w-full max-w-md border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            DayZ Bot Dashboard
          </h1>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 font-semibold">Admin Key</label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-indigo-500 focus:outline-none"
                placeholder="Enter admin key"
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Server selection (SS9 style)
  return (
    <div className="min-h-screen bg-gray-900 p-6" style={{ backgroundImage: 'url(https://i.imgur.com/xN9qYmZ.jpg)', backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
      {/* Top Nav */}
      <nav className="bg-black/80 backdrop-blur-sm border-b border-gray-800 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-white font-bold text-xl">GAME SERVER</div>
            <button
              onClick={() => {
                localStorage.removeItem('adminKey');
                setIsLoggedIn(false);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
            >
              LOG OUT
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            onClick={handleServerSelect}
            className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg p-6 cursor-pointer hover:border-gray-500 transition relative"
          >
            <button className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded flex items-center justify-center text-xl">
              ×
            </button>
            
            <div className="mb-4">
              <div className="text-gray-400 text-sm">ServerID: 17740510</div>
              <div className="text-white text-xl font-bold">Name: KILL FEED 101</div>
              <div className="text-gray-400 text-sm">Map: Livonia</div>
              <div className="text-gray-400 text-sm">Slots: 64</div>
              <div className="text-gray-400 text-sm">Location: US</div>
            </div>

            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded transition flex items-center justify-center gap-2">
              <span>⚙</span>
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}