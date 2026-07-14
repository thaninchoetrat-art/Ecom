import { initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import serviceAccount from "./serviceAccountKey.json" with { type: "json" };

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://ecom-89fd2-default-rtdb.firebaseio.com",
});

export const db = getDatabase();