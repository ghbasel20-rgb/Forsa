import { account, ID } from '../config/appwrite-config';
export const signUp = async (email, password, name) => {
  try {
    const response = await account.create(
      ID.unique(), 
      email,
      password,
      name
    );
    
    console.log('User created successfully:', response);
    
    await signIn(email, password);
    
    return { success: true, data: response };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, error: error.message };
  }
};

export const signIn = async (email, password) => {
  try {
    const response = await account.createEmailPasswordSession(
      email,
      password
    );
    
    console.log('Logged in successfully:', response);
    return { success: true, data: response };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: error.message };
  }
};

export const signOut = async () => {
  try {
    await account.deleteSession('current');
    console.log('Logged out successfully');
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    return { success: true, data: user };
  } catch (error) {
    console.error('Get current user error:', error);
    return { success: false, error: error.message };
  }
};