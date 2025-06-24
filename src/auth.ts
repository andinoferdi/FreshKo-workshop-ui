import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Load environment variables from config file
const envConfig = require("../env.config.js");

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret: envConfig.AUTH_SECRET,
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/account/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || "";
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.image = token.picture;
      }
      return session;
    },

    redirect() {
      return "/";
    },
  },
});
