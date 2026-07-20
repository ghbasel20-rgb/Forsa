# Forsa

A React Native mobile application connecting users with opportunities, powered by Appwrite.

## Description

Forsa is a cross-platform mobile app built with React Native and Expo. Users create a profile with their education status, skills, and interests, then browse opportunities and events matched to their preferences. The app includes full authentication, an editable profile, opportunity/event applications with status tracking, and a saved-items system.

## Features

- **Authentication** — sign up, sign in, and session management via Appwrite
- **Profile building** — full name, email, date of birth, education status, skills, and interests (with custom entries) collected during onboarding
- **Editable profile** — from the Profile screen you can:
  - Edit your education status inline
  - Re-open the skill picker (pre-filled with your current skills) to update your skills
  - Re-open the interest picker (pre-filled with your current interests) to update your interests
- **Homepage** — quick-access grid to Profile, Opportunities, Events, and Contact, plus success stories
- **Opportunities**
  - Top Matches — opportunities matched to the user's profile
  - Other Matches / All Opportunities — full listing with search
  - Opportunity detail view
  - Save opportunities and view them on your profile
- **Events**
  - Browse events with search
  - Event detail view
  - Apply to an event
  - Track application status (view status from the Profile screen)
- **Contact page** — links to the community WhatsApp group and Instagram
- **Bottom navigation** — Home, Profile, Events, Opportunities
- **Clean, responsive UI** with a shared design system (custom Text/TextInput/TitleText components)
- **Cross-platform support** (iOS, Android, and Web via Expo)

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Appwrite account and project

### Steps to Run

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the app: `npx expo start`

Other available scripts: `npm run android`, `npm run ios`, `npm run web`, `npm run lint`.

## Project Structure

```
Forsa/
├── app/
│   ├── config/
│   │   └── appwrite-config.js
│   ├── components/
│   │   ├── AppText.js
│   │   ├── AppTextInput.js
│   │   ├── TitleText.js
│   │   └── BottomNav.jsx
│   ├── services/
│   │   ├── auth-service.js
│   │   ├── profile-service.js
│   │   ├── opportunities-service.js
│   │   ├── saved-opportunities-service.js
│   │   ├── events-service.js
│   │   ├── saved-events-service.js
│   │   └── navigation-service.js
│   ├── ProfileContext.js
│   ├── index.jsx
│   ├── Sign-in.jsx
│   ├── Sign-up.jsx
│   ├── Homepage.jsx
│   ├── Profile.jsx
│   ├── Buildprofileskills.jsx
│   ├── Buildprofileinterests.jsx
│   ├── TopMatches.jsx
│   ├── OtherMatches.jsx
│   ├── Allopportunities.jsx
│   ├── Opportunitydetail.jsx
│   ├── Events.jsx
│   ├── EventDetail.jsx
│   ├── Application.jsx
│   ├── Status.jsx
│   └── Contact.jsx
├── assets/
│   └── images/
│       ├── Logo.svg
│       ├── icon.png
│       ├── Profile.svg / purplePfp.svg
│       ├── Search.svg / purplesearch.svg
│       ├── home-icon.svg / purplehome.svg
│       ├── events.svg
│       ├── contact.svg
│       ├── settings.svg
│       ├── edit.svg
│       ├── insta.svg
│       └── whats.svg
├── package.json
└── README.md
```

## Technologies Used

- React Native (0.81) & React 19
- Expo (SDK 54) & Expo Router (file-based navigation)
- Appwrite (Backend as a Service — auth & database)
- AsyncStorage (local/temporary storage)
- react-native-svg (icon rendering)
- JavaScript

## Future Roadmap

- [ ] Real opportunity/event data integration at scale
- [ ] Password reset functionality
- [ ] OAuth integration (Google, Apple Sign In)
- [ ] Email verification
- [ ] Push notifications for new matches and status updates
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Advanced search filters
- [ ] Profile photo upload

## Developer Credits

**Lead Developer:** Basel Ghrayeb

**Supporting Developers:** Anna Samofalova
