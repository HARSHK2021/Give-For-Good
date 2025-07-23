import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Award, 
  Users, 
  Package, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Shield,
  UserPlus,
  UserMinus,
  MessageCircle,
  Trophy,
  Target,
  Gift,
  Edit,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../contexts/UserProfileContext';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { followSeller, unfollowSeller, isFollowing, userStats, userProfile, updateProfile } = useUserProfile();
  
  const [activeTab, setActiveTab] = useState('listings');
  const [showFollowers, setShowFollowers] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    phone: '',
    location: '',
    socialLinks: {
      facebook: '',
      instagram: ''
    }
  });

  // Mock user data - in real app, fetch from API based on userId
  const profileUser = userId ? {
    id: userId,
    name: 'Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=200',
    bio: 'Passionate seller of quality electronics and gadgets. Always honest about product conditions.',
    location: 'Mumbai, Maharashtra',
    phone: '+91 98765 43210',
    email: 'sarah.johnson@example.com',
    joinDate: '2023-03-20',
    isVerified: true,
    level: 'Gold',
    rating: 4.7,
    totalSales: 89,
    totalListings: 15,
    followers: 156,
    following: 78,
    badges: ['Verified Seller', 'Gold Member', '50+ Sales', 'Quick Responder'],
    socialLinks: {
      facebook: 'https://facebook.com/sarahjohnson',
      instagram: 'https://instagram.com/sarahjohnson'
    },
    businessInfo: {
      isBusinessSeller: false,
      businessName: '',
      businessType: ''
    }
  } : {
    ...userProfile,
    level: userStats?.level || 'Bronze',
    rating: userStats?.rating || 0,
    totalSales: userStats?.totalSales || 0,
    followers: userStats?.followers || 0,
    following: userStats?.following || 0,
    badges: userStats?.badges || []
  };

  const isOwnProfile = !userId || user?.id === profileUser?.id;
  const following = !isOwnProfile && isFollowing(profileUser?.id);

  React.useEffect(() => {
    if (isOwnProfile && userProfile) {
      setEditForm({
        name: userProfile.name || '',
        bio: userProfile.bio || '',
        phone: userProfile.phone || '',
        location: userProfile.location || '',
        socialLinks: {
          facebook: userProfile.socialLinks?.facebook || '',
          instagram: userProfile.socialLinks?.instagram || ''
        }
      });
    }
  }, [isOwnProfile, userProfile]);

  const handleFollowToggle = () => {
    if (following) {
      unfollowSeller(profileUser.id);
    } else {
      followSeller(profileUser.id, {
        name: profileUser.name,
        avatar: profileUser.avatar,
        level: profileUser.level
      });
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      updateProfile(editForm);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Platinum': return 'text-purple-400';
      case 'Gold': return 'text-yellow-400';
      case 'Silver': return 'text-gray-300';
      default: return 'text-orange-400';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'Platinum': return '💎';
      case 'Gold': return '🥇';
      case 'Silver': return '🥈';
      default: return '🥉';
    }
  };

  const mockListings = [
    {
      id: '1',
      title: 'iPhone 13 Pro Max',
      price: '₹85,000',
      image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?w=300',
      status: 'active'
    },
    {
      id: '2',
      title: 'MacBook Air M2',
      price: '₹95,000',
      image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?w=300',
      status: 'sold'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            {isOwnProfile && (
              <button
                onClick={handleEditToggle}
                className="flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-lg transition-colors"
              >
                {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                <span>{isEditing ? 'Save' : 'Edit Profile'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-lg p-6 space-y-6">
              {/* Avatar and Basic Info */}
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={profileUser?.avatar || 'https://via.placeholder.com/96'}
                    alt={profileUser?.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto"
                  />
                  {profileUser?.isVerified && (
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="mt-4 text-xl font-bold text-white bg-slate-700 border border-slate-600 rounded px-3 py-2 w-full text-center"
                    placeholder="Your name"
                  />
                ) : (
                  <h1 className="text-xl font-bold text-white mt-4">{profileUser?.name}</h1>
                )}
                
                <div className={`flex items-center justify-center space-x-2 mt-2 ${getLevelColor(profileUser?.level)}`}>
                  <span className="text-lg">{getLevelIcon(profileUser?.level)}</span>
                  <span className="font-medium">{profileUser?.level} Seller</span>
                </div>

                {isEditing ? (
                  <textarea
                    name="bio"
                    value={editForm.bio}
                    onChange={handleInputChange}
                    className="mt-3 text-gray-300 text-sm bg-slate-700 border border-slate-600 rounded px-3 py-2 w-full"
                    placeholder="Tell us about yourself..."
                    rows="3"
                  />
                ) : (
                  profileUser?.bio && (
                    <p className="text-gray-300 text-sm mt-3">{profileUser.bio}</p>
                  )
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{profileUser?.rating || 0}</div>
                  <div className="flex items-center justify-center space-x-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(profileUser?.rating || 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-gray-400">Rating</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{profileUser?.totalSales || 0}</div>
                  <div className="text-xs text-gray-400">Sales</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{profileUser?.followers || 0}</div>
                  <div className="text-xs text-gray-400">Followers</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{profileUser?.following || 0}</div>
                  <div className="text-xs text-gray-400">Following</div>
                </div>
              </div>

              {/* Action Buttons */}
              {!isOwnProfile && (
                <div className="space-y-3">
                  <button
                    onClick={handleFollowToggle}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                      following
                        ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        : 'bg-teal-500 text-white hover:bg-teal-600'
                    }`}
                  >
                    {following ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    <span>{following ? 'Unfollow' : 'Follow'}</span>
                  </button>
                  
                  <button className="w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Message</span>
                  </button>
                </div>
              )}

              {/* Contact Info */}
              <div className="space-y-3 pt-4 border-t border-slate-700">
                <div className="flex items-center space-x-3 text-gray-300">
                  <MapPin className="w-4 h-4" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={editForm.location}
                      onChange={handleInputChange}
                      className="text-sm bg-slate-700 border border-slate-600 rounded px-2 py-1 flex-1"
                      placeholder="Your location"
                    />
                  ) : (
                    <span className="text-sm">{profileUser?.location || 'Location not set'}</span>
                  )}
                </div>

                <div className="flex items-center space-x-3 text-gray-300">
                  <Phone className="w-4 h-4" />
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleInputChange}
                      className="text-sm bg-slate-700 border border-slate-600 rounded px-2 py-1 flex-1"
                      placeholder="Your phone number"
                    />
                  ) : (
                    <span className="text-sm">{profileUser?.phone || 'Phone not set'}</span>
                  )}
                </div>
                
                <div className="flex items-center space-x-3 text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Joined {new Date(profileUser?.joinDate || Date.now()).toLocaleDateString()}
                  </span>
                </div>

                {/* Social Links */}
                {isEditing && (
                  <div className="space-y-2">
                    <input
                      type="url"
                      name="socialLinks.facebook"
                      value={editForm.socialLinks.facebook}
                      onChange={handleInputChange}
                      className="w-full text-sm bg-slate-700 border border-slate-600 rounded px-2 py-1"
                      placeholder="Facebook URL"
                    />
                    <input
                      type="url"
                      name="socialLinks.instagram"
                      value={editForm.socialLinks.instagram}
                      onChange={handleInputChange}
                      className="w-full text-sm bg-slate-700 border border-slate-600 rounded px-2 py-1"
                      placeholder="Instagram URL"
                    />
                  </div>
                )}

                {profileUser?.businessInfo?.isBusinessSeller && (
                  <div className="bg-slate-700 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Package className="w-4 h-4 text-teal-400" />
                      <span className="text-sm font-medium text-white">Business Seller</span>
                    </div>
                    <p className="text-xs text-gray-300">{profileUser.businessInfo.businessName}</p>
                    <p className="text-xs text-gray-400">{profileUser.businessInfo.businessType}</p>
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="pt-4 border-t border-slate-700">
                <h3 className="text-sm font-medium text-white mb-3 flex items-center space-x-2">
                  <Award className="w-4 h-4" />
                  <span>Achievements</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(profileUser?.badges || []).map((badge, index) => (
                    <span
                      key={index}
                      className="bg-teal-500 bg-opacity-20 text-teal-300 px-2 py-1 rounded-full text-xs"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Gamification Stats */}
            {isOwnProfile && userStats && (
              <div className="bg-slate-800 rounded-lg p-6 mt-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span>Your Progress</span>
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">Points</span>
                      <span className="text-sm font-medium text-white">{userStats.points}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((userStats.points % 1000) / 10, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-white">{userStats.referredUsers}</div>
                      <div className="text-xs text-gray-400">Referrals</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">{userStats.badges.length}</div>
                      <div className="text-xs text-gray-400">Badges</div>
                    </div>
                  </div>

                  <div className="bg-slate-700 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Gift className="w-4 h-4 text-teal-400" />
                      <span className="text-sm font-medium text-white">Referral Code</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <code className="bg-slate-600 px-2 py-1 rounded text-sm text-teal-300">
                        {userStats.referralCode}
                      </code>
                      <button className="text-xs text-teal-400 hover:text-teal-300">
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-slate-800 rounded-lg">
              <div className="flex border-b border-slate-700">
                <button
                  onClick={() => setActiveTab('listings')}
                  className={`px-6 py-4 font-medium transition-colors ${
                    activeTab === 'listings'
                      ? 'text-teal-400 border-b-2 border-teal-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Listings ({profileUser?.totalListings || 0})
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-6 py-4 font-medium transition-colors ${
                    activeTab === 'reviews'
                      ? 'text-teal-400 border-b-2 border-teal-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Reviews
                </button>
                {isOwnProfile && (
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-6 py-4 font-medium transition-colors ${
                      activeTab === 'analytics'
                        ? 'text-teal-400 border-b-2 border-teal-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Analytics
                  </button>
                )}
              </div>

              <div className="p-6">
                {activeTab === 'listings' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockListings.map((listing) => (
                      <div key={listing.id} className="bg-slate-700 rounded-lg p-4">
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h3 className="font-medium text-white mb-1">{listing.title}</h3>
                        <p className="text-teal-400 font-bold mb-2">{listing.price}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          listing.status === 'active'
                            ? 'bg-green-500 bg-opacity-20 text-green-300'
                            : 'bg-red-500 bg-opacity-20 text-red-300'
                        }`}>
                          {listing.status === 'active' ? 'Active' : 'Sold'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">No reviews yet</h3>
                      <p className="text-gray-400">Reviews will appear here after transactions</p>
                    </div>
                  </div>
                )}

                {activeTab === 'analytics' && isOwnProfile && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-700 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Target className="w-5 h-5 text-teal-400" />
                          <span className="text-sm font-medium text-white">Profile Views</span>
                        </div>
                        <div className="text-2xl font-bold text-white">1,234</div>
                        <div className="text-xs text-green-400">+12% this week</div>
                      </div>
                      
                      <div className="bg-slate-700 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <MessageCircle className="w-5 h-5 text-blue-400" />
                          <span className="text-sm font-medium text-white">Messages</span>
                        </div>
                        <div className="text-2xl font-bold text-white">89</div>
                        <div className="text-xs text-green-400">+5% this week</div>
                      </div>
                      
                      <div className="bg-slate-700 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Users className="w-5 h-5 text-purple-400" />
                          <span className="text-sm font-medium text-white">New Followers</span>
                        </div>
                        <div className="text-2xl font-bold text-white">23</div>
                        <div className="text-xs text-green-400">+8% this week</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Edit Modal */}
      {isEditing && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => {
              setIsEditing(false);
              // Reset form to original values
              if (userProfile) {
                setEditForm({
                  name: userProfile.name || '',
                  bio: userProfile.bio || '',
                  phone: userProfile.phone || '',
                  location: userProfile.location || '',
                  socialLinks: {
                    facebook: userProfile.socialLinks?.facebook || '',
                    instagram: userProfile.socialLinks?.instagram || ''
                  }
                });
              }
            }}
            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;