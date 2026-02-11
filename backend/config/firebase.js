const admin = require('firebase-admin');
const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = require('./env');
const logger = require('../utils/logger');

// Initialize Firebase Admin
let messaging = null;

try {
  // Check if Firebase Admin is already initialized
  if (!admin.apps.length) {
    // Option 1: Use service account from environment variables
    if (FIREBASE_PRIVATE_KEY && FIREBASE_CLIENT_EMAIL && FIREBASE_PROJECT_ID) {
        admin.initializeApp({
            credential: admin.credential.cert(
              JSON.parse(process.env.FIREBASE_PRIVATE_KEY)
            ),
          });
          
      logger.info('Firebase Admin initialized with environment variables');
    } 
    // Option 2: Use service account JSON file (if FIREBASE_SERVICE_ACCOUNT_PATH is set)
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      logger.info('Firebase Admin initialized with service account file');
    } 
    // Option 3: Use default credentials (for Google Cloud environments)
    else {
      admin.initializeApp();
      logger.info('Firebase Admin initialized with default credentials');
    }
  }

  messaging = admin.messaging();
  logger.info('Firebase Cloud Messaging initialized successfully');
} catch (error) {
  logger.warn('Firebase Admin initialization failed. Notifications will not work:', error.message);
  // Don't throw - allow server to start without Firebase
  messaging = null;
}

module.exports = { admin, messaging };

