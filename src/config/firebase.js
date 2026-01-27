import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bk-iot-26-default-rtdb.asia-southeast1.firebasedatabase.app"
});

export const db = admin.database();
