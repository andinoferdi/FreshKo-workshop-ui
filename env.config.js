// Environment configuration file
require("dotenv").config({ path: ".env.local" });

module.exports = {
  NEXTAUTH_URL:
    process.env.NEXTAUTH_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://freshko.vercel.app"
      : "http://localhost:3000"),
  AUTH_SECRET:
    process.env.AUTH_SECRET || "freshko-secret-key-2025-production-change-me",
  AUTH_GOOGLE_ID:
    process.env.AUTH_GOOGLE_ID ||
    "1076117647515-ler43v7batfuj3ocb1bvq2kg4apcu6qj.apps.googleusercontent.com",
  AUTH_GOOGLE_SECRET:
    process.env.AUTH_GOOGLE_SECRET || "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",
};
