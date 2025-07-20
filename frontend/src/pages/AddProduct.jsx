import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'react-toastify';

// Fix marker icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { GFG_ROUTES } from '../gfgRoutes/gfgRoutes';
import axios from 'axios';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const AddProduct = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    whyIamSharing: '',
    address: {
      street: '',
      city: '',
      state: '',
      pinCode: '',
      country: '',
    },
  });
  const [isLoading,setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef();
  const { user } = useAuth();
  const { addPoints } = useUserProfile();
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.error(err)
    );
  }, []);

  const categories = [
    'Electronics',
    'Furniture',
    'Books',
    'Clothing',
    'Home & Garden',
    'Sports',
    'Toys',
    'Others',
  ];

  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.address) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (files) => {
    if (images.length + files.length > 5) {
      alert('You can only upload up to 5 images');
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              url: e.target.result,
              file: file,
            },
          ]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleMarkerDrag = (e) => {
    const { lat, lng } = e.target.getLatLng();
    setPosition([lat, lng]);
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
  
    if (!user) {
      navigate('/login');
      return;
    }
  
    if (images.length === 0) {
      alert('Please upload at least one image');
      setIsLoading(false);
      return;
    }
  
    const formPayload = new FormData();
    formPayload.append("title", formData.title);
    formPayload.append("description", formData.description);
    formPayload.append("category", formData.category);
    formPayload.append("condition", formData.condition);
    formPayload.append("whyIamSharing", formData.whyIamSharing);
    formPayload.append("postedBy", user._id);
    formPayload.append("address", JSON.stringify(formData.address));
    formPayload.append("location", JSON.stringify({ type: "Point", coordinates: [position[1], position[0]] }));
  
    images.forEach((imageObj) => {
      formPayload.append("images", imageObj.file); // correctly append file, not the object
    });
  
    try {
      const response = await axios.post(
        `${GFG_ROUTES.ADDITEM}`,
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`, // or however you store the token
          },
        }
      );
      console.log(response);
      toast.success("Item uploaded successfully");
      setIsLoading(false);
      navigate("/"); // Redirect after successful upload
    } catch (error) {
     
      toast.error("Something went wrong");
      console.error("Upload error", error);
    }finally{
      setIsLoading(false);
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
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-slate-900 bg-opacity-90 flex flex-col items-center justify-center z-50">
        <svg className="animate-spin h-16 w-16 text-teal-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#0D9488" strokeWidth="4"></circle>
          <path className="opacity-75" fill="#0D9488" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <p className="text-white text-xl">Uploading your product...</p>
      </div>
    );
  }

  return (
   
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-slate-800 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Add New Product</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white"
                  placeholder="Enter product title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white"
                placeholder="Describe the item you're sharing"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Why I'm Sharing This</label>
              <input
                type="text"
                name="whyIamSharing"
                value={formData.whyIamSharing}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white"
                placeholder="Optional explanation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white"
              >
                <option value="">Select condition</option>
                {conditions.map((cond) => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['street', 'city', 'state', 'pinCode', 'country'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData.address[field]}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white"
                    placeholder={`Enter ${field}`}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Location on Map</label>
              <div className="h-64 w-full md:h-72 rounded-lg overflow-hidden border border-slate-600">
                {position && (
                  <MapContainer center={position} zoom={13} scrollWheelZoom={true} className="h-full w-full">
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    <MapClickHandler />
                    <Marker position={position} draggable={true} eventHandlers={{ dragend: handleMarkerDrag }} />
                  </MapContainer>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img) => (
                <div key={img.id} className="relative border border-slate-600 rounded-lg overflow-hidden">
                  <img src={img.url} alt="Upload Preview" className="w-full h-32 object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="absolute top-1 right-1 bg-slate-800 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Select Images (max 5)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                capture="environment" 
                onChange={(e) => handleImageUpload(e.target.files)}
                ref={fileInputRef}
                className="block w-full text-sm text-gray-300 border border-slate-600 rounded-lg cursor-pointer bg-slate-800"
              />
            </div>

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
