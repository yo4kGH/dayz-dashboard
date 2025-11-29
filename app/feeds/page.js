'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://kill-feed-101-8k0h.onrender.com';

const FEED_ICONS = [
  { name: 'Kill Feed', path: '/feeds/kill', icon: '🎯', color: 'from-red-600 to-red-800' },
  { name: 'Death Feed', path: '/feeds/death', icon: '💀', color: 'from-purple-600 to-purple-800' },
  { name: 'Leader Board', path: '/feeds/leaderboard', icon: '🏆', color: 'from-yellow-600 to-yellow-800' },
  { name: 'Online Players', path: '/feeds/online', icon: '👥', color: 'from-green-600 to-green-800' },
  { name: 'Admin Tracking', path: '/feeds/admin', icon: '👮', color: 'from-blue-600 to-blue-800' },
  { name: 'Alt Detection', path: '/feeds/alt', icon: '🔍', color: 'from-orange-600 to-orange-800' },
  { name: 'Built Items', path: '/feeds/built', icon: '🔨', color: 'from-cyan-600 to-cyan-800' },
  { name: 'Placed Items', path: '/feeds/placed', icon: '📦', color: 'from-indigo-600 to-indigo-800' },
];

export default function FeedsPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('adminKey');
    if (!savedKey) {
      router.push('/');
      return;
    }

    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/stats`);
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <button 
              onClick={() => router.push('/')}
              className="text-blue-400 hover:text-blue-300 mb-2 flex items-center gap-2"
            >
              ← Back to Servers
            </button>
            <h1 className="text-4xl font-bold text-white">KILL FEED 101</h1>
            <p className="text-gray-400">Server ID: 17740510</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('adminKey');
              router.push('/');
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-white text-sm font-semibold mb-2 opacity-90">Events Processed</h3>
              <p className="text-white text-3xl font-bold">{stats.eventsProcessed || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-white text-sm font-semibold mb-2 opacity-90">Online Players</h3>
              <p className="text-white text-3xl font-bold">{stats.onlinePlayers?.currentOnline || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-white text-sm font-semibold mb-2 opacity-90">Peak Today</h3>
              <p className="text-white text-3xl font-bold">{stats.onlinePlayers?.peakOnline || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-white text-sm font-semibold mb-2 opacity-90">Devices Tracked</h3>
              <p className="text-white text-3xl font-bold">{stats.altDetection?.totalDevices || 0}</p>
            </div>
          </div>
        )}

        {/* Feed Grid */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Configure Feeds</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FEED_ICONS.map((feed) => (
              <button
                key={feed.name}
                onClick={() => router.push(feed.path)}
                className={`bg-gradient-to-br ${feed.color} rounded-lg p-6 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex flex-col items-center justify-center gap-3`}
              >
                <div className="text-5xl">{feed.icon}</div>
                <div className="text-white font-semibold text-center text-sm">{feed.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}