import {
  auth,
  firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword
} from '../config/firebase-config';

const mapUser = (user) => ({
  ...user,
  $id: user.uid,
  name: user.displayName,
  email: user.email,
});

export const signUp = async (email, password, name) => {
  try {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.log('No session to delete');
    }

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
    return { success: false, error: error.message, code: error.code };
  }
};

export const signIn = async (email, password) => {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);

    console.log('Logged in successfully:', credential.user.uid);
    return { success: true, data: mapUser(credential.user) };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: error.message };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    console.log('Logged out successfully');
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message };
  }
};

// auth.currentUser isn't reliable immediately on cold start: RN persistence
// restores asynchronously, so we wait for the first onAuthStateChanged
// firing (which only happens once that restore completes) instead of
// reading auth.currentUser directly.
export const getCurrentUser = async () => {
  try {
    const user = await new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        (firebaseUser) => {
          unsubscribe();
          resolve(firebaseUser);
        },
        (error) => {
          unsubscribe();
          reject(error);
        }
      );
    });

    if (!user) {
      return { success: false, error: 'No active session' };
    }

    return { success: true, data: mapUser(user) };
  } catch (error) {
    console.error('Get current user error:', error);
    return { success: false, error: error.message };
  }
};
