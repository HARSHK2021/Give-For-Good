import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const SuccessStoriesContext = createContext();

export const useSuccessStories = () => {
  const context = useContext(SuccessStoriesContext);
  if (!context) {
    throw new Error('useSuccessStories must be used within a SuccessStoriesProvider');
  }
  return context;
};

export const SuccessStoriesProvider = ({ children }) => {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [userStories, setUserStories] = useState([]);

  useEffect(() => {
    loadStories();
    if (user) {
      loadUserStories();
    }
  }, [user]);

  const loadStories = () => {
    const savedStories = localStorage.getItem('success_stories');
    if (savedStories) {
      setStories(JSON.parse(savedStories));
    } else {
      // Mock initial stories
      const mockStories = [
        {
          id: '1',
          title: 'Found my dream bike!',
          content: 'I was looking for a vintage bike for months. Found the perfect one on Giive for Good at an amazing price. The seller was super helpful and even delivered it to my place!',
          author: {
            name: 'Rahul Sharma',
            avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?w=100',
            level: 'Gold'
          },
          product: {
            title: 'Vintage Mountain Bike',
            image: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?w=300'
          },
          rating: 5,
          createdAt: new Date('2024-01-15'),
          likes: 24,
          category: 'Sports'
        },
        {
          id: '2',
          title: 'Sold my furniture in just 2 days!',
          content: 'Moving to a new city and needed to sell my furniture quickly. Posted on Giive for Good and got multiple interested buyers within hours. Sold everything in 2 days!',
          author: {
            name: 'Priya Patel',
            avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=100',
            level: 'Silver'
          },
          product: {
            title: 'Complete Furniture Set',
            image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?w=300'
          },
          rating: 5,
          createdAt: new Date('2024-01-10'),
          likes: 18,
          category: 'Furniture'
        }
      ];
      setStories(mockStories);
      localStorage.setItem('success_stories', JSON.stringify(mockStories));
    }
  };

  const loadUserStories = () => {
    const saved = localStorage.getItem(`user_stories_${user.id}`);
    if (saved) {
      setUserStories(JSON.parse(saved));
    }
  };

  const addStory = (storyData) => {
    const newStory = {
      id: Date.now().toString(),
      ...storyData,
      author: {
        name: user.name,
        avatar: user.avatar,
        level: 'Bronze' // This would come from user profile context
      },
      createdAt: new Date(),
      likes: 0
    };

    const updatedStories = [newStory, ...stories];
    const updatedUserStories = [newStory, ...userStories];

    setStories(updatedStories);
    setUserStories(updatedUserStories);

    localStorage.setItem('success_stories', JSON.stringify(updatedStories));
    localStorage.setItem(`user_stories_${user.id}`, JSON.stringify(updatedUserStories));

    return newStory;
  };

  const likeStory = (storyId) => {
    const updatedStories = stories.map(story => {
      if (story.id === storyId) {
        return { ...story, likes: story.likes + 1 };
      }
      return story;
    });

    setStories(updatedStories);
    localStorage.setItem('success_stories', JSON.stringify(updatedStories));
  };

  const deleteStory = (storyId) => {
    const updatedStories = stories.filter(story => story.id !== storyId);
    const updatedUserStories = userStories.filter(story => story.id !== storyId);

    setStories(updatedStories);
    setUserStories(updatedUserStories);

    localStorage.setItem('success_stories', JSON.stringify(updatedStories));
    localStorage.setItem(`user_stories_${user.id}`, JSON.stringify(updatedUserStories));
  };

  const value = {
    stories,
    userStories,
    addStory,
    likeStory,
    deleteStory
  };

  return (
    <SuccessStoriesContext.Provider value={value}>
      {children}
    </SuccessStoriesContext.Provider>
  );
};