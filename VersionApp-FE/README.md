# VersionApp Frontend

A modern Vue.js application for managing application configurations and parameters. This frontend provides an intuitive interface for administrators to manage configuration parameters used by mobile applications.

## Features

- User authentication with Firebase
- Parameter management (create, read, update, delete)
- Responsive design for mobile and desktop
- Automatic token refresh
- Sorting and filtering capabilities

## Tech Stack

- Vue 3 with Composition API
- Vite for build tooling
- Tailwind CSS for styling
- Firebase Authentication
- Axios for API requests

## Prerequisites

- Node.js 18.x or later
- npm 8.x or later
- Firebase account with Authentication enabled
- Backend API running (see the backend README)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd VersionApp-FE
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_API_BASE_URL=http://localhost:3000
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

   Replace the Firebase configuration values with your own from the Firebase console.

## Development

Start the development server:

```bash
npm run dev
```

This will start the development server at `http://localhost:5173` (or another port if 5173 is in use).

## Building for Production

```bash
npm run build
```

This will create a production-ready build in the `dist` directory.

## Deployment

### Deploying to Firebase Hosting

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
   firebase init
   ```
   - Select "Hosting" when prompted
   - Select your Firebase project
   - Specify `dist` as your public directory
   - Configure as a single-page app? Yes
   - Set up automatic builds and deploys with GitHub? (Your choice)

4. Build the project:
   ```bash
   npm run build
   ```

5. Deploy to Firebase:
   ```bash
   firebase deploy --only hosting
   ```

### Deploying to Netlify

1. Create a `netlify.toml` file in the root directory:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. Deploy using the Netlify CLI or connect your GitHub repository through the Netlify dashboard.

### Deploying to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

## Environment Variables

Here's a detailed list of all environment variables needed for the frontend:

```
# API Configuration
VITE_API_BASE_URL=http://localhost:3000  # URL of your backend API

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

## Project Structure

```
VersionApp-FE/
├── public/            # Static assets
├── src/
│   ├── assets/        # Application assets
│   │   ├── home/      # Dashboard and home-related components
│   │   ├── signin/    # Authentication components
│   │   └── ui/        # Reusable UI components
│   ├── constants/     # Application constants
│   ├── hooks/         # Vue composition hooks
│   ├── lib/           # Utility libraries
│   ├── router/        # Vue Router configuration
│   ├── services/      # API services
│   ├── types/         # TypeScript type definitions
│   ├── views/         # Page components
│   ├── App.vue        # Main application component
│   └── main.js        # Application entry point
├── .env               # Environment variables
├── index.html         # HTML entry point
├── package.json       # Project dependencies
├── tailwind.config.js # Tailwind CSS configuration
└── vite.config.js     # Vite configuration
```

## Authentication

The application uses Firebase Authentication. Users need to be authenticated to access the application. The authentication flow is handled by the `useAuth` hook.

## API Calls

API calls are made using Axios with an instance configured in `src/services/httpClient.js`. The instance includes interceptors for handling authentication tokens and refreshing them when needed.

## Custom Hooks

The application uses several custom hooks to encapsulate reusable logic:

- `useAuth`: Handles authentication with Firebase
- `useDateFormat`: Handles date formatting with Firestore timestamp support
- `useTokenManagement`: Manages authentication tokens and refreshing
- `useSortableData`: Provides sorting functionality for lists

## Troubleshooting

### API Connection Issues

- Ensure the backend API is running and accessible
- Check the `VITE_API_BASE_URL` in your `.env` file
- Check browser console for CORS errors

### Authentication Issues

- Verify your Firebase configuration in the `.env` file
- Ensure Firebase Authentication is enabled in your Firebase project
- Check if the user has the necessary permissions

## License

[MIT License](LICENSE)
