import { addDoc, collection, db, deleteDoc, doc, getDoc, getDocs, query, where } from '../config/firebase-config';

const SAVED_OPPORTUNITIES_COLLECTION_ID = 'savedOpportunities';

const mapSavedOpportunity = (docSnap) => ({
  ...docSnap.data(),
  $id: docSnap.id,
});

export const saveOpportunity = async (userId, opportunityId, opportunityTitle) => {
  try {
    const docRef = await addDoc(collection(db, SAVED_OPPORTUNITIES_COLLECTION_ID), {
      userId,
      opportunityId,
      opportunityTitle,
    });
    const docSnap = await getDoc(docRef);

    console.log('Opportunity saved:', docRef.id);
    return { success: true, data: mapSavedOpportunity(docSnap) };
  } catch (error) {
    console.error('Save opportunity error:', error);
    return { success: false, error: error.message };
  }
};

export const unsaveOpportunity = async (documentId) => {
  try {
    await deleteDoc(doc(db, SAVED_OPPORTUNITIES_COLLECTION_ID, documentId));

    console.log('Opportunity unsaved');
    return { success: true };
  } catch (error) {
    console.error('Unsave opportunity error:', error);
    return { success: false, error: error.message };
  }
};

export const getSavedOpportunities = async (userId) => {
  try {
    const q = query(collection(db, SAVED_OPPORTUNITIES_COLLECTION_ID), where('userId', '==', userId));
    const snapshot = await getDocs(q);

    return { success: true, data: snapshot.docs.map(mapSavedOpportunity) };
  } catch (error) {
    console.error('Get saved opportunities error:', error);
    return { success: false, error: error.message };
  }
};

export const checkIfSaved = async (userId, opportunityId) => {
  try {
    const q = query(
      collection(db, SAVED_OPPORTUNITIES_COLLECTION_ID),
      where('userId', '==', userId),
      where('opportunityId', '==', opportunityId)
    );
    const snapshot = await getDocs(q);

    return {
      success: true,
      isSaved: snapshot.docs.length > 0,
      documentId: snapshot.docs.length > 0 ? snapshot.docs[0].id : null,
    };
  } catch (error) {
    console.error('Check saved error:', error);
    return { success: false, error: error.message };
  }
};
