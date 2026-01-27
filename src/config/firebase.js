import admin from "firebase-admin";
import fs from "fs";

let serviceAccount;
if (process.env.RENDER) {
  // Render: đọc từ Secret File
  serviceAccount = JSON.parse(
    fs.readFileSync("/etc/secrets/FIREBASE_SERVICE_ACCOUNT", "utf8")
  );
} else {
  // Local: đọc từ file trong src/config
  serviceAccount = JSON.parse(
    fs.readFileSync(new URL("./serviceAccountKey.json", import.meta.url))
  );
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bk-iot-26-default-rtdb.asia-southeast1.firebasedatabase.app",
});

export const db = admin.database();
export default admin;