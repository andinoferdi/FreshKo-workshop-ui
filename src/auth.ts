import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Load environment variables from config file
const envConfig = require("../env.config.js");

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret: envConfig.AUTH_SECRET,
  trustHost: true,
  basePath: "/api/auth",
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/account/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id || "";
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;

        // Add provider info for better sync tracking
        if (account?.provider) {
          token.provider = account.provider;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.image = token.picture;

        // Add provider info to session
        if (token.provider) {
          (session as any).provider = token.provider;
        }
      }
      return session;
    },

    async signIn({ user, account, profile }) {
      // Enhanced sign-in callback for Google OAuth
      if (account?.provider === "google" && user?.email) {
        console.log("🔐 Google OAuth sign-in detected for:", user.email);
        console.log("📋 Google Profile Data:", { user, profile });

        // Enhanced profile extraction from Google
        const googleProfile = profile as any;
        const enhancedUserData = {
          email: user.email,
          name:
            user.name ||
            googleProfile?.name ||
            `${googleProfile?.given_name || ""} ${
              googleProfile?.family_name || ""
            }`.trim(),
          firstName:
            googleProfile?.given_name ||
            user.name?.split(" ")[0] ||
            user.email?.split("@")[0],
          lastName:
            googleProfile?.family_name ||
            user.name?.split(" ").slice(1).join(" "),
          image: user.image || googleProfile?.picture,
          timestamp: Date.now(),
        };

        // Store enhanced user info temporarily for GoogleUserSync to pick up
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            "freshko-google-signin",
            JSON.stringify(enhancedUserData)
          );
        }

        console.log("💾 Stored enhanced Google profile:", enhancedUserData);
      }

      return true; // Allow sign in
    },

    redirect({ url, baseUrl }) {
      // Handle different environments
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      // For production deployment
      if (baseUrl.includes("freshko.vercel.app")) {
        return baseUrl;
      }

      // For local development
      if (baseUrl.includes("localhost")) {
        return baseUrl;
      }

      // Default fallback
      return baseUrl;
    },
  },
});
