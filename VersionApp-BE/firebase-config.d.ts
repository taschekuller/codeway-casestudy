import * as firebase from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
export declare const initializeFirebase: (configService: ConfigService) => typeof firebase;
export declare const getFirestore: () => firebase.firestore.Firestore;
