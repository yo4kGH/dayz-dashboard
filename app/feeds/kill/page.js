'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://kill-feed-101-8k0h.onrender.com';

export default function KillFeedPage() {
  const router = useRouter();
  const [config, setConfig] = useState(null);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('adminKey');
    if (!savedKey) {
      router.push('/');
      return;
    }

    loadData(savedKey);
  }, []);

  const loadData = async (key) => {
    try {
      const [configRes, channelsRes] = await Promise.all([
        axios.get(`${API_URL}/api/config`, {
          headers: { Authorization: `Bearer ${key}` }
        }),
        axios.get(`${API_URL}/api/discord/channels`, {
          headers: { Authorization: `Bearer ${key}` }
        })
      ]);

      setConfig(configRes.data);
      setChannels(channelsRes.data.channels || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load:', err);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const key = localStorage.getItem('adminKey');
      await axios.post(`${API_URL}/api/config`, config, {
        headers: { Authorization: `Bearer ${key}` }
      });
      alert('Kill feed settings saved!');
    } catch (err) {
      alert('Failed to save settings');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => router.push('/feeds')}
          className="text-blue-400 hover:text-blue-300 mb-4 flex items-center gap-2"
        >
          ← Back to Feeds
        </button>

        <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl">🎯</div>
            <div>
              <h1 className="text-3xl font-bold text-white">Kill Feed Configuration</h1>
              <p className="text-gray-400">Configure where kill notifications are sent</p>
            </div>
          </div>

          {config && (
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Discord Channel</label>
                <select
                  value={config.channelIds?.kill || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    channelIds: { ...config.channelIds, kill: e.target.value }
                  })}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select Channel</option>
                  {channels.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      #{ch.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}