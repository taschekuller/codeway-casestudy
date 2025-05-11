import * as firebase from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

export const initializeFirebase = (configService: ConfigService) => {
  try {
    const serviceAccount = {
      projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
      privateKey: configService
        .get<string>('FIREBASE_PRIVATE_KEY')
        ?.replace(/\\n/g, '\n'),
      clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
    };

    // Check if Firebase is already initialized
    if (!firebase.apps.length) {
      firebase.initializeApp({
        credential: firebase.credential.cert(
          serviceAccount as firebase.ServiceAccount,
        ),
        databaseURL: configService.get<string>('FIREBASE_DATABASE_URL'),
      });
      console.log('Firebase initialized successfully');
    } else {
      console.log('Firebase already initialized');
    }

    return firebase;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
};

export const getFirestore = () => {
  if (!firebase.apps.length) {
    throw new Error(
      'Firebase has not been initialized. Call initializeFirebase first.',
    );
  }
  return firebase.firestore();
};
