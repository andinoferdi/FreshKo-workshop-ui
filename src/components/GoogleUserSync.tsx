"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useHydratedStore } from "@/lib/store";

export default function GoogleUserSync() {
  const { data: session, status } = useSession();
  const { isAuthenticated, user, initializeOriginalData } = useHydratedStore();
  const store = useHydratedStore();

  // Enhanced debug logging
  console.log(
    "GoogleUserSync - Status:",
    status,
    "Session:",
    session
      ? {
          email: session.user?.email,
          name: session.user?.name,
          image: session.user?.image,
          hasSession: true,
        }
      : "No session",
    "IsAuth:",
    isAuthenticated,
    "User:",
    user?.email
  );

  useEffect(() => {
    console.log("GoogleUserSync useEffect triggered:", {
      status,
      userEmail: session?.user?.email,
      isAuthenticated,
      sessionExists: !!session,
      userExists: !!session?.user,
    });

    // Only proceed if we have an authenticated session with user data
    if (
      status === "authenticated" &&
      session?.user?.email &&
      !isAuthenticated
    ) {
      // Google user is authenticated but not in FreshKo store
      console.log("🚀 Starting Google user sync for:", session.user.email);

      // Add a flag to prevent multiple syncs
      const userEmail = session.user.email;
      const syncKey = `freshko-sync-${userEmail}`;

      if (!sessionStorage.getItem(syncKey)) {
        console.log("✨ No sync flag found, proceeding with sync...");
        sessionStorage.setItem(syncKey, "true");
        syncGoogleUserToStore(session.user);
      } else {
        console.log("✅ Sync already performed for this user");
      }
    } else if (
      status === "authenticated" &&
      session?.user?.email &&
      isAuthenticated
    ) {
      console.log(
        "✅ User already authenticated in both systems:",
        session.user.email
      );
    } else if (status === "loading") {
      console.log("⏳ Session still loading...");
    } else if (status === "unauthenticated") {
      console.log("❌ No authentication session found");
    }
  }, [status, session?.user?.email, isAuthenticated]); // Use email as dependency

  const syncGoogleUserToStore = async (googleUser: any) => {
    try {
      console.log("🔄 Starting sync process for Google user:", googleUser);

      // Create user data in FreshKo format - MATCH EXACTLY with store User interface
      const userData = {
        id: `google_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        firstName: googleUser.name?.split(" ")[0] || "",
        lastName: googleUser.name?.split(" ").slice(1).join(" ") || "",
        email: googleUser.email || "",
        phone: "",
        role: "user", // Use "user" role, not "customer" to match store
        createdAt: new Date().toISOString(),
        avatar: googleUser.image || "", // Google profile image
      };

      console.log("📝 Created user data:", userData);

      // Get existing users from localStorage
      let users = [];
      try {
        const existingUsers = localStorage.getItem("freshko-users");
        users = existingUsers ? JSON.parse(existingUsers) : [];
        console.log("📚 Found existing users:", users.length);
      } catch (error) {
        console.error("❌ Error parsing existing users:", error);
        users = [];
      }

      // Check if user already exists
      const existingUserIndex = users.findIndex(
        (u: any) => u.email === userData.email
      );

      if (existingUserIndex === -1) {
        // Add new Google user
        users.push(userData);
        localStorage.setItem("freshko-users", JSON.stringify(users));
        console.log(
          "✅ New Google user added to FreshKo store:",
          userData.email
        );
      } else {
        // Update existing user with Google data
        users[existingUserIndex] = { ...users[existingUserIndex], ...userData };
        localStorage.setItem("freshko-users", JSON.stringify(users));
        console.log(
          "🔄 Existing user updated with Google data:",
          userData.email
        );
      }

      // AUTO-LOGIN: Simulate the same login process as regular users
      // Use store's login method with a dummy password for Google users
      const { login } = store;

      try {
        // Save Google user in a way that the login method can find them
        const result = await login(userData.email, "google-oauth-login");

        if (!result.success) {
          // If login fails, try to set user state directly
          // This is a fallback for Google users
          console.log("🔄 Regular login failed, setting Google user directly");

          // Force state update by dispatching custom event
          window.dispatchEvent(
            new CustomEvent("google-user-login", {
              detail: userData,
            })
          );
        }

        console.log("🎉 Google user successfully logged in to FreshKo store!");
      } catch (error) {
        console.error("❌ Failed to auto-login Google user:", error);
      }

      // Remove sync flag after successful sync
      sessionStorage.removeItem(`freshko-sync-${userData.email}`);
    } catch (error) {
      console.error("❌ Error syncing Google user to FreshKo store:", error);
    }
  };

  // This component doesn't render anything
  return null;
}
