import axios from 'axios';
import { ChevronsRightLeft } from 'lucide-react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { GFG_ROUTES } from '../gfgRoutes/gfgRoutes';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Load favorites from backend or localStorage

    const token = localStorage.getItem('token');
    const fetchFavorites = async () => {
      if (!token) {
        console.error('No token found, user might not be logged in');
        return;
      }

      try {
        const response = await axios.get(GFG_ROUTES.GETFAVORITES, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setFavorites(response.data.favorites);
          localStorage.setItem('favorites', JSON.stringify(response.data.favorites));
        } else {
          console.error('Failed to fetch favorites:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    }
    fetchFavorites();
  
   
  }, []);

  const addToFavorites = async(product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, user might not be logged in');
      return;
    }
    console.log("token", token);
    //// call an api which add prduct to favorites
    const response = await axios.post(GFG_ROUTES.ADDFAVORITES,{
      itemId: product._id
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if(response.data.success) {
      console.log("Product added to favorites", product._id);
          const newFavorites = [...favorites, product];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    }

  };

  const removeFromFavorites = async(productId) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(GFG_ROUTES.REMOVEFAVORITES, {
      itemId: productId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if(response.data.success) {
      console.log("Product removed from favorites", productId);
      const newFavorites = favorites.filter(fav => fav._id !== productId);
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));

    }
   
  };

  const isFavorite = (productId) => {
    return favorites.some(fav => fav._id === productId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};