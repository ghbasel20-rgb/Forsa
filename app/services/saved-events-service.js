import { databases, ID, Query } from '../config/appwrite-config';

const DATABASE_ID = '69b6e464000e1c479de5';
const SAVED_EVENTS_COLLECTION_ID = 'savedEvents';

export const applyToEvent = async (userId, eventId, name) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      SAVED_EVENTS_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        eventId,
        name,
        status: 'Pending',
        appliedAt: new Date().toISOString(),
      }
    );

    console.log('Applied to event:', response);
    return { success: true, data: response };
  } catch (error) {
    console.error('Apply to event error:', error);
    return { success: false, error: error.message };
  }
};

export const unsaveEvent = async (documentId) => {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      SAVED_EVENTS_COLLECTION_ID,
      documentId
    );

    console.log('Event application removed');
    return { success: true };
  } catch (error) {
    console.error('Unsave event error:', error);
    return { success: false, error: error.message };
  }
};

export const getSavedEvents = async (userId) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      SAVED_EVENTS_COLLECTION_ID,
      [Query.equal('userId', userId)]
    );

    return { success: true, data: response.documents };
  } catch (error) {
    console.error('Get saved events error:', error);
    return { success: false, error: error.message };
  }
};

export const getAllSavedEvents = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      SAVED_EVENTS_COLLECTION_ID
    );

    return { success: true, data: response.documents };
  } catch (error) {
    console.error('Get all saved events error:', error);
    return { success: false, error: error.message };
  }
};

export const updateApplicationStatus = async (documentId, status) => {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      SAVED_EVENTS_COLLECTION_ID,
      documentId,
      { status }
    );

    console.log('Application status updated:', response);
    return { success: true, data: response };
  } catch (error) {
    console.error('Update application status error:', error);
    return { success: false, error: error.message };
  }
};

export const getSavedEventStatus = async ({ documentId, eventId, userId }) => {
  try {
    if (documentId) {
      const response = await databases.getDocument(
        DATABASE_ID,
        SAVED_EVENTS_COLLECTION_ID,
        documentId
      );

      return { success: true, isApplied: true, documentId: response.$id, data: response };
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      SAVED_EVENTS_COLLECTION_ID,
      [
        Query.equal('userId', userId),
        Query.equal('eventId', eventId)
      ]
    );

    const found = response.documents.length > 0;

    return {
      success: true,
      isApplied: found,
      documentId: found ? response.documents[0].$id : null,
      data: found ? response.documents[0] : null,
    };
  } catch (error) {
    console.error('Get saved event status error:', error);
    return { success: false, error: error.message };
  }
};
