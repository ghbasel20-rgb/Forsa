import { databases } from '../config/appwrite-config';

const DATABASE_ID = '69b6e464000e1c479de5';
const EVENTS_COLLECTION_ID = 'events';

export const getEvents = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      EVENTS_COLLECTION_ID
    );

    return { success: true, data: response.documents };
  } catch (error) {
    console.error('Get events error:', error);
    return { success: false, error: error.message };
  }
};

export const getEventById = async (eventId) => {
  try {
    const response = await databases.getDocument(
      DATABASE_ID,
      EVENTS_COLLECTION_ID,
      eventId
    );

    return { success: true, data: response };
  } catch (error) {
    console.error('Get event error:', error);
    return { success: false, error: error.message };
  }
};
