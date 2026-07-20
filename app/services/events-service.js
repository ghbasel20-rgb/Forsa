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

const scoreEventMatch = (event, profile) => {
  const userSelections = new Set([
    ...(profile?.skills || []),
    ...(profile?.interests || []),
  ]);
  const eventSelections = new Set([
    ...(event.skills || []),
    ...(event.interests || []),
  ]);

  let overlap = 0;
  eventSelections.forEach((item) => {
    if (userSelections.has(item)) {
      overlap += 1;
    }
  });

  return overlap;
};

export const getMatchedEvents = (events, profile) => {
  const scored = events
    .map((event) => ({
      event,
      score: scoreEventMatch(event, profile),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return new Date(b.event.$createdAt) - new Date(a.event.$createdAt);
    });

  const topMatches = scored
    .slice(0, 3)
    .map((entry) => ({ ...entry.event, matchScore: entry.score }));

  return { topMatches };
};
