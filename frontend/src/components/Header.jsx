import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, MapPin, MessageCircle, Heart, User, Plus, ChevronDown, Navigation, Trophy, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation as useLocationContext } from '../contexts/LocationContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useUserProfile } from '../contexts/UserProfileContext';

const Header = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const { userStats } = useUserProfile();
  const navigate = useNavigate();
  const currentPath = useLocation();


  return (
    <header className="bg-slate-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-teal-400">
            Giive for Good
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center justify-end flex-1 max-w-2xl mx-8">
            {/* Spacer for centered logo */}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search */}
            <button className="md:hidden">
              <Search className="w-6 h-6" />
            </button>

            {/* Chat */}
            <Link to="/chat" className="hover:text-teal-400 transition-colors">
              <MessageCircle className="w-6 h-6" />
            </Link>

            {/* Favorites */}
            <Link 
              to="/favorites" 
              className="hover:text-teal-400 transition-colors relative"
            >
              <Heart className="w-6 h-6" />
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Success Stories */}
            <Link 
              to="/success-stories" 
              className="hover:text-teal-400 transition-colors hidden md:block"
              title="Success Stories"
            >
              <Award className="w-6 h-6" />
            </Link>

            {/* Leaderboard */}
            <Link 
              to="/leaderboard" 
              className="hover:text-teal-400 transition-colors hidden md:block"
              title="Leaderboard"
            >
              <Trophy className="w-6 h-6" />
            </Link>

            {/* User Account */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 hover:text-teal-400 transition-colors"
                >
                  <img
                    src={user.avatar || 'https://via.placeholder.com/32'}
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-teal-400">{userStats?.level || 'Bronze'}</div>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-1 bg-slate-700 rounded-lg shadow-xl w-48 z-10">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm hover:bg-slate-600 transition-colors"
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/success-stories"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm hover:bg-slate-600 transition-colors md:hidden"
                      >
                        Success Stories
                      </Link>
                      <Link
                        to="/leaderboard"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm hover:bg-slate-600 transition-colors md:hidden"
                      >
                        Leaderboard
                      </Link>
                      <div className="border-t border-slate-600 my-2"></div>
                      <div className="px-4 py-2 text-xs text-gray-400">
                        Points: {userStats?.points || 0}
                      </div>
                      <div className="border-t border-slate-600 my-2"></div>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-600 transition-colors text-red-400"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hover:text-teal-400 transition-colors"
              >
                <User className="w-6 h-6" />
              </Link>
            )}

            {/* Sell Button */}
            <Link
              to="/add-product"
              className="bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">SELL</span>
            </Link>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;