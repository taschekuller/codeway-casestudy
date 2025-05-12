# VersionApp - Configuration Management System

A full-stack application for managing application configuration parameters, built with Vue.js (frontend) and NestJS (backend). This system allows administrators to create, update, and manage configuration parameters for mobile applications.

## Repository Structure

This repository contains both frontend and backend applications:

- `VersionApp-FE/`: Vue.js frontend application
- `VersionApp-BE/`: NestJS backend application

## Prerequisites

- Node.js 18.x or later
- npm 8.x or later
- Firebase account with Authentication and Firestore enabled
- Firebase Admin SDK service account credentials

## Frontend Setup (VersionApp-FE)

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd VersionApp-FE
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following content:
   ```
   # API Configuration
   VITE_API_BASE_URL=http://localhost:3000

   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

   Replace the Firebase configuration values with your own from the Firebase console.

### Development

Start the development server:

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`.

### Building for Production

```bash
npm run build
```

This will create a production-ready build in the `dist` directory.

## Backend Setup (VersionApp-BE)

### Installation

1. Navigate to the backend directory:
   ```bash
   cd VersionApp-BE
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase credentials:

   a. Go to your Firebase console
   b. Navigate to Project settings > Service accounts
   c. Generate a new private key (this will download a JSON file)
   d. Rename the downloaded file to `firebase-service-account.json`
   e. Place this file in the `src/config` directory

4. Create a `.env` file with the following content:
   ```
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Firebase Admin SDK Configuration
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
   FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
   FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com

   # CORS Configuration
   ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend-domain.com

   # Firestore Configuration
   FIRESTORE_COLLECTION_APP_CONFIG=app-config
   ```

   Note: For `FIREBASE_PRIVATE_KEY`, include the quotes and paste the entire private key from your service account JSON file, including newline characters.

### Development

Start the development server:

```bash
npm run start:dev
```

This will start the server in development mode with hot-reload at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

This will create a production-ready build in the `dist` directory.

## Running the Full Stack Application

1. Start the backend server:
   ```bash
   cd VersionApp-BE
   npm run start:dev
   ```

2. In a separate terminal, start the frontend development server:
   ```bash
   cd VersionApp-FE
   npm run dev
   ```

3. Access the application in your browser at `http://localhost:5173`

## Deployment

### Frontend Deployment Options

#### Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   cd VersionApp-FE
   firebase init
   ```
   - Select "Hosting" when prompted
   - Select your Firebase project
   - Specify `dist` as your public directory
   - Configure as a single-page app? Yes

4. Build the project:
   ```bash
   npm run build
   ```

5. Deploy to Firebase:
   ```bash
   firebase deploy --only hosting
   ```

## Environment Variables Reference

### Frontend Environment Variables

```
# API Configuration
VITE_API_BASE_URL=http://localhost:3000  # URL of your backend API

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

### Backend Environment Variables

```
# Server Configuration
PORT=3000                      # Port the server will run on
NODE_ENV=development           # Environment (development, production, test)

# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend-domain.com

# Firestore Configuration
FIRESTORE_COLLECTION_APP_CONFIG=app-config
```

## Authentication Flow

1. Users sign in using Firebase Authentication on the frontend
2. Upon successful authentication, a Firebase ID token is obtained
3. This token is sent in the Authorization header for backend API requests
4. The backend validates this token using Firebase Admin SDK
5. The token is automatically refreshed when needed

## Common Issues and Troubleshooting

### CORS Issues

If you encounter CORS errors:
1. Ensure the `ALLOWED_ORIGINS` in the backend `.env` file includes your frontend URL
2. Check that your frontend is sending the correct headers with API requests

### Firebase Authentication Issues

1. Verify Firebase configuration in both frontend and backend
2. Ensure Firebase Authentication is enabled in your Firebase project
3. For the backend, check that the service account has the necessary permissions

### Deployment Issues

1. Ensure all environment variables are properly set in your deployment environment
2. For Firebase deployments, verify that you're using the correct Firebase project
3. For containerized deployments, ensure the container has access to the necessary secrets

## License

[MIT License](LICENSE)