import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  useEffect(() => {
    // Update unread count whenever notifications change
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const loadNotifications = () => {
    const saved = localStorage.getItem(`notifications_${user.id}`);
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      // Create some mock notifications for demo
      const mockNotifications = [
        {
          id: '1',
          type: 'new_product',
          category: 'product',
          title: 'New iPhone 15 Pro Max Listed!',
          message: 'A new iPhone 15 Pro Max has been listed in your area for ₹1,20,000',
          productTitle: 'iPhone 15 Pro Max - Like New',
          actionUrl: '/product/123',
          read: false,
          createdAt: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
        },
        {
          id: '2',
          type: 'wishlist_claimed',
          category: 'product',
          title: 'Wishlist Item Claimed!',
          message: 'The MacBook Air M2 you favorited has been claimed by someone else',
          productTitle: 'MacBook Air M2 - Excellent Condition',
          actionUrl: '/favorites',
          read: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
          id: '3',
          type: 'points_earned',
          category: 'rewards',
          title: 'You Earned 50 Points! 🎉',
          message: 'Congratulations! You earned 50 points for listing a new product',
          read: false,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
        },
        {
          id: '4',
          type: 'nearby_product',
          category: 'product',
          title: 'New Product Near You',
          message: 'A Honda City 2020 has been listed just 2.5 km away from your location',
          productTitle: 'Honda City 2020 - Well Maintained',
          actionUrl: '/product/456',
          read: true,
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
        },
        {
          id: '5',
          type: 'new_follower',
          category: 'social',
          title: 'New Follower!',
          message: 'Priya Sharma started following you',
          actionUrl: '/profile/priya123',
          read: true,
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
        },
        {
          id: '6',
          type: 'level_up',
          category: 'rewards',
          title: 'Level Up! 🚀',
          message: 'Congratulations! You\'ve reached Silver level with 1,000 points',
          read: true,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
        },
        {
          id: '7',
          type: 'review_received',
          category: 'social',
          title: 'New Review Received',
          message: 'John Doe left you a 5-star review for the iPhone 13 Pro Max',
          actionUrl: '/profile',
          read: true,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        },
        {
          id: '8',
          type: 'referral_bonus',
          category: 'rewards',
          title: 'Referral Bonus! 💰',
          message: 'You earned 100 bonus points! Your friend joined using your referral code',
          read: true,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        }
      ];
      
      setNotifications(mockNotifications);
      saveNotifications(mockNotifications);
    }
  };

  const saveNotifications = (notificationList) => {
    if (user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notificationList));
    }
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      read: false,
      createdAt: new Date(),
      ...notification
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
    
    return newNotification;
  };

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );
    
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
  };

  const deleteNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(
      notification => notification.id !== notificationId
    );
    
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    if (user) {
      localStorage.removeItem(`notifications_${user.id}`);
    }
  };

  // Helper functions to create specific notification types
  const notifyNewProduct = (productData) => {
    return addNotification({
      type: 'new_product',
      category: 'product',
      title: `New ${productData.category} Listed!`,
      message: `A new ${productData.title} has been listed in your area for ${productData.price}`,
      productTitle: productData.title,
      actionUrl: `/product/${productData.id}`
    });
  };

  const notifyNearbyProduct = (productData, distance) => {
    return addNotification({
      type: 'nearby_product',
      category: 'product',
      title: 'New Product Near You',
      message: `A ${productData.title} has been listed just ${distance} km away from your location`,
      productTitle: productData.title,
      actionUrl: `/product/${productData.id}`
    });
  };

  const notifyWishlistClaimed = (productData) => {
    return addNotification({
      type: 'wishlist_claimed',
      category: 'product',
      title: 'Wishlist Item Claimed!',
      message: `The ${productData.title} you favorited has been claimed by someone else`,
      productTitle: productData.title,
      actionUrl: '/favorites'
    });
  };

  const notifyPointsEarned = (points, reason) => {
    return addNotification({
      type: 'points_earned',
      category: 'rewards',
      title: `You Earned ${points} Points! 🎉`,
      message: `Congratulations! You earned ${points} points for ${reason}`,
      actionUrl: '/profile'
    });
  };

  const notifyLevelUp = (newLevel, totalPoints) => {
    return addNotification({
      type: 'level_up',
      category: 'rewards',
      title: 'Level Up! 🚀',
      message: `Congratulations! You've reached ${newLevel} level with ${totalPoints} points`,
      actionUrl: '/profile'
    });
  };

  const notifyNewFollower = (followerData) => {
    return addNotification({
      type: 'new_follower',
      category: 'social',
      title: 'New Follower!',
      message: `${followerData.name} started following you`,
      actionUrl: `/profile/${followerData.id}`
    });
  };

  const notifyReviewReceived = (reviewData) => {
    return addNotification({
      type: 'review_received',
      category: 'social',
      title: 'New Review Received',
      message: `${reviewData.reviewerName} left you a ${reviewData.rating}-star review for the ${reviewData.productTitle}`,
      actionUrl: '/profile'
    });
  };

  const notifyReferralBonus = (points) => {
    return addNotification({
      type: 'referral_bonus',
      category: 'rewards',
      title: 'Referral Bonus! 💰',
      message: `You earned ${points} bonus points! Your friend joined using your referral code`,
      actionUrl: '/profile'
    });
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    // Helper functions
    notifyNewProduct,
    notifyNearbyProduct,
    notifyWishlistClaimed,
    notifyPointsEarned,
    notifyLevelUp,
    notifyNewFollower,
    notifyReviewReceived,
    notifyReferralBonus
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};