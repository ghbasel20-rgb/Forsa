import {
  addDoc,
  collection,
  db,
  deleteObject,
  doc,
  getDoc,
  getDocs,
  getDownloadURL,
  PROFILE_IMAGES_PATH,
  query,
  ref,
  serverTimestamp,
  storage,
  updateDoc,
  uploadBytes,
  where,
} from '../config/firebase-config';

const PROFILES_COLLECTION_ID = 'profiles';

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

// Stores the full download URL as the "file id" (returned as data.$id, same
// shape callers already read from the Appwrite version) so
// getProfileImageUrl can stay synchronous instead of every caller needing to
// await a URL lookup on render.
export const uploadProfileImage = async (asset) => {
  try {
    const fileId = doc(collection(db, PROFILE_IMAGES_PATH)).id;
    const path = `${PROFILE_IMAGES_PATH}/${fileId}-${asset.fileName || 'photo.jpg'}`;
    const storageRef = ref(storage, path);

    const blob = await (await fetch(asset.uri)).blob();
    await uploadBytes(storageRef, blob, { contentType: asset.mimeType || 'image/jpeg' });
    const downloadURL = await getDownloadURL(storageRef);

    return { success: true, data: { $id: downloadURL } };
  } catch (error) {
    console.error('Upload profile image error:', error);
    return { success: false, error: error.message };
  }
};

export const deleteProfileImage = async (fileUrl) => {
  try {
    await deleteObject(ref(storage, fileUrl));
    return { success: true };
  } catch (error) {
    console.error('Delete profile image error:', error);
    return { success: false, error: error.message };
  }
};

export const getProfileImageUrl = (fileUrl) => {
  if (!fileUrl) return null;
  return fileUrl;
};
