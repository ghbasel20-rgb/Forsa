import React, { createContext, useContext, useState } from 'react';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    skills: [],
  });

  const updateProfile = (data) => {
    setProfileData(prev => ({ ...prev, ...data }));
  };

  const clearProfile = () => {
    setProfileData({
      skills: [],
    });
  };

  return (
    <ProfileContext.Provider value={{ profileData, updateProfile, clearProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
};