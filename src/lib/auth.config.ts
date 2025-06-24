import Google from "next-auth/providers/google";

// Load environment variables from config file
const envConfig = require("../../env.config.js");

export const authConfig = {
  providers: [
    Google({
      clientId: envConfig.AUTH_GOOGLE_ID,
      clientSecret: envConfig.AUTH_GOOGLE_SECRET,
    }),
  ],
};
