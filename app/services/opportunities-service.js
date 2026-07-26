import { databases, Query } from '../config/appwrite-config';
import { translateText } from './translation-service';

const DATABASE_ID = '69b6e464000e1c479de5';
const OPPORTUNITIES_COLLECTION_ID = 'opportunities';

export const getAllOpportunities = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      OPPORTUNITIES_COLLECTION_ID
    );
    
    return { success: true, data: response.documents };
  } catch (error) {
    console.error('Get opportunities error:', error);
    return { success: false, error: error.message };
  }
};

export const getOpportunityById = async (opportunityId) => {
  try {
    const response = await databases.getDocument(
      DATABASE_ID,
      OPPORTUNITIES_COLLECTION_ID,
      opportunityId
    );
    
    return { success: true, data: response };
  } catch (error) {
    console.error('Get opportunity error:', error);
    return { success: false, error: error.message };
  }
};

export const updateOpportunity = async (documentId, data) => {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      OPPORTUNITIES_COLLECTION_ID,
      documentId,
      data
    );

    return { success: true, data: response };
  } catch (error) {
    console.error('Update opportunity error:', error);
    return { success: false, error: error.message };
  }
};

const isUsableTranslation = (text) =>
  Boolean(text) && !/MYMEMORY WARNING/i.test(text) && !/%[0-9A-Fa-f]{2}/.test(text);

const resolveTranslation = (needsTranslation, translated, cached) =>
  needsTranslation ? (isUsableTranslation(translated) ? translated : null) : cached;

export const getOpportunityWithTranslation = async (opportunityId, language) => {
  const result = await getOpportunityById(opportunityId);
  if (!result.success || language !== 'ar') {
    return result;
  }

  const opportunity = result.data;
  const needsTitle = !isUsableTranslation(opportunity.titleAr) && !!opportunity.title;
  const needsDescription = !isUsableTranslation(opportunity.descriptionAr) && !!opportunity.description;

  if (!needsTitle && !needsDescription) {
    return result;
  }

  const [titleAr, descriptionAr] = await Promise.all([
    needsTitle ? translateText(opportunity.title, 'ar') : opportunity.titleAr,
    needsDescription ? translateText(opportunity.description, 'ar') : opportunity.descriptionAr,
  ]);

  const finalTitleAr = resolveTranslation(needsTitle, titleAr, opportunity.titleAr);
  const finalDescriptionAr = resolveTranslation(needsDescription, descriptionAr, opportunity.descriptionAr);

  const updates = {};
  if (needsTitle && finalTitleAr) updates.titleAr = finalTitleAr;
  if (needsDescription && finalDescriptionAr) updates.descriptionAr = finalDescriptionAr;

  if (Object.keys(updates).length > 0) {
    await updateOpportunity(opportunity.$id, updates);
  }

  return {
    success: true,
    data: { ...opportunity, titleAr: finalTitleAr, descriptionAr: finalDescriptionAr },
  };
};

export const getOpportunitiesByLocation = async (location) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      OPPORTUNITIES_COLLECTION_ID,
      [Query.equal('location', location)]
    );
    
    return { success: true, data: response.documents };
  } catch (error) {
    console.error('Get opportunities by location error:', error);
    return { success: false, error: error.message };
  }
};

export const getOpportunitiesByCategory = async (category) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      OPPORTUNITIES_COLLECTION_ID,
      [Query.equal('category', category)]
    );
    
    return { success: true, data: response.documents };
  } catch (error) {
    console.error('Get opportunities by category error:', error);
    return { success: false, error: error.message };
  }
};

export const searchOpportunities = async (searchQuery) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      OPPORTUNITIES_COLLECTION_ID,
      [Query.search('title', searchQuery)]
    );

    return { success: true, data: response.documents };
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