import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState('Delhi, India');
  const [coordinates, setCoordinates] = useState([77.2090, 28.6139]);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates([longitude, latitude]);
          
          try {
            // Simulate reverse geocoding
            const locationName = await reverseGeocode(latitude, longitude);
            setLocation(locationName);
            resolve(locationName);
          } catch (error) {
            setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            resolve(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  };

  const reverseGeocode = async (lat, lng) => {
    // Mock reverse geocoding - in real app, use Google Maps API or similar
    const mockLocations = [
      'Greater Noida, UP',
      'Sector 62, Noida',
      'Connaught Place, Delhi',
      'Gurgaon, HR',
      'Faridabad, HR'
    ];
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];
        resolve(randomLocation);
      }, 500);
    });
  };

  const value = {
    location,
    setLocation,
    coordinates,
    getCurrentLocation
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};