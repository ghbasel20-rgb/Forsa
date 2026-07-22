import { databases, ID, PROFILE_IMAGES_BUCKET_ID, Query, storage } from '../config/appwrite-config';

const DATABASE_ID = '69b6e464000e1c479de5';
const PROFILES_COLLECTION_ID = 'profiles';

export const createUserProfile = async (userId, profileData) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      PROFILES_COLLECTION_ID,
      ID.unique(),
      {
        userId: userId,
        fullName: profileData.fullName,
        email: profileData.email,
        dateOfBirth: profileData.dateOfBirth,
        educationStatus: profileData.educationStatus,
        skills: profileData.skills,
        interests: profileData.interests,
        hasCompletedSkillsInterests: profileData.hasCompletedSkillsInterests ?? false,
      }
    );
    
    console.log('Profile created:', response);
    return { success: true, data: response };
  } catch (error) {
    console.error('Create profile error:', error);
    return { success: false, error: error.message };
  }
};

export const getUserProfile = async (userId) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PROFILES_COLLECTION_ID,
      [Query.equal('userId', userId)]
    );
    
    if (response.documents.length > 0) {
      return { success: true, data: response.documents[0] };
    } else {
      return { success: false, error: 'Profile not found' };
    }
  } catch (error) {
    console.error('Get profile error:', error);
    return { success: false, error: error.message };
  }
};

export const updateUserProfile = async (documentId, profileData) => {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      PROFILES_COLLECTION_ID,
      documentId,
      profileData
    );

    console.log('Profile updated:', response);
    return { success: true, data: response };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, error: error.message };
  }
};

export const uploadProfileImage = async (asset) => {
  try {
    const fileId = ID.unique();
    const response = await storage.createFile(PROFILE_IMAGES_BUCKET_ID, fileId, {
      uri: asset.uri,
      name: asset.fileName || `${fileId}.jpg`,
      type: asset.mimeType || 'image/jpeg',
      size: asset.fileSize || 0,
    });

    return { success: true, data: response };
  } catch (error) {
    console.error('Upload profile image error:', error);
    return { success: false, error: error.message };
  }
};

export const deleteProfileImage = async (fileId) => {
  try {
    await storage.deleteFile(PROFILE_IMAGES_BUCKET_ID, fileId);
    return { success: true };
  } catch (error) {
    console.error('Delete profile image error:', error);
    return { success: false, error: error.message };
  }
};

export const getProfileImageUrl = (fileId) => {
  if (!fileId) return null;
  return storage.getFileViewURL(PROFILE_IMAGES_BUCKET_ID, fileId).toString();
};