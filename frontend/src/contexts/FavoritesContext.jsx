import axios from 'axios';
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
    const fetchFavorites = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(GFG_ROUTES.GETFAVORITES, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setFavorites(response.data.favorites || []);
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      }
    }
    fetchFavorites();
   
  }, []);

  const addToFavorites = async(productId,userId) => {
    /// lets call a api to add to 
    const token = localStorage.getItem('token');
    console.log(token);

    const response = await axios.post(GFG_ROUTES.ADDFAVORITES, {
      itemId: productId,
      userId: userId
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response);
    if (response.status !== 200) {
      throw new Error('Failed to add to favorites');
    }
    console.log(response.data.favorites);
    setFavorites(response.data.favorites);
    localStorage.setItem('favorites', JSON.stringify(response.data.favorites));

 
  };

  const removeFromFavorites = (productId,userId) => {
    /// lets call a api to remove from favorites
    console.log("remove from favorites called");
    const token = localStorage.getItem('token');
    try {
      const response = axios.post(GFG_ROUTES.REMOVEFAVORITES,{
        itemId: productId,
        userId: userId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response);
      if (response.status !== 200) {
        throw new Error('Failed to remove from favorites');
      }
       
      
    } catch (error) {
      console.error('Error removing from favorites:', error);
      
    }

    const newFavorites = favorites.filter(fav => fav._id !== productId);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (productId) => {
    return favorites.some(fav => fav._id === productId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    setFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};