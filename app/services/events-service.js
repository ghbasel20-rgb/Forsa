import { collection, db, doc, getDoc, getDocs, updateDoc } from '../config/firebase-config';
import { translateText } from './translation-service';

const EVENTS_COLLECTION_ID = 'events';

const toIso = (value) => {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate().toISOString();
  return value;
};

const mapEvent = (docSnap) => ({
  ...docSnap.data(),
  $id: docSnap.id,
  $createdAt: toIso(docSnap.data().createdAt),
});

export const getEvents = async () => {
  try {
    const snapshot = await getDocs(collection(db, EVENTS_COLLECTION_ID));

    return { success: true, data: snapshot.docs.map(mapEvent) };
  } catch (error) {
    console.error('Get events error:', error);
    return { success: false, error: error.message };
  }
};

export const getEventById = async (eventId) => {
  try {
    const docSnap = await getDoc(doc(db, EVENTS_COLLECTION_ID, eventId));

    if (!docSnap.exists()) {
      return { success: false, error: 'Event not found' };
    }

    return { success: true, data: mapEvent(docSnap) };
  } catch (error) {
    console.error('Get event error:', error);
    return { success: false, error: error.message };
  }
};

export const updateEvent = async (documentId, data) => {
  try {
    const docRef = doc(db, EVENTS_COLLECTION_ID, documentId);
    await updateDoc(docRef, data);
    const docSnap = await getDoc(docRef);

    return { success: true, data: mapEvent(docSnap) };
  } catch (error) {
    console.error('Update event error:', error);
    return { success: false, error: error.message };
  }
};

const isUsableTranslation = (text) =>
  Boolean(text) && !/MYMEMORY WARNING/i.test(text) && !/%[0-9A-Fa-f]{2}/.test(text);

const resolveTranslation = (needsTranslation, translated, cached) =>
  needsTranslation ? (isUsableTranslation(translated) ? translated : null) : cached;

export const getEventWithTranslation = async (eventId, language) => {
  const result = await getEventById(eventId);
  if (!result.success || language !== 'ar') {
    return result;
  }

  const event = result.data;
  const needsTitle = !isUsableTranslation(event.titleAr) && !!event.title;
  const needsDetails = !isUsableTranslation(event.detailsAr) && !!event.details;
  const needsContent = !isUsableTranslation(event.contentAr) && !!event.content;
  const needsLocation = !isUsableTranslation(event.locationAr) && !!event.location;
  const needsCost = !isUsableTranslation(event.costAr) && !!event.cost;

  if (!needsTitle && !needsDetails && !needsContent && !needsLocation && !needsCost) {
    return result;
  }

  const [titleAr, detailsAr, contentAr, locationAr, costAr] = await Promise.all([
    needsTitle ? translateText(event.title, 'ar') : event.titleAr,
    needsDetails ? translateText(event.details, 'ar') : event.detailsAr,
    needsContent ? translateText(event.content, 'ar') : event.contentAr,
    needsLocation ? translateText(event.location, 'ar') : event.locationAr,
    needsCost ? translateText(event.cost, 'ar') : event.costAr,
  ]);

  const finalTitleAr = resolveTranslation(needsTitle, titleAr, event.titleAr);
  const finalDetailsAr = resolveTranslation(needsDetails, detailsAr, event.detailsAr);
  const finalContentAr = resolveTranslation(needsContent, contentAr, event.contentAr);
  const finalLocationAr = resolveTranslation(needsLocation, locationAr, event.locationAr);
  const finalCostAr = resolveTranslation(needsCost, costAr, event.costAr);

  const updates = {};
  if (needsTitle && finalTitleAr) updates.titleAr = finalTitleAr;
  if (needsDetails && finalDetailsAr) updates.detailsAr = finalDetailsAr;
  if (needsContent && finalContentAr) updates.contentAr = finalContentAr;
  if (needsLocation && finalLocationAr) updates.locationAr = finalLocationAr;
  if (needsCost && finalCostAr) updates.costAr = finalCostAr;

  if (Object.keys(updates).length > 0) {
    await updateEvent(event.$id, updates);
  }

  return {
    success: true,
    data: {
      ...event,
      titleAr: finalTitleAr,
      detailsAr: finalDetailsAr,
      contentAr: finalContentAr,
      locationAr: finalLocationAr,
      costAr: finalCostAr,
    },
  };
};

const isPast = (date) => (date ? new Date(date).getTime() < Date.now() : false);

const formatLongDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export const isEventClosed = (event) => {
  if (!event) return false;
  return isPast(event.dueDate) || isPast(event.eventDate);
};

export const formatDueDate = (dueDate) => {
  if (!dueDate) return null;
  if (isPast(dueDate)) return 'Closed';

  const due = new Date(dueDate);
  const startOfDue = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const daysLeft = Math.round((startOfDue - startOfToday) / (1000 * 60 * 60 * 24));

  if (daysLeft <= 0) return 'Closes today';
  if (daysLeft === 1) return '1 day left';
  if (daysLeft <= 7) return `${daysLeft} days left`;

  return `Apply by ${due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
};

export const formatFullDueDate = (dueDate) => {
  if (!dueDate) return null;
  return formatLongDate(dueDate);
};

export const formatCompactEventDate = (eventDate) => {
  if (!eventDate) return null;
  return `Event: ${new Date(eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
};

export const formatEventDate = (eventDate) => {
  if (!eventDate) return null;
  return formatLongDate(eventDate);
};

export const scoreEventMatch = (event, profile) => {
  const userSelections = new Set([
    ...(profile?.skills || []),
    ...(profile?.interests || []),
  ]);
  const eventSelections = new Set([
    ...(event.skills || []),
    ...(event.interests || []),
  ]);

  if (eventSelections.size === 0) {
    return { matchPercentage: 100, hasRequirements: false };
  }

  let overlap = 0;
  eventSelections.forEach((item) => {
    if (userSelections.has(item)) {
      overlap += 1;
    }
  });

  return {
    matchPercentage: Math.round((overlap / eventSelections.size) * 100),
    hasRequirements: true,
  };
};

export const getMatchedEvents = (events, profile) => {
  const scored = events
    .map((event) => ({
      event,
      ...scoreEventMatch(event, profile),
    }))
    .filter((entry) => entry.matchPercentage > 0)
    .sort((a, b) => {
      if (a.hasRequirements !== b.hasRequirements) {
        return a.hasRequirements ? -1 : 1;
      }
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }
      return new Date(b.event.$createdAt) - new Date(a.event.$createdAt);
    });

  const topMatches = scored
    .slice(0, 3)
    .map((entry) => ({ ...entry.event, matchPercentage: entry.matchPercentage }));

  return { topMatches };
};
