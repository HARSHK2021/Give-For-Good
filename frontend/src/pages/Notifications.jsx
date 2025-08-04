import React, { useState } from 'react';
import { ArrowLeft, Bell, Check, Trash2, Settings, Filter, Heart, Package, Award, MapPin, Users, Star, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';

const Notifications = () => {
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications 
  } = useNotifications();
  
  const [filter, setFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  const filterOptions = [
    { id: 'all', name: 'All', count: notifications.length },
    { id: 'unread', name: 'Unread', count: unreadCount },
    { id: 'products', name: 'Products', count: notifications.filter(n => n.category === 'product').length },
    { id: 'social', name: 'Social', count: notifications.filter(n => n.category === 'social').length },
    { id: 'rewards', name: 'Rewards', count: notifications.filter(n => n.category === 'rewards').length }
  ];

  const getFilteredNotifications = () => {
    let filtered = notifications;
    
    switch (filter) {
      case 'unread':
        filtered = notifications.filter(n => !n.read);
        break;
      case 'products':
        filtered = notifications.filter(n => n.category === 'product');
        break;
      case 'social':
        filtered = notifications.filter(n => n.category === 'social');
        break;
      case 'rewards':
        filtered = notifications.filter(n => n.category === 'rewards');
        break;
      default:
        filtered = notifications;
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_product':
      case 'product_claimed':
      case 'product_expired':
        return <Package className="w-5 h-5" />;
      case 'wishlist_claimed':
        return <Heart className="w-5 h-5 text-red-400" />;
      case 'nearby_product':
        return <MapPin className="w-5 h-5 text-blue-400" />;
      case 'points_earned':
      case 'level_up':
        return <Award className="w-5 h-5 text-yellow-400" />;
      case 'new_follower':
      case 'user_followed':
        return <Users className="w-5 h-5 text-purple-400" />;
      case 'review_received':
        return <Star className="w-5 h-5 text-yellow-400" />;
      case 'referral_bonus':
        return <Gift className="w-5 h-5 text-green-400" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'wishlist_claimed':
        return 'border-l-red-400';
      case 'nearby_product':
        return 'border-l-blue-400';
      case 'points_earned':
      case 'level_up':
        return 'border-l-yellow-400';
      case 'new_follower':
      case 'user_followed':
        return 'border-l-purple-400';
      case 'review_received':
        return 'border-l-yellow-400';
      case 'referral_bonus':
        return 'border-l-green-400';
      default:
        return 'border-l-teal-400';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffTime = Math.abs(now - notificationDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notificationDate.toLocaleDateString();
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Navigate based on notification type
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const filteredNotifications = getFilteredNotifications();

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
                <Bell className="w-6 h-6 text-teal-400" />
                <h1 className="text-xl font-bold text-white">Notifications</h1>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-6 overflow-x-auto">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setFilter(option.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filter === option.id
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              <span>{option.name}</span>
              {option.count > 0 && (
                <span className="text-xs opacity-75">({option.count})</span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </h3>
              <p className="text-gray-400">
                {filter === 'unread' 
                  ? 'All caught up! Check back later for new updates.'
                  : 'We\'ll notify you when something interesting happens.'
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-slate-800 rounded-lg p-4 border-l-4 cursor-pointer hover:bg-slate-700 transition-all ${
                  getNotificationColor(notification.type)
                } ${!notification.read ? 'bg-opacity-80' : ''}`}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    !notification.read ? 'bg-teal-500 bg-opacity-20' : 'bg-slate-700'
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`font-medium mb-1 ${
                          !notification.read ? 'text-white' : 'text-gray-300'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-2">
                          {notification.message}
                        </p>
                        
                        {/* Additional Info */}
                        {notification.productTitle && (
                          <div className="bg-slate-700 p-2 rounded text-xs text-gray-300 mb-2">
                            Product: {notification.productTitle}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.createdAt)}
                          </span>
                          
                          {!notification.read && (
                            <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="text-gray-400 hover:text-teal-400 transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Clear All Button */}
        {notifications.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={clearAllNotifications}
              className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
            >
              Clear All Notifications
            </button>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Notification Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">New Products</span>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Nearby Products</span>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Wishlist Updates</span>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Points & Rewards</span>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Social Updates</span>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 border border-slate-600 rounded-lg text-gray-300 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;