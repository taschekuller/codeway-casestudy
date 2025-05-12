# VersionApp Backend

A NestJS-based backend API for managing application configurations. This API provides endpoints for managing, retrieving, and updating configuration parameters used by mobile applications.

## Features

- RESTful API for configuration management
- Firebase Authentication integration
- Firestore database integration
- Input validation
- Error handling

## Tech Stack

- NestJS framework
- Firebase Admin SDK
- Firestore Database
- TypeScript
- Jest for testing

## Prerequisites

- Node.js 18.x or later
- npm 8.x or later
- Firebase project with Firestore and Authentication enabled
- Firebase Admin SDK service account credentials

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
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

4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   NODE_ENV=development
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   FIREBASE_PRIVATE_KEY="your_firebase_private_key"
   FIREBASE_DATABASE_URL=https://your-firebase-database-url.firebaseio.com
   FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend-domain.com
   FIRESTORE_COLLECTION_APP_CONFIG=app-config
   ```

   Note: For `FIREBASE_PRIVATE_KEY`, include the quotes and paste the entire private key from your service account JSON file, including newline characters.

## Development

Start the development server:

```bash
npm run start:dev
```

This will start the server in development mode with hot-reload at `http://localhost:3000`.

## Building for Production

```bash
npm run build
```

This will create a production-ready build in the `dist` directory.

## Running in Production

```bash
npm run start:prod
```

## API Documentation

Once the server is running, you can access the Swagger API documentation at:
```
http://localhost:3000/api-docs
```

### Main Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | /app-config/client | Get active app configuration for client | No |
| GET | /app-config/admin | Get all configurations (admin) | Yes |
| GET | /app-config/admin/:id | Get configuration by ID (admin) | Yes |
| POST | /app-config | Create new configuration | Yes |
| PUT | /app-config/:id | Update configuration | Yes |
| DELETE | /app-config/:id | Delete configuration | Yes |

## Deployment

### Deploying to Firebase Cloud Functions

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
   firebase init functions
   ```
   - Select your Firebase project
   - Choose JavaScript or TypeScript
   - Install dependencies? Yes

4. Modify the `functions/index.js` file to serve your NestJS app:
   ```javascript
   const functions = require('firebase-functions');
   const { NestFactory } = require('@nestjs/core');
   const { ExpressAdapter } = require('@nestjs/platform-express');
   const express = require('express');
   const { AppModule } = require('./dist/app.module');

   const server = express();

   const createNestServer = async (expressInstance) => {
     const app = await NestFactory.create(
       AppModule,
       new ExpressAdapter(expressInstance),
     );
     return app.init();
   };

   createNestServer(server)
     .then(() => console.log('NestJS ready'))
     .catch(err => console.error('NestJS error', err));

   exports.api = functions.https.onRequest(server);
   ```

5. Build the NestJS app and deploy:
   ```bash
   npm run build
   firebase deploy --only functions
   ```

## Environment Variables

Here's a detailed list of all environment variables needed for the backend:

```
# Server Configuration
PORT=3000                      # Port the server will run on
NODE_ENV=development           # Environment (development, production, test)

# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
FIREBASE_DATABASE_URL=https://your-firebase-database-url.firebaseio.com
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket

# Firestore Configuration
FIRESTORE_COLLECTION_APP_CONFIG=app-config
```

## Docker Deployment

A Dockerfile is included in the repository for containerized deployment:

```Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

Build and run the Docker container:

```bash
docker build -t versionapp-be .
docker run -p 3000:3000 --env-file .env versionapp-be
```

## Authentication

This API uses Firebase Authentication. Protected endpoints require a valid Firebase JWT token in the `Authorization` header:

```
Authorization: Bearer <firebase_jwt_token>
```

## Error Handling

The API provides detailed error responses with appropriate HTTP status codes:

- 400: Bad Request (validation errors)
- 401: Unauthorized (authentication issues)
- 403: Forbidden (authorization issues)
- 404: Not Found (resource not found)
- 500: Internal Server Error (server-side issues)

## Troubleshooting

### Firebase Connection Issues

- Verify your Firebase service account credentials
- Check that Firestore is enabled in your Firebase project
- Make sure the service account has appropriate permissions

### Authentication Issues

- Ensure Firebase Authentication is properly configured
- Check that the client is sending the correct Authorization header
- Verify that user accounts have the necessary permissions

## License

[MIT License](LICENSE)
