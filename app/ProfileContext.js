import React, { createContext, useContext, useState } from 'react';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    fullName: '',
    dateOfBirth: '',
    location: '',
    educationStatus: '',
    skills: [],
    interests: [],
  });

  const updateProfile = (data) => {
    setProfileData(prev => ({ ...prev, ...data }));
  };

  const clearProfile = () => {
    setProfileData({
      fullName: '',
      dateOfBirth: '',
      location: '',
      educationStatus: '',
      skills: [],
      interests: [],
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