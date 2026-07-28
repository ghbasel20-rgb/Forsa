// From Firebase console > Authentication > Sign-in method > Google > Web SDK configuration.
export const GOOGLE_WEB_CLIENT_ID =
  '1095418919674-8cf023f14cohgfeo5ten4nnlj0vpbt7a.apps.googleusercontent.com';

// Native (iOS/Android) sign-in needs their own OAuth client IDs, created by
// adding iOS/Android apps to the Firebase project (Project settings > Your
// apps). Firebase auto-creates the matching Google Cloud OAuth client once
// the app is registered there (iOS needs the bundle ID; Android needs the
// package name + a SHA-1 signing fingerprint). Leave blank until then —
// the Google button still works on web without them.
export const GOOGLE_IOS_CLIENT_ID = '';
export const GOOGLE_ANDROID_CLIENT_ID = '';
