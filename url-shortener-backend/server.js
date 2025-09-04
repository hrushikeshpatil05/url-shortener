import express from "express";
import { nanoid } from "nanoid";
import admin from "firebase-admin";
import fs from "fs";
import cors from "cors";
import Redis from "ioredis";

const app = express();
const PORT = 8000;

// ✅ Enable CORS (frontend: Vite default http://localhost:5173)
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Firebase Admin setup
const serviceAccount = JSON.parse(fs.readFileSync("firebase-key.json"));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
const urlsCollection = db.collection("urls");

// ✅ Redis setup (localhost:6379 by default)
const redis = new Redis();

// ✅ Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// --- Routes ---

// Test route
app.get("/", (req, res) => {
  res.send("🚀 URL Shortener API is running with Firestore + Redis!");
});

// ✅ Create short URL
app.post("/shorten", async (req, res) => {
  console.log("Received request body:", req.body);

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const id = nanoid(6);
    const shortUrl = `http://localhost:${PORT}/r/${id}`;

    // Save in Firestore
    await urlsCollection.doc(id).set({
      id,
      longUrl: url,
      shortUrl,
      createdAt: new Date(),
      clicks: 0,
    });

    // Save in Redis cache
    await redis.set(id, url);

    console.log("Generated short URL:", shortUrl);
    res.json({ shortUrl });
  } catch (error) {
    console.error("Error generating short URL:", error);
    res.status(500).json({ error: "Failed to generate short URL" });
  }
});

// ✅ Redirect to original URL (with cache)
app.get("/r/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Check Redis first
    const cachedUrl = await redis.get(id);
    if (cachedUrl) {
      console.log("✅ Cache hit:", id);

      // Increment clicks in Firestore (async, not blocking)
      urlsCollection.doc(id).update({
        clicks: admin.firestore.FieldValue.increment(1),
      });

      return res.redirect(cachedUrl);
    }

    // 2. If not in cache → Firestore
    const doc = await urlsCollection.doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "URL not found" });
    }

    const data = doc.data();

    // Save in cache
    await redis.set(id, data.longUrl);

    // Increment clicks
    await urlsCollection.doc(id).update({
      clicks: admin.firestore.FieldValue.increment(1),
    });

    res.redirect(data.longUrl);
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).json({ error: "Failed to redirect" });
  }
});

// ✅ (Optional) List all URLs
app.get("/urls", async (req, res) => {
  try {
    const snapshot = await urlsCollection.get();
    const urls = snapshot.docs.map(doc => doc.data());
    res.json(urls);
  } catch (error) {
    console.error("Error fetching URLs:", error);
    res.status(500).json({ error: "Failed to fetch URLs" });
  }
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`🔥 Server running at http://localhost:${PORT}`);
});
