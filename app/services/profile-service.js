import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { addDoc, collection, db, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from '../config/firebase-config';

const PROFILES_COLLECTION_ID = 'profiles';

// Firebase Storage requires the paid Blaze plan, so profile pictures are
// stored as a base64 data URI directly on the profile document instead.
// Firestore caps documents at 1MiB, so the image is downscaled/compressed
// to comfortably fit well under that before being embedded.
const MAX_IMAGE_WIDTH = 480;
const IMAGE_COMPRESSION = 0.5;
const MAX_DATA_URI_LENGTH = 700_000;

const toIso = (value) => {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate().toISOString();
  return value;
};

const mapProfile = (docSnap) => ({
  ...docSnap.data(),
  $id: docSnap.id,
  $createdAt: toIso(docSnap.data().createdAt),
});

export const createUserProfile = async (userId, profileData) => {
  try {
    const docRef = await addDoc(collection(db, PROFILES_COLLECTION_ID), {
      userId: userId,
      fullName: profileData.fullName,
      email: profileData.email,
      dateOfBirth: profileData.dateOfBirth,
      educationStatus: profileData.educationStatus,
      skills: profileData.skills,
      interests: profileData.interests,
      hasCompletedSkillsInterests: profileData.hasCompletedSkillsInterests ?? false,
      createdAt: serverTimestamp(),
    });
    const docSnap = await getDoc(docRef);

    console.log('Profile created:', docRef.id);
    return { success: true, data: mapProfile(docSnap) };
  } catch (error) {
    console.error('Create profile error:', error);
    return { success: false, error: error.message };
  }
};

export const getUserProfile = async (userId) => {
  try {
    const q = query(collection(db, PROFILES_COLLECTION_ID), where('userId', '==', userId));
    const snapshot = await getDocs(q);

    if (snapshot.docs.length > 0) {
      return { success: true, data: mapProfile(snapshot.docs[0]) };
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
    const docRef = doc(db, PROFILES_COLLECTION_ID, documentId);
    await updateDoc(docRef, profileData);
    const docSnap = await getDoc(docRef);

    console.log('Profile updated:', documentId);
    return { success: true, data: mapProfile(docSnap) };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, error: error.message };
  }
};

// Returns the data URI as the "file id" (data.$id, same shape callers
// already read from the Appwrite/Storage versions) so getProfileImageUrl
// can stay synchronous instead of every caller needing to await a URL
// lookup on render.
export const uploadProfileImage = async (asset) => {
  try {
    const rendered = await ImageManipulator.manipulate(asset.uri)
      .resize({ width: MAX_IMAGE_WIDTH })
      .renderAsync();
    const result = await rendered.saveAsync({
      base64: true,
      compress: IMAGE_COMPRESSION,
      format: SaveFormat.JPEG,
    });

    const dataUri = `data:image/jpeg;base64,${result.base64}`;
    if (dataUri.length > MAX_DATA_URI_LENGTH) {
      return { success: false, error: 'Image is too large to save even after compression' };
    }

    return { success: true, data: { $id: dataUri } };
  } catch (error) {
    console.error('Upload profile image error:', error);
    return { success: false, error: error.message };
  }
};

// No-op: the image lives inline on the profile document (see
// uploadProfileImage above), so there's nothing external to clean up —
// updateUserProfile overwriting profileImageId already discards the old
// value. Kept as a function so Profile.jsx's existing call site doesn't
// need to change.
export const deleteProfileImage = async () => ({ success: true });

export const getProfileImageUrl = (dataUri) => {
  if (!dataUri) return null;
  return dataUri;
};
