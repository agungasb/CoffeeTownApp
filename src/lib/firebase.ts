import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;

// Only initialize if the config is valid.
// This prevents the app from crashing at module load time.
if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    try {
        app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        db = getFirestore(app);
        // Initialize Analytics only in the browser where it's supported
        if (typeof window !== 'undefined') {
            isSupported().then(supported => {
                if (supported) {
                    analytics = getAnalytics(app!);
                }
            });
        }
    } catch (e) {
        console.error("Failed to initialize Firebase", e);
        // db, app, and analytics will remain null
    }
}

export { db, app, analytics };
