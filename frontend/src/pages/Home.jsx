import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Clock, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import { useLocation } from '../contexts/LocationContext';

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
      const params = new URLSearchParams({
        page: pageNum,
        limit: 12,
        sortBy: sortBy
      });

      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }

      if (searchQuery.trim()) {
        params.append('title', searchQuery.trim());
      }

      if (sortBy === 'nearest' && coordinates) {
        params.append('lat', coordinates[1]);
        params.append('lng', coordinates[0]);
      }

      // Mock API call - replace with your actual API endpoint
      const response = await mockApiCall(params);
      
      if (isLoadMore) {
        setProducts(prev => [...prev, ...response.items]);
      } else {
        setProducts(response.items);
      }

      setTotalPages(response.totalPages);
      setHasMore(pageNum < response.totalPages);
      setPage(pageNum);

    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Mock API call - replace with your actual API
  const mockApiCall = async (params) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const pageNum = parseInt(params.get('page')) || 1;
    const limit = parseInt(params.get('limit')) || 12;
    const category = params.get('category');
    const title = params.get('title');
    const sortBy = params.get('sortBy');

    // Mock data based on your JSON structure
    const mockItems = Array.from({ length: limit }, (_, index) => {
      const id = (pageNum - 1) * limit + index + 1;
      return {
        _id: `item_${id}`,
        title: title ? `${title} Product ${id}` : `Product ${id}`,
        description: `Great condition product ${id}. Perfect for daily use.`,
        images: [
          `https://images.pexels.com/photos/${788946 + (id % 20)}/pexels-photo-${788946 + (id % 20)}.jpeg?w=400`
        ],
        category: category || ['Electronics', 'Cars', 'Mobile Phones', 'Furniture', 'Books', 'others'][id % 6],
        location: {
          type: "Point",
          coordinates: [77.504 + (id * 0.01), 28.4744 + (id * 0.01)]
        },
        address: ['Greater Noida', 'Delhi', 'Noida', 'Gurgaon', 'Faridabad'][id % 5],
        postedBy: `user_${id}`,
        claimedBy: null,
        isClaimed: false,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - (id * 24 * 60 * 60 * 1000)).toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
        price: `₹${(Math.random() * 100000).toFixed(0)}`
      };
    });

    // Filter by category if specified
    let filteredItems = mockItems;
    if (category && category !== 'all') {
      filteredItems = mockItems.filter(item => item.category === category);
    }

    // Filter by title if specified
    if (title) {
      filteredItems = filteredItems.filter(item => 
        item.title.toLowerCase().includes(title.toLowerCase())
      );
    }

    // Sort items
    if (sortBy === 'newest') {
      filteredItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const totalItems = Math.max(filteredItems.length, 50); // Mock total
    const totalPages = Math.ceil(totalItems / limit);

    return {
      page: pageNum,
      totalPages,
      items: filteredItems
    };
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
    <div className="min-h-screen bg-slate-900">
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
          <h1 className="text-2xl font-bold text-white">
            Fresh recommendations
          </h1>
          <div className="flex items-center space-x-2 text-gray-400">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Near {location}</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="bg-slate-800 rounded-lg p-4 animate-pulse">
                <div className="aspect-square bg-slate-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-slate-700 rounded mb-2"></div>
                <div className="h-3 bg-slate-700 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-slate-700 rounded w-1/2"></div>
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
                <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📦</span>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">No products found</h3>
                <p className="text-gray-400">Try adjusting your search or filters</p>
              </div>
            )}

            {hasMore && products.length > 0 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
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
                <p className="text-gray-400">No more products to load</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;