import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  MapPin, 
  Clock, 
  User, 
  MessageCircle, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight,
  Share2,
  Flag
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useUserProfile } from '../contexts/UserProfileContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const { followSeller, unfollowSeller, isFollowing, addPoints } = useUserProfile();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [seller, setSeller] = useState(null);

  const isFavorite = product && favorites.some(fav => fav._id === product._id);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with your actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProduct = {
        _id: id,
        title: "iPhone 13 Pro Max - Excellent Condition",
        description: "Selling my iPhone 13 Pro Max in excellent condition. Barely used, always kept in a case with screen protector. All original accessories included. No scratches or dents. Battery health is 98%. Reason for selling: upgrading to iPhone 15.",
        images: [
          "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?w=800",
          "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?w=800",
          "https://images.pexels.com/photos/1440727/pexels-photo-1440727.jpeg?w=800"
        ],
        category: "Mobile Phones",
        location: {
          type: "Point",
          coordinates: [77.504, 28.4744]
        },
        address: "Greater Noida, UP",
        postedBy: "user123",
        claimedBy: null,
        isClaimed: false,
        expiresAt: "2025-08-15T10:58:58.004Z",
        createdAt: "2025-07-16T10:58:58.011Z",
        updatedAt: "2025-07-16T10:58:58.011Z",
        price: "₹85,000"
      };

      const mockSeller = {
        _id: "user123",
        name: "John Doe",
        avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100",
        joinedDate: "2023-01-15",
        totalAds: 12,
        rating: 4.5
      };

      setProduct(mockProduct);
      setSeller(mockSeller);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFromFavorites(product._id);
    } else {
      addToFavorites(product);
      addPoints(10, 'Added to favorites');
    }
  };

  const handleChatClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/chat?productId=${product._id}&sellerId=${product.postedBy}`);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-teal-500 hover:bg-teal-600 px-6 py-2 rounded-lg transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Flag className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-slate-800 rounded-lg overflow-hidden">
              <img
                src={product.images[currentImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 px-3 py-1 rounded-full text-white text-sm">
                  {currentImageIndex + 1} / {product.images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex 
                        ? 'border-teal-500' 
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Price and Title */}
            <div>
              <div className="text-3xl font-bold text-white mb-2">
                {product.price || 'Free'}
              </div>
              <h1 className="text-2xl font-semibold text-gray-100 mb-4">
                {product.title}
              </h1>
              
              {/* Meta Info */}
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{product.address}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(product.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleChatClick}
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat with Owner</span>
              </button>
              <button
                onClick={handleFavoriteClick}
                className={`px-6 py-3 rounded-lg border-2 transition-all flex items-center justify-center ${
                  isFavorite
                    ? 'border-red-500 bg-red-500 text-white'
                    : 'border-slate-600 text-gray-300 hover:border-red-500 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Description */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Category */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Category</h3>
              <span className="inline-block bg-teal-500 text-white px-3 py-1 rounded-full text-sm">
                {product.category}
              </span>
            </div>

            {/* Seller Info */}
            {seller && (
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Seller Information</h3>
                <div className="flex items-center space-x-4">
                  <img
                    src={seller.avatar}
                    alt={seller.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{seller.name}</h4>
                    <p className="text-sm text-gray-400">
                      Member since {new Date(seller.joinedDate).getFullYear()}
                    </p>
                    <p className="text-sm text-gray-400">
                      {seller.totalAds} ads posted
                    </p>
                  </div>
                  <button
                    onClick={handleChatClick}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Contact
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;