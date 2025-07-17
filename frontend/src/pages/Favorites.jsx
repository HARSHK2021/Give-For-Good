import React from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import ProductCard from '../components/ProductCard';

const Favorites = () => {
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-red-500" />
              <h1 className="text-xl font-bold text-white">My Favorites</h1>
              <span className="bg-slate-700 text-gray-300 px-2 py-1 rounded-full text-sm">
                {favorites.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No favorites yet</h3>
            <p className="text-gray-400 mb-6">Start adding products to your favorites to see them here</p>
            <button
              onClick={() => navigate('/')}
              className="bg-teal-500 hover:bg-teal-600 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;