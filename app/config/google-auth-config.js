// From Firebase console > Authentication > Sign-in method > Google > Web SDK configuration.
// useGoogleAuth.js uses this client ID on every platform, including iOS/Android,
// because it's the only client type whose redirect URI can be whitelisted for
// Expo Go's exp:// loopback address — an iOS/Android-type client can't be.
export const GOOGLE_WEB_CLIENT_ID =
  '1095418919674-8cf023f14cohgfeo5ten4nnlj0vpbt7a.apps.googleusercontent.com';

// From GoogleService-Info.plist (CLIENT_ID). Used by useGoogleAuth.js on iOS.
// Only works in a standalone/dev build, not Expo Go — Expo Go's exp:// redirect
// can't be validated against an iOS-type OAuth client (no redirect URI list to
// register it in), so Google Sign-In on iOS requires a dev build from here on.
export const GOOGLE_IOS_CLIENT_ID =
  '1095418919674-viu2j91fvmiugk906d3vbumuj72jrkh9.apps.googleusercontent.com';

// Same idea as GOOGLE_IOS_CLIENT_ID, but for Android — create by registering
// an Android app in Firebase (package name + a SHA-1 signing fingerprint).
export const GOOGLE_ANDROID_CLIENT_ID = '';
