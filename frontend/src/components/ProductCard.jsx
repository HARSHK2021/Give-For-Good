import React, { useState } from 'react';
import { Heart, MapPin, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const {user} = useAuth();
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  
  const isFavorite = favorites.some(fav => fav._id === product._id);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please log in to add favorites');
      return;
    }
  

    if (isFavorite) {
      removeFromFavorites(product._id);
    } else {
      addToFavorites(product);
    }
  };

  const handleAvatarClick = (e) => {
    e.stopPropagation();
    if (product.postedBy) {
      navigate(`/profile/${product.postedBy}`);
    }
  };
  return (
    <div 
      onClick={handleCardClick}
      className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-slate-700">
        {!imageError && product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.title}
            onError={handleImageError}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <User className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-400 text-sm">No image</p>
            </div>
          </div>
        )}
        
        {/* Heart Icon */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center hover:bg-opacity-30 transition-all"
        >
          <Heart
            className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500 scale-150 ' : 'text-white '}`}
          />
        </button>

        {/* Featured Badge */}
        {/* {product.featured && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-medium">
            FEATURED
          </div>
        )} */}

        {/* Claimed Badge */}
        {product.isClaimed && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
            CLAIMED
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="text-xl font-bold text-white mb-2">
          {product.price || 'Free'}
        </div>

        {/* Title */}
        <h3 className="text-gray-100 font-medium mb-2 line-clamp-2">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Location and Date */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <MapPin className="w-3 h-3" />
            <span>{product.address.city}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{formatDate(product.createdAt)}</span>
          </div>
        </div>

        {/* Category */}
        <div className="mt-2">
          <span className="inline-block bg-slate-700 text-gray-300 px-2 py-1 rounded text-xs">
            {product.category}
          </span>
        </div>

        {/* Seller Info */}
        <div className="mt-3 pt-3 border-t border-slate-700">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleAvatarClick}
              className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center hover:bg-slate-500 transition-colors"
            >
              <User className="w-3 h-3 text-gray-300" />
            </button>
            <span className="text-xs text-gray-400">View seller profile</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;