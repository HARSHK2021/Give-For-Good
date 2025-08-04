import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Recycle, Shield, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-800 border-t border-slate-700 mt-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Motive Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-8 h-8 text-teal-400" />
              <h3 className="text-2xl font-bold text-white">Giive for Good</h3>
            </div>
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-teal-400 mb-3">Our Mission</h4>
              <p className="text-gray-300 leading-relaxed mb-4">
                Building a sustainable community where giving, sharing, and caring come together. 
                Giive for Good is more than a marketplace - it's a movement towards reducing waste, 
                helping neighbors, and creating meaningful connections.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Recycle className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-gray-300">Reduce Waste</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-gray-300">Help Community</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  <span className="text-sm text-gray-300">Spread Kindness</span>
                </div>
              </div>
              
              <blockquote className="border-l-4 border-teal-400 pl-4 italic text-gray-400">
                "Every item shared is a step towards a more sustainable future. 
                Every connection made strengthens our community."
              </blockquote>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Browse Products
                </Link>
              </li>
              <li>
                <Link to="/add-product" className="text-gray-300 hover:text-teal-400 transition-colors">
                  List an Item
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Community Leaders
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Messages
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-300 hover:text-teal-400 transition-colors">
                  My Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Support & Info</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Safety Guidelines
                </a>
              </li>
              <li>
                <Link to="/community-rules" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Community Rules
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="border-t border-slate-700 pt-8 mt-8">
          <h4 className="text-lg font-semibold text-white mb-6 text-center">Our Community Impact</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-teal-400 mb-1">50+</div>
              <div className="text-sm text-gray-400">Items Shared</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400 mb-1">50+</div>
              <div className="text-sm text-gray-400">Happy Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400 mb-1">100+</div>
              <div className="text-sm text-gray-400">Cities Covered</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400 mb-1">₹00+</div>
              <div className="text-sm text-gray-400">Value Exchanged</div>
            </div>
          </div>
        </div>

        {/* Contact & Social */}
        <div className="border-t border-slate-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="w-4 h-4" />
                <span className="text-sm">giiveforgood@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+91 7303325578</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Greater Noida, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Trust & Security */}
        <div className="border-t border-slate-700 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm text-gray-300">Secure Platform</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-300">Verified Community</span>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">
                Made with <Heart className="w-4 h-4 text-red-400 inline mx-1" /> by Harsh for a better tomorrow
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-900 border-t border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-gray-400">
              © 2024 Giive for Good. All rights reserved.
            </p>
            <p className="text-sm text-gray-400">
              Building communities, one share at a time.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;