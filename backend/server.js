
"use strict";

// ==========================================
// STARD RIFT - BACKEND SERVER
// Space Photography Journal
// ==========================================

// ==========================================
// 1. IMPORT DEPENDENCIES
// ==========================================

const express = require("express");
const cors = require("cors");
require("dotenv").config();

// ==========================================
// 2. SERVER CONFIGURATION
// ==========================================

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ==========================================
// 3. HOME / TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Stardrift API! 🌌",
    status: "running"
  });
});

// ==========================================
// 4. NASA ASTRONOMY PICTURE OF THE DAY
// ==========================================

// GET /api/apod
// Retrieves NASA's Astronomy Picture of the Day.
// Optionally accepts a date: /api/apod?date=2026-11-20

app.get("/api/apod", async (req, res) => {
  try {
    const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";

    const nasaURL = new URL(
      "https://api.nasa.gov/planetary/apod"
    );

    nasaURL.searchParams.set("api_key", apiKey);

    // Optional date for the Explore page
    if (req.query.date) {
      const date = req.query.date;

      // Check date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({
          error: "Date must use YYYY-MM-DD format."
        });
      }

      nasaURL.searchParams.set("date", date);
    }

    // Request astronomy data from NASA
    const response = await fetch(nasaURL);

    if (!response.ok) {
      console.error("NASA API error:", response.status);

      return res.status(502).json({
        error: "Unable to retrieve NASA astronomy data.",
        nasaStatus: response.status
      });
    }

    // Send NASA's data to the frontend
    const data = await response.json();

    res.json(data);

  } catch (error) {
    console.error("NASA request failed:", error.message);

    res.status(500).json({
      error: "An error occurred while contacting NASA."
    });
  }
});

// ==========================================
// 5. UNKNOWN ROUTES
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found."
  });
});

// ==========================================
// 6. START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log("----------------------------------");
  console.log("🌌 Stardrift Backend Server");
  console.log(`Server running on port ${PORT}`);
  console.log(`Local URL: http://localhost:${PORT}`);
  console.log("----------------------------------");
});

