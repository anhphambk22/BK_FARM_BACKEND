import express from "express";
import { db } from "../config/firebase.js";
const router = express.Router();

// Lấy toàn bộ dữ liệu cảm biến
router.get("/all", async (req, res) => {
  try {
    const ref = db.ref("sensor-data");
    ref.once("value", (snapshot) => {
      res.json(snapshot.val());
    }, (error) => {
      res.status(500).json({ error: error.message });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
