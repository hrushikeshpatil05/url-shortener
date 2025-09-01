import express from "express";
import { nanoid } from "nanoid";

const app = express();
const PORT = 8000;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple middleware to log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});
app.use(express.json());

// Store URLs in memory
const urls = new Map();

// Test route
app.get("/", (req, res) => {
  res.send("URL Shortener API is running");
});

// Create short URL
app.post("/shorten", (req, res) => {
  console.log('Received request body:', req.body);
  
  const { url } = req.body;
  if (!url) {
    console.log('URL is missing in request');
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const id = nanoid(6);
    urls.set(id, url);
    
    const shortUrl = `http://localhost:${PORT}/r/${id}`;
    console.log('Generated short URL:', shortUrl);
    res.json({ shortUrl });
  } catch (error) {
    console.error('Error generating short URL:', error);
    res.status(500).json({ error: "Failed to generate short URL" });
  }
});

// Redirect to original URL
app.get("/r/:id", (req, res) => {
  const url = urls.get(req.params.id);
  if (url) {
    res.redirect(url);
  } else {
    res.status(404).json({ error: "URL not found" });
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Try accessing: http://localhost:${PORT}`);
});
