// A dedicated service file for Firebase Admin SDK initialization.
// This keeps the main backend file clean and makes it easy to manage
// Firebase-related logic in one place.

const admin = require("firebase-admin");

// IMPORTANT: Do not hard-code your key here. Use an environment variable
// or a path to the file. This code assumes the key is mounted via Docker.
const serviceAccount = require(process.env.FIREBASE_ADMIN_KEY_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Export Firestore and admin for use in other files.
module.exports = {
  db,
  admin,
};
