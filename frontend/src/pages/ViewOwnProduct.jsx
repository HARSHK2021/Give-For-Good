import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Flag,
  Trash2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { useUserProfile } from "../contexts/UserProfileContext";
import { GFG_ROUTES } from "../gfgRoutes/gfgRoutes";
import axios from "axios";
import { toast } from "react-toastify";
const ViewOwnProduct = () => {
  const { id, userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [deleting , setDeleting] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${GFG_ROUTES.GETITEMDETAILS(id)}`);
      if (response.data.success) {
        setProduct(response.data.item);

        setCurrentImageIndex(0);
      } else {
        console.error("Failed to fetch product details");
        setProduct(null);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
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

  const handleDelete = async () => {
    setDeleting(true);
    const token = localStorage.getItem("token");

    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const res = await axios.delete(`${GFG_ROUTES.DELETEITEM(id)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        toast.success("Product deleted successfully");
        setDeleting(false);
        navigate("/");
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Delete error:", error);
        setDeleting(false);
      alert("Error deleting product.");
    }
  };
   const handleChatClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/chat?productId=${product._id}&sellerId=${product.postedBy}`);
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
  if( deleting){
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Deleting product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Product not found
          </h2>
          <button
            onClick={() => navigate("/")}
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
              {product.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 px-3 py-1 rounded-full text-white text-sm">
                  {currentImageIndex + 1} / {product.images.length}
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-[#14b8a6]"
                        : "border-slate-600 hover:border-slate-500"
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
            <div className="bg-slate-800 rounded-lg p-6">
              <h1 className="text-3xl font-bold text-[#14b8a6] mb-3">
                {product.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {product.address.street}, {product.address.city}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(product.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Description
              </h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line text-base">
                {product.description}
              </p>
            </div>

            {/* Condition */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Condition
              </h3>
              <span className="inline-block bg-[#14b8a6] text-white px-3 py-1 rounded-full text-sm">
                {product.condition}
              </span>
            </div>

            {/* Why I am Sharing */}
            {product.whyIamSharing && (
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold  text-white mb-3">
                  Why I am sharing
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {product.whyIamSharing}
                </p>
              </div>
            )}
            { userId !== user._id && (
              <div className="bg-slate-800 rounded-lg p-6 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <User className="w-6 h-6 text-[#14b8a6]" />
                  <span className="text-white font-semibold">
                    {product.postedBy.name}
                  </span>
                </div>
                <button
                  onClick={handleChatClick}
                  className="bg-[#14b8a6] hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat</span>
                </button>
              </div>
            )}
          
            {userId === user._id && (
              <div className="bg-slate-800 rounded-lg p-6 flex justify-center items-center">
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Delete Product</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOwnProduct;
