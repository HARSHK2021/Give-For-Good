import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const UserProfileContext = createContext();

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

export const UserProfileProvider = ({ children }) => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [followedSellers, setFollowedSellers] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [userStats, setUserStats] = useState({
    level: 'Bronze',
    points: 0,
    badges: [],
    totalSales: 0,
    rating: 0,
    joinDate: new Date(),
    isVerified: false,
    referralCode: '',
    referredUsers: 0
  });

  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadFollowedSellers();
      loadUserStats();
    }
  }, [user]);

  const loadUserProfile = () => {
    const savedProfile = localStorage.getItem(`profile_${user.id}`);
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    } else {
      const defaultProfile = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: '',
        location: '',
        phone: '',
        socialLinks: {
          facebook: '',
          instagram: '',
          twitter: ''
        },
        businessInfo: {
          isBusinessSeller: false,
          businessName: '',
          businessType: '',
          gstNumber: ''
        },
        preferences: {
          showEmail: false,
          showPhone: false,
          emailNotifications: true,
          pushNotifications: true
        }
      };
      setUserProfile(defaultProfile);
      localStorage.setItem(`profile_${user.id}`, JSON.stringify(defaultProfile));
    }
  };

  const loadFollowedSellers = () => {
    const saved = localStorage.getItem(`followed_${user.id}`);
    if (saved) {
      setFollowedSellers(JSON.parse(saved));
    }
  };

  const loadUserStats = () => {
    const saved = localStorage.getItem(`stats_${user.id}`);
    if (saved) {
      setUserStats(JSON.parse(saved));
    } else {
      const defaultStats = {
        level: 'Bronze',
        points: 0,
        badges: ['New Member'],
        totalSales: 0,
        rating: 0,
        joinDate: new Date(),
        isVerified: false,
        referralCode: generateReferralCode(),
        referredUsers: 0
      };
      setUserStats(defaultStats);
      localStorage.setItem(`stats_${user.id}`, JSON.stringify(defaultStats));
    }
  };

  const generateReferralCode = () => {
    return `GIIVE${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  };

  const updateProfile = (updates) => {
    const updatedProfile = { ...userProfile, ...updates };
    setUserProfile(updatedProfile);
    localStorage.setItem(`profile_${user.id}`, JSON.stringify(updatedProfile));
  };

  const followSeller = (sellerId, sellerInfo) => {
    const newFollowed = [...followedSellers, { id: sellerId, ...sellerInfo, followedAt: new Date() }];
    setFollowedSellers(newFollowed);
    localStorage.setItem(`followed_${user.id}`, JSON.stringify(newFollowed));
    
    // Award points for following
    addPoints(5, 'Followed a seller');
  };

  const unfollowSeller = (sellerId) => {
    const newFollowed = followedSellers.filter(seller => seller.id !== sellerId);
    setFollowedSellers(newFollowed);
    localStorage.setItem(`followed_${user.id}`, JSON.stringify(newFollowed));
  };

  const isFollowing = (sellerId) => {
    return followedSellers.some(seller => seller.id === sellerId);
  };

  const addPoints = (points, reason) => {
    const newStats = {
      ...userStats,
      points: userStats.points + points
    };

    // Check for level up
    const newLevel = calculateLevel(newStats.points);
    if (newLevel !== userStats.level) {
      newStats.level = newLevel;
      newStats.badges = [...userStats.badges, `${newLevel} Seller`];
    }

    // Check for new badges
    checkForNewBadges(newStats, reason);

    setUserStats(newStats);
    localStorage.setItem(`stats_${user.id}`, JSON.stringify(newStats));
  };

  const calculateLevel = (points) => {
    if (points >= 10000) return 'Platinum';
    if (points >= 5000) return 'Gold';
    if (points >= 1000) return 'Silver';
    return 'Bronze';
  };

  const checkForNewBadges = (stats, reason) => {
    const badges = [...stats.badges];
    
    if (stats.points >= 100 && !badges.includes('First 100 Points')) {
      badges.push('First 100 Points');
    }
    if (stats.totalSales >= 10 && !badges.includes('10 Sales')) {
      badges.push('10 Sales');
    }
    if (stats.referredUsers >= 5 && !badges.includes('Referral Master')) {
      badges.push('Referral Master');
    }
    if (followedSellers.length >= 10 && !badges.includes('Social Butterfly')) {
      badges.push('Social Butterfly');
    }

    stats.badges = badges;
  };

  const processReferral = (referralCode) => {
    // Award points to both referrer and referee
    addPoints(100, 'Used referral code');
    
    // Find and reward referrer (in real app, this would be an API call)
    const referrerStats = { ...userStats, referredUsers: userStats.referredUsers + 1 };
    // This would normally update the referrer's stats via API
  };

  const value = {
    userProfile,
    followedSellers,
    followers,
    userStats,
    updateProfile,
    followSeller,
    unfollowSeller,
    isFollowing,
    addPoints,
    processReferral
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};