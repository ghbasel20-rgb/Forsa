import { collection, db, doc, getDoc, getDocs, query, updateDoc, where } from '../config/firebase-config';
import { translateText } from './translation-service';

const OPPORTUNITIES_COLLECTION_ID = 'opportunities';

const toIso = (value) => {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate().toISOString();
  return value;
};

const mapOpportunity = (docSnap) => ({
  ...docSnap.data(),
  $id: docSnap.id,
  $createdAt: toIso(docSnap.data().createdAt),
});

export const getAllOpportunities = async () => {
  try {
    const snapshot = await getDocs(collection(db, OPPORTUNITIES_COLLECTION_ID));

    return { success: true, data: snapshot.docs.map(mapOpportunity) };
  } catch (error) {
    console.error('Get opportunities error:', error);
    return { success: false, error: error.message };
  }
};

export const getOpportunityById = async (opportunityId) => {
  try {
    const docSnap = await getDoc(doc(db, OPPORTUNITIES_COLLECTION_ID, opportunityId));

    if (!docSnap.exists()) {
      return { success: false, error: 'Opportunity not found' };
    }

    return { success: true, data: mapOpportunity(docSnap) };
  } catch (error) {
    console.error('Get opportunity error:', error);
    return { success: false, error: error.message };
  }
};

export const updateOpportunity = async (documentId, data) => {
  try {
    const docRef = doc(db, OPPORTUNITIES_COLLECTION_ID, documentId);
    await updateDoc(docRef, data);
    const docSnap = await getDoc(docRef);

    return { success: true, data: mapOpportunity(docSnap) };
  } catch (error) {
    console.error('Update opportunity error:', error);
    return { success: false, error: error.message };
  }
};

const isUsableTranslation = (text) =>
  Boolean(text) && !/MYMEMORY WARNING/i.test(text) && !/%\s{0,3}[0-9A-Fa-f]{2}/.test(text);

const resolveTranslation = (needsTranslation, translated, cached) =>
  needsTranslation ? (isUsableTranslation(translated) ? translated : null) : cached;

const isUsableTranslationArray = (arr, expectedLength) =>
  Array.isArray(arr) && arr.length === expectedLength && arr.every(isUsableTranslation);

const resolveTranslationArray = (needsTranslation, translated, cached, expectedLength) =>
  needsTranslation ? (isUsableTranslationArray(translated, expectedLength) ? translated : null) : cached;

export const getOpportunityWithTranslation = async (opportunityId, language) => {
  const result = await getOpportunityById(opportunityId);
  if (!result.success || language !== 'ar') {
    return result;
  }

  const opportunity = result.data;
  const requirements = opportunity.requirements || [];
  const needsTitle = !isUsableTranslation(opportunity.titleAr) && !!opportunity.title;
  const needsDescription = !isUsableTranslation(opportunity.descriptionAr) && !!opportunity.description;
  const needsLocation = !isUsableTranslation(opportunity.locationAr) && !!opportunity.location;
  const needsCategory = !isUsableTranslation(opportunity.categoryAr) && !!opportunity.category;
  const needsRequirements =
    !isUsableTranslationArray(opportunity.requirementsAr, requirements.length) && requirements.length > 0;

  if (!needsTitle && !needsDescription && !needsLocation && !needsCategory && !needsRequirements) {
    return result;
  }

  const [titleAr, descriptionAr, locationAr, categoryAr, requirementsAr] = await Promise.all([
    needsTitle ? translateText(opportunity.title, 'ar') : opportunity.titleAr,
    needsDescription ? translateText(opportunity.description, 'ar') : opportunity.descriptionAr,
    needsLocation ? translateText(opportunity.location, 'ar') : opportunity.locationAr,
    needsCategory ? translateText(opportunity.category, 'ar') : opportunity.categoryAr,
    needsRequirements
      ? Promise.all(requirements.map((requirement) => translateText(requirement, 'ar')))
      : opportunity.requirementsAr,
  ]);

  const finalTitleAr = resolveTranslation(needsTitle, titleAr, opportunity.titleAr);
  const finalDescriptionAr = resolveTranslation(needsDescription, descriptionAr, opportunity.descriptionAr);
  const finalLocationAr = resolveTranslation(needsLocation, locationAr, opportunity.locationAr);
  const finalCategoryAr = resolveTranslation(needsCategory, categoryAr, opportunity.categoryAr);
  const finalRequirementsAr = resolveTranslationArray(
    needsRequirements,
    requirementsAr,
    opportunity.requirementsAr,
    requirements.length
  );

  const updates = {};
  if (needsTitle && finalTitleAr) updates.titleAr = finalTitleAr;
  if (needsDescription && finalDescriptionAr) updates.descriptionAr = finalDescriptionAr;
  if (needsLocation && finalLocationAr) updates.locationAr = finalLocationAr;
  if (needsCategory && finalCategoryAr) updates.categoryAr = finalCategoryAr;
  if (needsRequirements && finalRequirementsAr) updates.requirementsAr = finalRequirementsAr;

  if (Object.keys(updates).length > 0) {
    await updateOpportunity(opportunity.$id, updates);
  }

  return {
    success: true,
    data: {
      ...opportunity,
      titleAr: finalTitleAr,
      descriptionAr: finalDescriptionAr,
      locationAr: finalLocationAr,
      categoryAr: finalCategoryAr,
      requirementsAr: finalRequirementsAr,
    },
  };
};

