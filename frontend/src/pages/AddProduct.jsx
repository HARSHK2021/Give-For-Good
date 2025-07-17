import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, MapPin, Camera, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';
import { useUserProfile } from '../contexts/UserProfileContext';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    condition: ''
  });
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const { user } = useAuth();
  const { location } = useLocation();
  const { addPoints } = useUserProfile();
  const navigate = useNavigate();

  const categories = [
    'Electronics',
    'Cars',
    'Mobile Phones',
    'Furniture',
    'Books',
    'Clothing',
    'Home & Garden',
    'Sports',
    'Others'
  ];

  const conditions = [
    'New',
    'Like New',
    'Good',
    'Fair',
    'Poor'
  ];

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageUpload = (files) => {
    if (images.length + files.length > 5) {
      alert('You can only upload up to 5 images');
      return;
    }

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages(prev => [...prev, {
            id: Date.now() + Math.random(),
            url: e.target.result,
            file: file
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (images.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    const productData = {
      ...formData,
      images: images.map(img => img.url),
      location: location,
      postedBy: user.id,
      createdAt: new Date().toISOString()
    };

    console.log('Product data:', productData);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      addPoints(25, 'Listed a product');
      alert('Product added successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Login Required</h2>
          <p className="text-gray-400 mb-6">Please login to add a product</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-teal-500 hover:bg-teal-600 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-slate-800 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Add New Product</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Images Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Product Images (Max 5)
              </label>
              
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive
                    ? 'border-teal-400 bg-teal-400 bg-opacity-10'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="flex flex-col items-center">
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-300 mb-2">Drag & drop images here, or click to select</p>
                  <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB each</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="mt-4 bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-lg cursor-pointer transition-colors"
                  >
                    Select Images
                  </label>
                </div>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative">
                      <img
                        src={image.url}
                        alt="Product"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter product title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price *
                </label>
                <input
                  type="text"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="₹ Enter price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Condition *
                </label>
                <select
                  name="condition"
                  required
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select condition</option>
                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Describe your product..."
              />
            </div>

            {/* Location */}
            <div className="bg-slate-700 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-5 h-5 text-teal-400" />
                <h3 className="font-medium text-white">Location</h3>
              </div>
              <p className="text-gray-300">{location}</p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-2 border border-slate-600 rounded-lg text-gray-300 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-teal-500 hover:bg-teal-600 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;