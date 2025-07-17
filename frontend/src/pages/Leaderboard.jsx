import React, { useState } from 'react';
import { ArrowLeft, Trophy, Medal, Award, Crown, Star, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sellers');
  const [timeFilter, setTimeFilter] = useState('month');

  // Mock leaderboard data
  const topSellers = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100',
      level: 'Platinum',
      points: 15420,
      sales: 234,
      rating: 4.9,
      location: 'Delhi',
      category: 'Electronics',
      badge: '👑'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=100',
      level: 'Gold',
      points: 12890,
      sales: 189,
      rating: 4.8,
      location: 'Mumbai',
      category: 'Fashion',
      badge: '🥇'
    },
    {
      id: '3',
      name: 'Amit Patel',
      avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?w=100',
      level: 'Gold',
      points: 11250,
      sales: 156,
      rating: 4.7,
      location: 'Bangalore',
      category: 'Cars',
      badge: '🥈'
    },
    {
      id: '4',
      name: 'Sneha Gupta',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100',
      level: 'Silver',
      points: 9870,
      sales: 134,
      rating: 4.6,
      location: 'Chennai',
      category: 'Books',
      badge: '🥉'
    },
    {
      id: '5',
      name: 'Vikram Singh',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?w=100',
      level: 'Silver',
      points: 8650,
      sales: 112,
      rating: 4.5,
      location: 'Pune',
      category: 'Furniture',
      badge: '🏆'
    }
  ];

  const topCategories = [
    { name: 'Electronics', sales: 1234, growth: '+15%', icon: '📱' },
    { name: 'Cars', sales: 856, growth: '+8%', icon: '🚗' },
    { name: 'Fashion', sales: 743, growth: '+22%', icon: '👕' },
    { name: 'Furniture', sales: 567, growth: '+12%', icon: '🪑' },
    { name: 'Books', sales: 432, growth: '+5%', icon: '📚' }
  ];

  const topLocations = [
    { name: 'Delhi', sales: 2341, sellers: 456, icon: '🏛️' },
    { name: 'Mumbai', sales: 2156, sellers: 398, icon: '🌊' },
    { name: 'Bangalore', sales: 1987, sellers: 367, icon: '💻' },
    { name: 'Chennai', sales: 1654, sellers: 298, icon: '🏖️' },
    { name: 'Pune', sales: 1432, sellers: 267, icon: '🎓' }
  ];

  const getLevelColor = (level) => {
    switch (level) {
      case 'Platinum': return 'text-purple-400';
      case 'Gold': return 'text-yellow-400';
      case 'Silver': return 'text-gray-300';
      default: return 'text-orange-400';
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 1: return <Medal className="w-6 h-6 text-gray-300" />;
      case 2: return <Award className="w-6 h-6 text-orange-400" />;
      default: return <span className="text-lg font-bold text-gray-400">#{index + 1}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h1 className="text-xl font-bold text-white">Leaderboard</h1>
              </div>
            </div>
            
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('sellers')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'sellers'
                ? 'bg-teal-500 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            Top Sellers
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'categories'
                ? 'bg-teal-500 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('locations')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'locations'
                ? 'bg-teal-500 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            Locations
          </button>
        </div>

        {/* Top Sellers */}
        {activeTab === 'sellers' && (
          <div className="space-y-4">
            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {topSellers.slice(0, 3).map((seller, index) => (
                <div
                  key={seller.id}
                  className={`bg-slate-800 rounded-lg p-6 text-center relative ${
                    index === 0 ? 'md:order-2 transform md:scale-105' : 
                    index === 1 ? 'md:order-1' : 'md:order-3'
                  }`}
                >
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    {getRankIcon(index)}
                  </div>
                  
                  <div className="mt-4">
                    <img
                      src={seller.avatar}
                      alt={seller.name}
                      className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
                    />
                    <h3 className="font-bold text-white mb-1">{seller.name}</h3>
                    <div className={`text-sm font-medium mb-2 ${getLevelColor(seller.level)}`}>
                      {seller.level} Seller
                    </div>
                    <div className="text-2xl font-bold text-teal-400 mb-1">
                      {seller.points.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">points</div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-white">{seller.rating}</span>
                      </div>
                      <div className="text-xs text-gray-400">{seller.sales} sales</div>
                      <div className="text-xs text-gray-500">{seller.location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Rest of the list */}
            <div className="space-y-3">
              {topSellers.slice(3).map((seller, index) => (
                <div key={seller.id} className="bg-slate-800 rounded-lg p-4 flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8">
                    <span className="text-lg font-bold text-gray-400">#{index + 4}</span>
                  </div>
                  
                  <img
                    src={seller.avatar}
                    alt={seller.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-white">{seller.name}</h3>
                      <span className={`text-xs ${getLevelColor(seller.level)}`}>
                        {seller.level}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{seller.location}</span>
                      <span>•</span>
                      <span>{seller.category}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{seller.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-teal-400">
                      {seller.points.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">{seller.sales} sales</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Categories */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topCategories.map((category, index) => (
              <div key={category.name} className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h3 className="font-medium text-white">{category.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">#{index + 1}</span>
                        <span className="text-xs text-green-400">{category.growth}</span>
                      </div>
                    </div>
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                
                <div className="text-2xl font-bold text-teal-400 mb-1">
                  {category.sales.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">total sales</div>
              </div>
            ))}
          </div>
        )}

        {/* Top Locations */}
        {activeTab === 'locations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topLocations.map((location, index) => (
              <div key={location.name} className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{location.icon}</span>
                    <div>
                      <h3 className="font-medium text-white">{location.name}</h3>
                      <span className="text-xs text-gray-400">#{index + 1}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-teal-400">
                      {location.sales.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">sales</div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-300">
                  {location.sellers} active sellers
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;