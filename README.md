# Forsa

A React Native mobile application connecting users with opportunities, powered by Appwrite.

## Description

Forsa is a cross-platform mobile app built with React Native and Expo. Users can create profiles, specify their skills and interests, and discover opportunities matched to their preferences. The app features a complete authentication system and personalized opportunity matching.

## Features

- User Registration & Authentication
- Email & Password validation
- Secure session management with Appwrite
- Multi-step profile building
  - Location & Education selection
  - Skills selection (with custom skill input)
  - Interests selection (with custom interest input)
- User Profile management
- Opportunity browsing
  - Top Matches (personalized)
  - Other Matches
  - All Opportunities with search
- Clean, responsive UI design
- Cross-platform support (iOS & Android)

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Appwrite account and project

### Steps to Run

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the app: `npx expo start`

## Project Structure

```
Forsa/
├── app/
│   ├── config/
│   │   └── appwrite-config.js
│   ├── services/
│   │   ├── auth-service.js
│   │   └── profile-service.js
│   ├── AllOpportunities.jsx
│   ├── BuildProfile.jsx
│   ├── BuildProfileInterests.jsx
│   ├── BuildProfileSkills.jsx
│   ├── index.jsx
│   ├── OpportunityDetail.jsx
│   ├── OtherMatches.jsx
│   ├── Profile.jsx
│   ├── Sign-in.jsx
│   ├── Sign-up.jsx
│   └── TopMatches.jsx
├── assets/
│   └── images/
│       ├── home-icon.png
│       ├── icon.png
│       ├── Logo.png
│       └── Search.png
├── package.json
└── README.md
```

## Technologies Used

- React Native
- Expo
- Expo Router (for navigation)
- Appwrite (Backend as a Service)
- AsyncStorage (for temporary data storage)
- JavaScript

## Future Roadmap

- [ ] Opportunity matching algorithm
- [ ] Save opportunities feature
- [ ] Real opportunity data integration
- [ ] Password reset functionality
- [ ] OAuth integration (Google, Apple Sign In)
- [ ] Email verification
- [ ] Push notifications for new matches
- [ ] User profile editing
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Advanced search filters

## Developer Credits

**Lead Developer:** Basel Ghrayeb

**Dev of the Month:** Basel Ghrayeb

**Supporting Developers:** Anna Samofalova

## Contributing

This project is open for collaboration. More developers will be joining soon to expand functionality and features.

