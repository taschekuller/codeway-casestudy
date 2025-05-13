"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirestore = exports.initializeFirebase = void 0;
const firebase = require("firebase-admin");
const initializeFirebase = (configService) => {
    try {
        const serviceAccount = {
            projectId: configService.get('PROJECT_ID'),
            privateKey: configService
                .get('PRIVATE_KEY')
                ?.replace(/\\n/g, '\n'),
            clientEmail: configService.get('CLIENT_EMAIL'),
        };
        if (!firebase.apps.length) {
            firebase.initializeApp({
                credential: firebase.credential.cert(serviceAccount),
                databaseURL: configService.get('DATABASE_URL'),
            });
            console.log('Firebase initialized successfully');
        }
        else {
            console.log('Firebase already initialized');
        }
        return firebase;
    }
    catch (error) {
        console.error('Error initializing Firebase:', error);
        throw error;
    }
};
exports.initializeFirebase = initializeFirebase;
const getFirestore = () => {
    if (!firebase.apps.length) {
        throw new Error('Firebase has not been initialized. Call initializeFirebase first.');
    }
    return firebase.firestore();
};
exports.getFirestore = getFirestore;
//# sourceMappingURL=firebase-config.js.map