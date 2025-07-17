import React, { useState } from 'react';
import { ChevronDown, Search, SlidersHorizontal, MapPin, Navigation } from 'lucide-react';
import { useLocation } from '../contexts/LocationContext';

const CategoryFilter = ({ 
  selectedCategory, 
  onCategoryChange, 
  searchQuery, 
  onSearchChange,
  sortBy,
  onSortChange 
}) => {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const { location, setLocation, getCurrentLocation } = useLocation();

  const categories = [
    { id: 'all', name: 'All Categories', count: null },
    { id: 'Cars', name: 'Cars', count: '52,252' },
    { id: 'Mobile Phones', name: 'Mobile Phones', count: '1,234' },
    { id: 'Electronics', name: 'Electronics', count: '5,678' },
    { id: 'Furniture', name: 'Furniture', count: '891' },
    { id: 'Books', name: 'Books', count: '445' },
    { id: 'others', name: 'Others', count: '1,123' },
  ];

  const sortOptions = [
    { id: 'newest', name: 'Newest First' },
    { id: 'nearest', name: 'Nearest First' },
    { id: 'oldest', name: 'Oldest First' }
  ];

  const popularLocations = [
    'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Search is handled by the onChange event
  };

  const handleLocationSelect = (newLocation) => {
    setLocation(newLocation);
    setShowLocationDropdown(false);
  };

  const handleUseCurrentLocation = async () => {
    try {
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);
      setShowLocationDropdown(false);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  return (
    <div className="bg-slate-800 border-b border-slate-700 sticky top-16 z-40">
      <div className="container mx-auto px-4">
        {/* Search Bar and Filters */}
        <div className="py-4 border-b border-slate-700">
          <form onSubmit={handleSearchSubmit} className="flex items-center space-x-4">
            {/* Location Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="flex items-center space-x-2 bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors whitespace-nowrap"
              >
                <MapPin className="w-4 h-4" />
                <span className="text-sm truncate max-w-32">{location}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showLocationDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-slate-700 rounded-lg shadow-xl w-80 z-10">
                  <div className="p-3 border-b border-slate-600">
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      className="flex items-center space-x-2 text-teal-400 hover:text-teal-300 transition-colors"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Use current location</span>
                    </button>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Popular Locations</h3>
                    <div className="space-y-1">
                      {popularLocations.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => handleLocationSelect(loc)}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-600 rounded transition-colors"
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
            
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center space-x-2 bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-sm">
                  {sortOptions.find(opt => opt.id === sortBy)?.name || 'Sort'}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showSortDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-slate-700 rounded-lg shadow-xl w-48 z-10">
                  <div className="py-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          onSortChange(option.id);
                          setShowSortDropdown(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-600 transition-colors ${
                          sortBy === option.id ? 'text-teal-400' : 'text-white'
                        }`}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Categories */}
        <div className="flex items-center py-4 space-x-6 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              <span className="font-medium">{category.name}</span>
              {category.count && (
                <span className="text-xs opacity-75">({category.count})</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;