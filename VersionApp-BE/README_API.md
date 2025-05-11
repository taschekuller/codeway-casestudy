# App Configuration API

This NestJS API provides endpoints for managing app configurations using Firebase Authentication and Firestore database.

## Features

- Firebase Authentication for panel users
- API Token authentication for mobile clients
- CRUD operations for app configurations
- Firestore database integration
- Validation using class-validator

## Authentication

### Panel Users (Admin)

Panel users need to authenticate using Firebase Authentication. The API validates Firebase ID tokens for all admin operations.

Include the Firebase ID token in the request headers:
```
Authorization: Bearer <firebase-id-token>
```

### Mobile Clients

Mobile clients need to use a predefined API token for accessing the configurations.

Include the API token in the request headers:
```
Authorization: Bearer <api-token>
```

## Environment Variables

Create a `.env` file with the following variables:

```
PORT=3000

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL=your-client-email@example.com
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com

# API Token for Authentication
API_TOKEN=your-api-token
```

## API Endpoints

### Panel User Endpoints (requires Firebase Authentication)

- **GET /app-config/admin** - Get all app configurations
- **GET /app-config/admin/:id** - Get a specific app configuration
- **POST /app-config** - Create a new app configuration
- **PUT /app-config/:id** - Update an existing app configuration
- **DELETE /app-config/:id** - Delete an app configuration

### Mobile Client Endpoints (requires API Token)

- **GET /app-config/:id** - Get a specific app configuration

## Request/Response Examples

### Create App Configuration

**Request (POST /app-config)**
```json
{
  "appVersion": "1.0.0",
  "forceUpdate": false,
  "minRequiredVersion": "0.9.0",
  "maintenanceMode": false,
  "features": {
    "darkMode": true,
    "notifications": true
  },
  "remoteConfig": {
    "timeout": 3000,
    "cacheExpiration": 3600
  }
}
```

**Response**
```json
{
  "id": "abc123",
  "appVersion": "1.0.0",
  "forceUpdate": false,
  "minRequiredVersion": "0.9.0",
  "maintenanceMode": false,
  "features": {
    "darkMode": true,
    "notifications": true
  },
  "remoteConfig": {
    "timeout": 3000,
    "cacheExpiration": 3600
  },
  "createdAt": "2023-07-20T12:00:00.000Z",
  "updatedAt": "2023-07-20T12:00:00.000Z"
}
```

### Update App Configuration

**Request (PUT /app-config/:id)**
```json
{
  "forceUpdate": true,
  "maintenanceMode": true
}
```

**Response**
```json
{
  "id": "abc123",
  "appVersion": "1.0.0",
  "forceUpdate": true,
  "minRequiredVersion": "0.9.0",
  "maintenanceMode": true,
  "features": {
    "darkMode": true,
    "notifications": true
  },
  "remoteConfig": {
    "timeout": 3000,
    "cacheExpiration": 3600
  },
  "createdAt": "2023-07-20T12:00:00.000Z",
  "updatedAt": "2023-07-20T13:00:00.000Z"
}
```

## Installation and Running

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env` file
4. Start the application:
   ```bash
   npm run start
   ```
5. For development with auto-reload:
   ```bash
   npm run start:dev
   ```