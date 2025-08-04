import React, { useState, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import { useLocation } from '../contexts/LocationContext';
import { GFG_ROUTES } from "../gfgRoutes/gfgRoutes";
import { toast } from 'react-toastify';
import axios from 'axios';
import Footer from '../components/Footer';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const { location, coordinates } = useLocation();

  const fetchProducts = async (pageNum = 1, isLoadMore = false) => {
    if (!isLoadMore) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await axios.get(GFG_ROUTES.SEARCHITEMS, {
        params: {
          page: pageNum,
          limit: 12,
          sortBy,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          title: searchQuery.trim() || undefined,
          lat: sortBy === 'nearest' && coordinates ? coordinates[1] : undefined,
          lng: sortBy === 'nearest' && coordinates ? coordinates[0] : undefined,
        },
      });

      const data = response.data;

      if (isLoadMore) {
        setProducts(prev => [...prev, ...data.items]);
      } else {
        setProducts(data.items);
      }

      setTotalPages(data.totalPages);
      setHasMore(pageNum < data.totalPages);
      setPage(pageNum);

    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchProducts(1, false);
  }, [selectedCategory, searchQuery, sortBy, coordinates]);

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      fetchProducts(page + 1, true);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <>
      {loading && (
        <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
          <Loader2 className="w-8 h-8 animate-spin text-[#14b8a6]" />
        </div>
      )}
    <div className="min-h-screen bg-[#0f172a]">
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Fresh recommendations</h1>
          <div className="flex items-center space-x-2 text-[#94a3b8]">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Near {location}</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="bg-[#1e293b] rounded-lg p-4 animate-pulse">
                <div className="aspect-square bg-[#334155] rounded-lg mb-4"></div>
                <div className="h-4 bg-[#334155] rounded mb-2"></div>
                <div className="h-3 bg-[#334155] rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-[#334155] rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {products.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-[#334155] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📦</span>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">No products found</h3>
                <p className="text-[#94a3b8]">Try adjusting your search or filters</p>
              </div>
            )}

            {hasMore && products.length > 0 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-[#14b8a6] hover:bg-[#0d9488] disabled:bg-[#475569] px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>Load More</span>
                  )}
                </button>
              </div>
            )}

            {!hasMore && products.length > 0 && (
              <div className="text-center py-8">
                <p className="text-[#94a3b8]">No more products to load</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Home;
