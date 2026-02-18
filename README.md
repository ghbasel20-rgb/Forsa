# Forsa

A React Native mobile application with secure user authentication powered by Appwrite.

## Description

Forsa is a cross-platform mobile app built with React Native and Expo, featuring user authentication through Appwrite's backend services. The app provides a clean, modern interface for users to sign up and sign in securely.

## Features

- User Registration (Sign Up)
- User Authentication (Sign In)
- Email & Password validation
- Secure session management with Appwrite
- Clean, responsive UI design
- Cross-platform support (iOS & Android)

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Appwrite account and project

### Steps to Run

1. Clone the repository:
```bash
git clone https://github.com/ghbasel20-rgb/Forsa.git
cd Forsa
```

2. Install dependencies:
```bash
npm install
```

3. Configure Appwrite:
   - Open `app/config/appwrite-config.js`
   - Replace `YOUR_PROJECT_ID` with your Appwrite Project ID
   - Ensure your platform (iOS/Android) is added in Appwrite console

4. Run the app:
```bash
npx expo start
```

5. Choose your platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

## Current Project Structure

```
Forsa/
├── app/
│   ├── config/
│   │   └── appwrite-config.js
│   ├── services/
│   │   └── auth-service.js
│   ├── Sign-in.jsx
│   ├── Sign-up.jsx
│   └── index.jsx
├── assets/
├── package.json
└── README.md
```

## Technologies Used

- React Native
- Expo
- Appwrite (Backend as a Service)
- JavaScript

## Future Roadmap

- [ ] Password reset functionality
- [ ] OAuth integration (Google, Apple Sign In)
- [ ] User profile management
- [ ] Email verification
- [ ] Remember me functionality
- [ ] Dark mode support
- [ ] Multi-language support

## Developer Credits

**Lead Developer:** Basel Ghrayeb
**dev of the month** Basel Ghrayeb

## Contributing

This project is open for collaboration. More developers will be joining soon to expand functionality and features.

