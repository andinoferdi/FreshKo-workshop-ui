"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useHydratedStore } from "@/lib/store";

export default function GoogleUserSync() {
  const { data: session, status } = useSession();
  const { isAuthenticated, user, initializeOriginalData } = useHydratedStore();

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

      // Create user data in FreshKo format
      const userData = {
        id: googleUser.id || Date.now().toString(),
        firstName: googleUser.name?.split(" ")[0] || "",
        lastName: googleUser.name?.split(" ").slice(1).join(" ") || "",
        email: googleUser.email || "",
        phone: "",
        role: "customer" as const,
        createdAt: new Date().toISOString(),
        avatar: googleUser.image || "", // Use avatar field to match User interface
      };

      console.log("📝 Created user data:", userData);

      // Get existing users
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
        // Add new user
        users.push(userData);
        localStorage.setItem("freshko-users", JSON.stringify(users));
        console.log(
          "✅ New Google user added to FreshKo store:",
          userData.email
        );
      } else {
        // Update existing user avatar
        users[existingUserIndex].avatar = userData.avatar;
        localStorage.setItem("freshko-users", JSON.stringify(users));
        console.log(
          "🔄 Existing Google user updated in FreshKo store:",
          userData.email
        );
      }

      // Set as current user
      localStorage.setItem("freshko-current-user", JSON.stringify(userData));
      console.log("💾 User data saved to localStorage");

      // Initialize data to refresh the store
      initializeOriginalData();
      console.log("🔄 Store initialized");

      // Dispatch event to notify store update without page reload
      window.dispatchEvent(
        new CustomEvent("userCreated", { detail: userData })
      );
      console.log("📡 userCreated event dispatched");

      // Force a small delay and then reload to ensure proper state sync
      setTimeout(() => {
        console.log("🔄 Reloading page to complete sync...");
        window.location.reload();
      }, 1000);

      console.log("🎉 Google user successfully synced to FreshKo store!");
    } catch (error) {
      console.error("❌ Error syncing Google user to FreshKo store:", error);
    }
  };

  // This component doesn't render anything
  return null;
}
