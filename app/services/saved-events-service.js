import {
  addDoc,
  collection,
  db,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from '../config/firebase-config';

const SAVED_EVENTS_COLLECTION_ID = 'savedEvents';

const mapSavedEvent = (docSnap) => ({
  ...docSnap.data(),
  $id: docSnap.id,
});

export const applyToEvent = async (userId, eventId, name) => {
  try {
    const docRef = await addDoc(collection(db, SAVED_EVENTS_COLLECTION_ID), {
      userId,
      eventId,
      name,
      status: 'Pending',
      appliedAt: new Date().toISOString(),
      notificationSeen: true,
    });
    const docSnap = await getDoc(docRef);

    console.log('Applied to event:', docRef.id);
    return { success: true, data: mapSavedEvent(docSnap) };
  } catch (error) {
    console.error('Apply to event error:', error);
    return { success: false, error: error.message };
  }
};

export const unsaveEvent = async (documentId) => {
  try {
    await deleteDoc(doc(db, SAVED_EVENTS_COLLECTION_ID, documentId));

    console.log('Event application removed');
    return { success: true };
  } catch (error) {
    console.error('Unsave event error:', error);
    return { success: false, error: error.message };
  }
};

export const getSavedEvents = async (userId) => {
  try {
    const q = query(collection(db, SAVED_EVENTS_COLLECTION_ID), where('userId', '==', userId));
    const snapshot = await getDocs(q);

    return { success: true, data: snapshot.docs.map(mapSavedEvent) };
  } catch (error) {
    console.error('Get saved events error:', error);
    return { success: false, error: error.message };
  }
};

export const getAllSavedEvents = async () => {
  try {
    const snapshot = await getDocs(collection(db, SAVED_EVENTS_COLLECTION_ID));

    return { success: true, data: snapshot.docs.map(mapSavedEvent) };
  } catch (error) {
    console.error('Get all saved events error:', error);
    return { success: false, error: error.message };
  }
};

export const updateApplicationStatus = async (documentId, status) => {
  try {
    const docRef = doc(db, SAVED_EVENTS_COLLECTION_ID, documentId);
    await updateDoc(docRef, {
      status,
      statusUpdatedAt: new Date().toISOString(),
      notificationSeen: status === 'Pending',
    });
    const docSnap = await getDoc(docRef);

    console.log('Application status updated:', documentId);
    return { success: true, data: mapSavedEvent(docSnap) };
  } catch (error) {
    console.error('Update application status error:', error);
    return { success: false, error: error.message };
  }
};

export const markApplicationNotificationsSeen = async (documentIds) => {
  try {
    await Promise.all(
      documentIds.map((documentId) =>
        updateDoc(doc(db, SAVED_EVENTS_COLLECTION_ID, documentId), { notificationSeen: true })
      )
    );
    return { success: true };
  } catch (error) {
    console.error('Mark notifications seen error:', error);
    return { success: false, error: error.message };
  }
};

export const getApplicationNotifications = async (userId) => {
  try {
    const q = query(collection(db, SAVED_EVENTS_COLLECTION_ID), where('userId', '==', userId));
    const snapshot = await getDocs(q);

    const notifications = snapshot.docs
      .map(mapSavedEvent)
      .filter((application) => application.status && application.status !== 'Pending')
      .sort((a, b) => new Date(b.statusUpdatedAt || 0) - new Date(a.statusUpdatedAt || 0));

    return { success: true, data: notifications };
  } catch (error) {
    console.error('Get application notifications error:', error);
    return { success: false, error: error.message };
  }
};

export const getSavedEventStatus = async ({ documentId, eventId, userId }) => {
  try {
    if (documentId) {
      const docSnap = await getDoc(doc(db, SAVED_EVENTS_COLLECTION_ID, documentId));

      if (!docSnap.exists()) {
        return { success: true, isApplied: false, documentId: null, data: null };
      }

      return { success: true, isApplied: true, documentId: docSnap.id, data: mapSavedEvent(docSnap) };
    }

    const q = query(
      collection(db, SAVED_EVENTS_COLLECTION_ID),
      where('userId', '==', userId),
      where('eventId', '==', eventId)
    );
    const snapshot = await getDocs(q);

    const found = snapshot.docs.length > 0;

    return {
      success: true,
      isApplied: found,
      documentId: found ? snapshot.docs[0].id : null,
      data: found ? mapSavedEvent(snapshot.docs[0]) : null,
    };
  } catch (error) {
    console.error('Get saved event status error:', error);
    return { success: false, error: error.message };
  }
};
