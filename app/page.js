'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://kill-feed-101-8k0h.onrender.com';

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [config, setConfig] = useState(null);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const savedKey = localStorage.getItem('adminKey');
    if (savedKey) {
      setAdminKey(savedKey);
      setIsLoggedIn(true);
      loadData(savedKey);
    }
  }, []);

  // Auto-refresh stats every 30 seconds
  useEffect(() => {
    if (isLoggedIn) {
      const interval = setInterval(() => {
        loadStats();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const loadData = async (key) => {
    setLoading(true);
    try {
      await Promise.all([
        loadStats(),
        loadConfig(key),
        loadChannels(key)
      ]);
    } catch (err) {
      setError('Failed to load data');
    }
    setLoading(false);
  };

  const loadStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/stats`);
      setStats(res.data);
    } catch (err) {
      console.error('Stats error:', err);
    }
  };

  const loadConfig = async (key) => {
    try {
      const res = await axios.get(`${API_URL}/api/config`, {
        headers: { Authorization: `Bearer ${key}` }
      });
      setConfig(res.data);
    } catch (err) {
      throw err;
    }
  };

  const loadChannels = async (key) => {
    try {
      const res = await axios.get(`${API_URL}/api/discord/channels`, {
        headers: { Authorization: `Bearer ${key}` }
      });
      setChannels(res.data.channels || []);
    } catch (err) {
      console.error('Channels error:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.get(`${API_URL}/api/config`, {
        headers: { Authorization: `Bearer ${adminKey}` }
      });
      
      localStorage.setItem('adminKey', adminKey);
      setIsLoggedIn(true);
      await loadData(adminKey);
    } catch (err) {
      setError('Invalid admin key');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminKey');
    setIsLoggedIn(false);
    setAdminKey('');
    setConfig(null);
    setStats(null);
  };

  const handleConfigUpdate = async (updates) => {
    try {
      await axios.post(`${API_URL}/api/config`, updates, {
        headers: { Authorization: `Bearer ${adminKey}` }
      });
      await loadConfig(adminKey);
      alert('Configuration updated!');
    } catch (err) {
      alert('Failed to update configuration');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-md border border-purple-500">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            DayZ Bot Dashboard
          </h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Admin Key</label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
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
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">DayZ Bot Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
          >
            Logout
          </button>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Events Processed"
              value={stats.eventsProcessed || 0}
              gradient="from-blue-500 to-blue-700"
            />
            <StatCard
              title="Online Players"
              value={stats.onlinePlayers?.currentOnline || 0}
              gradient="from-green-500 to-green-700"
            />
            <StatCard
              title="Peak Today"
              value={stats.onlinePlayers?.peakOnline || 0}
              gradient="from-purple-500 to-purple-700"
            />
            <StatCard
              title="Devices Tracked"
              value={stats.altDetection?.totalDevices || 0}
              gradient="from-orange-500 to-orange-700"
            />
          </div>
        )}

        {/* Configuration */}
        {config && (
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-purple-500">
            <h2 className="text-2xl font-bold text-white mb-6">Feed Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChannelSelector
                label="Kill Feed Channel"
                value={config.channelIds?.kill}
                channels={channels}
                onChange={(val) => handleConfigUpdate({ channelIds: { ...config.channelIds, kill: val } })}
              />
              
              <ChannelSelector
                label="Online Players Channel"
                value={config.channelIds?.online}
                channels={channels}
                onChange={(val) => handleConfigUpdate({ channelIds: { ...config.channelIds, online: val } })}
              />
              
              <ChannelSelector
                label="Admin Tracking Channel"
                value={config.channelIds?.adminTracking}
                channels={channels}
                onChange={(val) => handleConfigUpdate({ channelIds: { ...config.channelIds, adminTracking: val } })}
                optional
                enabled={config.feeds?.adminTracking}
                onToggle={(enabled) => handleConfigUpdate({ feeds: { ...config.feeds, adminTracking: enabled } })}
              />
              
              <ChannelSelector
                label="Alt Detection Channel"
                value={config.channelIds?.altDetection}
                channels={channels}
                onChange={(val) => handleConfigUpdate({ channelIds: { ...config.channelIds, altDetection: val } })}
              />
              
              <ChannelSelector
                label="Placed Items Channel"
                value={config.channelIds?.placed}
                channels={channels}
                onChange={(val) => handleConfigUpdate({ channelIds: { ...config.channelIds, placed: val } })}
                optional
                enabled={config.feeds?.placed}
                onToggle={(enabled) => handleConfigUpdate({ feeds: { ...config.feeds, placed: enabled } })}
              />
              
              <ChannelSelector
                label="Built Items Channel"
                value={config.channelIds?.built}
                channels={channels}
                onChange={(val) => handleConfigUpdate({ channelIds: { ...config.channelIds, built: val } })}
                optional
                enabled={config.feeds?.built}
                onToggle={(enabled) => handleConfigUpdate({ feeds: { ...config.feeds, built: enabled } })}
              />
              
              <ChannelSelector
                label="Dismantled Items Channel"
                value={config.channelIds?.dismantled}
                channels={channels}
                onChange={(val) => handleConfigUpdate({ channelIds: { ...config.channelIds, dismantled: val } })}
                optional
                enabled={config.feeds?.dismantled}
                onToggle={(enabled) => handleConfigUpdate({ feeds: { ...config.feeds, dismantled: enabled } })}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          Bot Version: {stats?.version || 'Unknown'} • Uptime: {formatUptime(stats?.uptime)}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, gradient }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-lg p-6 shadow-lg`}>
      <h3 className="text-white text-sm font-semibold mb-2 opacity-90">{title}</h3>
      <p className="text-white text-3xl font-bold">{value.toLocaleString()}</p>
    </div>
  );
}

function ChannelSelector({ label, value, channels, onChange, optional, enabled, onToggle }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-gray-300 font-semibold">{label}</label>
        {optional && (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => onToggle(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-gray-400 text-sm">Enable</span>
          </label>
        )}
      </div>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={optional && !enabled}
        className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none disabled:opacity-50"
      >
        <option value="">Select Channel</option>
        {channels.map((ch) => (
          <option key={ch.id} value={ch.id}>
            #{ch.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function formatUptime(seconds) {
  if (!seconds) return '0s';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours}h ${minutes}m ${secs}s`;
}