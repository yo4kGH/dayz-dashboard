'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://kill-feed-101-8k0h.onrender.com';

const FEED_TILES = [
  { 
    name: 'KILL FEED', 
    path: '/feeds/kill', 
    image: 'https://i.imgur.com/8YNkQhD.jpg',
    free: true,
    color: 'text-orange-500'
  },
  { 
    name: 'DEATH FEED', 
    path: '/feeds/death', 
    image: 'https://i.imgur.com/vN9xJYm.jpg',
    free: true,
    color: 'text-white'
  },
  { 
    name: 'LEADER BOARD', 
    path: '/feeds/leaderboard', 
    image: 'https://i.imgur.com/Kp8zQhN.jpg',
    free: true,
    color: 'text-white'
  },
  { 
    name: 'PLAYER CHANNEL', 
    path: '/feeds/online', 
    image: 'https://i.imgur.com/mK9xYvB.jpg',
    free: true,
    color: 'text-orange-500'
  },
  { 
    name: 'KILLS MAP', 
    path: '/feeds/heatmap', 
    image: 'https://i.imgur.com/tN8rQmP.jpg',
    free: false,
    color: 'text-white'
  },
  { 
    name: 'COMBAT LOG FEED', 
    path: '/feeds/combat', 
    image: 'https://i.imgur.com/7YxpQnM.jpg',
    free: false,
    color: 'text-white'
  },
  { 
    name: 'CONNECTION FEED', 
    path: '/feeds/connection', 
    image: 'https://i.imgur.com/hN2xQmP.jpg',
    free: false,
    color: 'text-white'
  },
  { 
    name: 'PLAYER LIST FEED', 
    path: '/feeds/playerlist', 
    image: 'https://i.imgur.com/pN8xYmQ.jpg',
    free: false,
    color: 'text-orange-500'
  },
  { 
    name: 'GLITCHER FINDER', 
    path: '/feeds/glitcher', 
    image: 'https://i.imgur.com/qN9xYmR.jpg',
    free: false,
    color: 'text-white'
  },
  { 
    name: 'BASE ALARM', 
    path: '/feeds/base', 
    image: 'https://i.imgur.com/rN7xQmS.jpg',
    free: false,
    color: 'text-white'
  },
  { 
    name: 'PLAYER LIST MAP', 
    path: '/feeds/playermap', 
    image: 'https://i.imgur.com/sN6xQmT.jpg',
    free: false,
    color: 'text-white'
  },
  { 
    name: 'CONSTRUCTION FEED', 
    path: '/feeds/construction', 
    image: 'https://i.imgur.com/tN5xQmU.jpg',
    free: false,
    color: 'text-orange-500'
  },
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
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
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
    <div className="min-h-screen bg-gray-900" style={{ backgroundImage: 'url(https://i.imgur.com/xN9qYmZ.jpg)', backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
      {/* Top Navigation */}
      <nav className="bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <img src="https://i.imgur.com/DayZLogo.png" alt="Logo" className="h-10" onError={(e) => e.target.style.display = 'none'} />
              <div className="flex gap-6 text-sm">
                <button onClick={() => router.push('/')} className="text-gray-300 hover:text-white transition">HOME</button>
                <button className="text-white font-semibold">LEADER BOARD</button>
                <button className="text-gray-300 hover:text-white transition">SUPPORT</button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-300 text-sm">KILL FEED 101</span>
              <button
                onClick={() => {
                  localStorage.removeItem('adminKey');
                  router.push('/');
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition"
              >
                LOG OUT
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Server Info */}
        <div className="text-center mb-8">
          <div className="text-gray-400 text-sm mb-2">ServerID: 17740510</div>
          <div className="text-white text-xl mb-2">Server Name: KILL FEED 101</div>
          <div className="text-gray-400 text-sm mb-4">Discord Group: KILL FEED 101</div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded transition">
            Choose/Refresh Discord
          </button>
        </div>

        {/* Feed Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 mb-8">
          {FEED_TILES.map((feed) => (
            <button
              key={feed.name}
              onClick={() => router.push(feed.path)}
              className="group relative flex flex-col items-center gap-3"
            >
              {/* Circular Image */}
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700 group-hover:border-gray-500 transition shadow-xl">
                <img 
                  src={feed.image} 
                  alt={feed.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x200/1a1a1a/666?text=' + feed.name.substring(0, 1);
                  }}
                />
                {feed.free && (
                  <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">
                    FREE
                  </div>
                )}
              </div>
              
              {/* Label */}
              <div className={`text-center text-xs font-bold ${feed.color} uppercase tracking-wider`}>
                {feed.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}