import React, { useState } from 'react';
import { ArrowLeft, Plus, Heart, Star, Calendar, Award, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSuccessStories } from '../contexts/SuccessStoriesContext';
import { useUserProfile } from '../contexts/UserProfileContext';

const SuccessStories = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stories, userStories, addStory, likeStory, deleteStory } = useSuccessStories();
  const { addPoints } = useUserProfile();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    productTitle: '',
    productImage: '',
    rating: 5,
    category: ''
  });

  const categories = ['Electronics', 'Cars', 'Mobile Phones', 'Furniture', 'Books', 'Sports', 'Others'];

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newStory = {
      ...formData,
      product: {
        title: formData.productTitle,
        image: formData.productImage || 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?w=300'
      }
    };

    addStory(newStory);
    addPoints(50, 'Shared success story');
    
    setFormData({
      title: '',
      content: '',
      productTitle: '',
      productImage: '',
      rating: 5,
      category: ''
    });
    setShowAddForm(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const displayStories = activeTab === 'my' ? userStories : stories;

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
              <h1 className="text-xl font-bold text-white">Success Stories</h1>
            </div>
            
            {user && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Share Story</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-teal-500 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            All Stories ({stories.length})
          </button>
          {user && (
            <button
              onClick={() => setActiveTab('my')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'my'
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              My Stories ({userStories.length})
            </button>
          )}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayStories.map((story) => (
            <div key={story.id} className="bg-slate-800 rounded-lg overflow-hidden">
              {/* Product Image */}
              <img
                src={story.product.image}
                alt={story.product.title}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-6">
                {/* Story Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={story.author.avatar}
                      alt={story.author.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-white">{story.author.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-teal-400">{story.author.level}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">{formatDate(story.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {activeTab === 'my' && (
                    <button
                      onClick={() => deleteStory(story.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Story Content */}
                <h2 className="text-lg font-semibold text-white mb-2">{story.title}</h2>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{story.content}</p>

                {/* Product Info */}
                <div className="bg-slate-700 p-3 rounded-lg mb-4">
                  <p className="text-sm font-medium text-white mb-1">{story.product.title}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-slate-600 text-gray-300 px-2 py-1 rounded">
                      {story.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < story.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => likeStory(story.id)}
                    className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{story.likes}</span>
                  </button>
                  
                  <button className="text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors">
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayStories.length === 0 && (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">
              {activeTab === 'my' ? 'No stories shared yet' : 'No success stories yet'}
            </h3>
            <p className="text-gray-400 mb-6">
              {activeTab === 'my' 
                ? 'Share your first success story to inspire others!'
                : 'Be the first to share a success story!'
              }
            </p>
            {user && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-teal-500 hover:bg-teal-600 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Share Your Story
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Story Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Share Your Success Story</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Story Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., Found my dream car!"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Story *
                  </label>
                  <textarea
                    name="content"
                    required
                    value={formData.content}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Share your experience..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="productTitle"
                    required
                    value={formData.productTitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="What did you buy/sell?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rating *
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, rating }))}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            rating <= formData.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-slate-600 rounded-lg text-gray-300 hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Share Story
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuccessStories;