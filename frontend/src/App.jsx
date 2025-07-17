import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Login from './pages/Login';
import AddProduct from './pages/AddProduct';
import ProductDetails from './pages/ProductDetails';
import Favorites from './pages/Favorites';
import UserProfile from './pages/UserProfile';
import SuccessStories from './pages/SuccessStories';
import Leaderboard from './pages/Leaderboard';
import { AuthProvider } from './contexts/AuthContext';
import { LocationProvider } from './contexts/LocationContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { UserProfileProvider } from './contexts/UserProfileContext';
import { ChatbotProvider } from './contexts/ChatbotContext';
import { SuccessStoriesProvider } from './contexts/SuccessStoriesContext';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <FavoritesProvider>
          <UserProfileProvider>
            <ChatbotProvider>
              <SuccessStoriesProvider>
                <Router>
                  <div className="min-h-screen bg-slate-900 text-white">
                    <Header />
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/chat" element={<Chat />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/add-product" element={<AddProduct />} />
                      <Route path="/product/:id" element={<ProductDetails />} />
                      <Route path="/favorites" element={<Favorites />} />
                      <Route path="/profile/:userId" element={<UserProfile />} />
                      <Route path="/profile" element={<UserProfile />} />
                      <Route path="/success-stories" element={<SuccessStories />} />
                      <Route path="/leaderboard" element={<Leaderboard />} />
                    </Routes>
                    <Chatbot />
                  </div>
                </Router>
              </SuccessStoriesProvider>
            </ChatbotProvider>
          </UserProfileProvider>
        </FavoritesProvider>
      </LocationProvider>
    </AuthProvider>
  );
}

export default App;