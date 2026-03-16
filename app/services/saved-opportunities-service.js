import { databases, ID, Query } from '../config/appwrite-config';

const DATABASE_ID = '69b6e464000e1c479de5';
const SAVED_OPPORTUNITIES_COLLECTION_ID = 'savedOpportunities';

export const saveOpportunity = async (userId, opportunityId, opportunityTitle) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      SAVED_OPPORTUNITIES_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        opportunityId,
        opportunityTitle,
      }
    );
    
    console.log('Opportunity saved:', response);
    return { success: true, data: response };
  } catch (error) {
    console.error('Save opportunity error:', error);
    return { success: false, error: error.message };
  }
};

export const unsaveOpportunity = async (documentId) => {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      SAVED_OPPORTUNITIES_COLLECTION_ID,
      documentId
    );
    
    console.log('Opportunity unsaved');
    return { success: true };
  } catch (error) {
    console.error('Unsave opportunity error:', error);
    return { success: false, error: error.message };
  }
};

export const getSavedOpportunities = async (userId) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      SAVED_OPPORTUNITIES_COLLECTION_ID,
      [Query.equal('userId', userId)]
    );
    
    return { success: true, data: response.documents };
  } catch (error) {
    console.error('Get saved opportunities error:', error);
    return { success: false, error: error.message };
  }
};

export const checkIfSaved = async (userId, opportunityId) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      SAVED_OPPORTUNITIES_COLLECTION_ID,
      [
        Query.equal('userId', userId),
        Query.equal('opportunityId', opportunityId)
      ]
    );
    
    return { 
      success: true, 
      isSaved: response.documents.length > 0,
      documentId: response.documents.length > 0 ? response.documents[0].$id : null
    };
  } catch (error) {
    console.error('Check saved error:', error);
    return { success: false, error: error.message };
  }
};