export const getOpportunitiesByLocation = async (location) => {
  try {
    const q = query(collection(db, OPPORTUNITIES_COLLECTION_ID), where('location', '==', location));
    const snapshot = await getDocs(q);

    return { success: true, data: snapshot.docs.map(mapOpportunity) };
  } catch (error) {
    console.error('Get opportunities by location error:', error);
    return { success: false, error: error.message };
  }
};

export const getOpportunitiesByCategory = async (category) => {
  try {
    const q = query(collection(db, OPPORTUNITIES_COLLECTION_ID), where('category', '==', category));
    const snapshot = await getDocs(q);

    return { success: true, data: snapshot.docs.map(mapOpportunity) };
  } catch (error) {
    console.error('Get opportunities by category error:', error);
    return { success: false, error: error.message };
  }
};

// Firestore has no full-text search, unlike Appwrite's Query.search. This
// filters client-side on the (small) opportunities collection instead.
export const searchOpportunities = async (searchQuery) => {
  try {
    const snapshot = await getDocs(collection(db, OPPORTUNITIES_COLLECTION_ID));
    const needle = searchQuery.toLowerCase();
    const matches = snapshot.docs
      .map(mapOpportunity)
      .filter((opportunity) => (opportunity.title || '').toLowerCase().includes(needle));

    return { success: true, data: matches };
  } catch (error) {
    console.error('Search opportunities error:', error);
    return { success: false, error: error.message };
  }
};

export const scoreOpportunityMatch = (opportunity, profile) => {
  const userSelections = new Set([
    ...(profile?.skills || []),
    ...(profile?.interests || []),
  ]);
  const opportunitySelections = new Set([
    ...(opportunity.skills || []),
    ...(opportunity.interests || []),
  ]);

  if (opportunitySelections.size === 0) {
    return { matchPercentage: 100, hasRequirements: false };
  }

  let overlap = 0;
  opportunitySelections.forEach((item) => {
    if (userSelections.has(item)) {
      overlap += 1;
    }
  });

  return {
    matchPercentage: Math.round((overlap / opportunitySelections.size) * 100),
    hasRequirements: true,
  };
};

export const getMatchedOpportunities = (opportunities, profile) => {
  const scored = opportunities
    .map((opportunity) => ({
      opportunity,
      ...scoreOpportunityMatch(opportunity, profile),
    }))
    .filter((entry) => entry.matchPercentage > 0)
    .sort((a, b) => {
      if (a.hasRequirements !== b.hasRequirements) {
        return a.hasRequirements ? -1 : 1;
      }
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }
      return new Date(b.opportunity.$createdAt) - new Date(a.opportunity.$createdAt);
    });

  const topMatches = scored
    .slice(0, 3)
    .map((entry) => ({ ...entry.opportunity, matchPercentage: entry.matchPercentage }));

  return { topMatches };
};