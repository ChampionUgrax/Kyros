const { initializeApp, getApps, cert, applicationDefault } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const fs = require("node:fs");

function getCredential() {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (serviceAccountJson) {
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountJson);
    } catch {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON must contain valid JSON");
    }
    return cert(serviceAccount);
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    if (!fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
      throw new Error("The GOOGLE_APPLICATION_CREDENTIALS file does not exist. Set it to the full path of a valid Firebase service-account JSON file.");
    }
    return applicationDefault();
  }

  throw new Error(
    "Firebase Admin credentials are not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS on the server."
  );
}

const app =
  getApps().length === 0
    ? initializeApp({
        credential: getCredential(),
        projectId: process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT,
      })
    : getApps()[0];

const db = getFirestore(app);
const auth = getAuth(app);

module.exports = {
  app,
  db,
  auth,
};
