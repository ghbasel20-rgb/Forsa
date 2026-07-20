import { databases, Query } from '../config/appwrite-config';

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

const scoreOpportunityMatch = (opportunity, profile) => {
  const userSelections = new Set([
    ...(profile?.skills || []),
    ...(profile?.interests || []),
  ]);
  const opportunitySelections = new Set([
    ...(opportunity.skills || []),
    ...(opportunity.interests || []),
  ]);

  if (opportunitySelections.size === 0) {
    return 0;
  }

  let overlap = 0;
  opportunitySelections.forEach((item) => {
    if (userSelections.has(item)) {
      overlap += 1;
    }
  });

  return Math.round((overlap / opportunitySelections.size) * 100);
};

export const getMatchedOpportunities = (opportunities, profile) => {
  const scored = opportunities
    .map((opportunity) => ({
      opportunity,
      score: scoreOpportunityMatch(opportunity, profile),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return new Date(b.opportunity.$createdAt) - new Date(a.opportunity.$createdAt);
    });

  const topMatches = scored
    .slice(0, 3)
    .map((entry) => ({ ...entry.opportunity, matchScore: entry.score }));

  return { topMatches };
};