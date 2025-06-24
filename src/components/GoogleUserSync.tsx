"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useHydratedStore } from "@/lib/store";
import { debugAuthFlow } from "@/lib/auth-debug";
import { autoRefreshGoogleProfile } from "@/lib/google-profile-refresh";

export default function GoogleUserSync() {
  const { data: session, status } = useSession();
  const { isAuthenticated, user, login } = useHydratedStore();
  const syncInProgress = useRef(false);
  const lastProcessedUser = useRef<string | null>(null);

  useEffect(() => {
    // Helper function to check if sync is needed
    const needsSync = () => {
      return (
        status === "authenticated" &&
        session?.user?.email &&
        !isAuthenticated &&
        !syncInProgress.current &&
        lastProcessedUser.current !== session.user.email
      );
    };

    // Helper function to check if user already synced but state not updated
    const needsStateUpdate = () => {
      return (
        status === "authenticated" &&
        session?.user?.email &&
        !isAuthenticated &&
        lastProcessedUser.current === session.user.email
      );
    };

    // Debug logging
    debugAuthFlow.nextAuthSession(status, session);
    debugAuthFlow.freshkoStore(isAuthenticated, user);

    console.log("🔄 GoogleUserSync Check:", {
      status,
      sessionEmail: session?.user?.email,
      isAuthenticated,
      syncInProgress: syncInProgress.current,
      lastProcessedUser: lastProcessedUser.current,
      needsSync: needsSync(),
      needsStateUpdate: needsStateUpdate(),
    });

    if (needsSync()) {
      performGoogleUserSync();
    } else if (needsStateUpdate()) {
      // Force re-login to update state
      retryLogin();
    } else if (
      status === "authenticated" &&
      session?.user?.email &&
      isAuthenticated &&
      user
    ) {
      // Auto-refresh Google profile for existing authenticated users
      autoRefreshGoogleProfile(user, session);
    }
  }, [status, session?.user?.email, isAuthenticated]);

  const performGoogleUserSync = async () => {
    if (!session?.user?.email || syncInProgress.current) return;

    syncInProgress.current = true;
    const userEmail = session.user.email;

    debugAuthFlow.googleSync("Starting Sync", { userEmail }, true);
    console.log("🚀 Starting Google user sync for:", userEmail);

    try {
      // Try to get enhanced profile data from sessionStorage first
      let enhancedProfile = null;
      try {
        const storedProfile = sessionStorage.getItem("freshko-google-signin");
        if (storedProfile) {
          enhancedProfile = JSON.parse(storedProfile);
          // Clean up temporary storage
          sessionStorage.removeItem("freshko-google-signin");
        }
      } catch (error) {
        console.warn("Could not parse stored Google profile:", error);
      }

      // Enhanced Google profile data extraction with fallbacks
      const profileData = enhancedProfile || {};
      const firstName =
        profileData.firstName ||
        session.user.name?.split(" ")[0] ||
        userEmail.split("@")[0] ||
        "Google User";
      const lastName =
        profileData.lastName ||
        session.user.name?.split(" ").slice(1).join(" ") ||
        "";
      const avatar = profileData.image || session.user.image || "";

      // Create user data with enhanced Google profile information
      const userData = {
        id: `google_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        firstName: firstName,
        lastName: lastName,
        email: userEmail,
        phone: "",
        role: "user" as const,
        createdAt: new Date().toISOString(),
        avatar: avatar,
      };

      // Enhanced debug logging with Google profile details
      debugAuthFlow.googleSync(
        "Google Profile Extracted",
        {
          enhancedProfile,
          sessionUserName: session.user.name,
          sessionUserImage: session.user.image,
          extractedFirstName: firstName,
          extractedLastName: lastName,
          extractedAvatar: avatar,
          email: userEmail,
        },
        true
      );

      debugAuthFlow.googleSync("User Data Created", userData, true);
      console.log("📝 Google Profile Processing:", {
        enhancedProfile,
        sessionUser: {
          name: session.user.name,
          image: session.user.image,
          email: session.user.email,
        },
        extracted: {
          firstName,
          lastName,
          avatar,
        },
      });
      console.log("📝 Created user data:", userData);

      // Save to localStorage using direct access (bypass store functions)
      await saveGoogleUserToStorage(userData);

      // Mark as processed
      lastProcessedUser.current = userEmail;

      // Attempt auto-login with retry mechanism
      await attemptAutoLogin(userEmail);
    } catch (error) {
      debugAuthFlow.error("Google Sync", error);
      console.error("❌ Error in Google user sync:", error);
    } finally {
      syncInProgress.current = false;
    }
  };

  const saveGoogleUserToStorage = async (userData: any) => {
    try {
      let users = [];
      const existingUsers = localStorage.getItem("freshko-users");

      if (existingUsers) {
        users = JSON.parse(existingUsers);
      }

      // Check if user already exists
      const existingUserIndex = users.findIndex(
        (u: any) => u.email.toLowerCase() === userData.email.toLowerCase()
      );

      if (existingUserIndex === -1) {
        // Add new user
        users.push(userData);
        debugAuthFlow.storageOperation("Add New Google User", userData, true);
        console.log("✅ Adding new Google user to storage");
      } else {
        // Update existing user with Google data, prioritizing Google profile info
        const updatedUser = {
          ...users[existingUserIndex],
          ...userData,
          // Preserve original ID if it exists
          id: users[existingUserIndex].id || userData.id,
          // Always update with latest Google profile data
          firstName: userData.firstName,
          lastName: userData.lastName,
          avatar: userData.avatar || users[existingUserIndex].avatar,
        };
        users[existingUserIndex] = updatedUser;
        debugAuthFlow.storageOperation(
          "Update Existing User with Google Profile",
          updatedUser,
          true
        );
        console.log("🔄 Updating existing user with Google data");
      }

      localStorage.setItem("freshko-users", JSON.stringify(users));
      console.log("💾 User data saved to localStorage");
    } catch (error) {
      console.error("❌ Error saving user to storage:", error);
      throw error;
    }
  };

  const attemptAutoLogin = async (email: string, retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      console.log(`🔐 Auto-login attempt ${attempt}/${retries} for:`, email);

      try {
        const result = await login(email, "google-oauth-login");

        if (result.success) {
          console.log("🎉 Google user successfully logged in!");
          return;
        } else {
          console.warn(`❌ Login attempt ${attempt} failed:`, result.message);

          if (attempt === retries) {
            // Final attempt - force state update
            console.log("🔄 Final attempt failed, forcing state update...");
            await forceStateUpdate(email);
          } else {
            // Wait before retry
            await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
          }
        }
      } catch (error) {
        console.error(`❌ Login attempt ${attempt} error:`, error);

        if (attempt === retries) {
          await forceStateUpdate(email);
        }
      }
    }
  };

  const retryLogin = async () => {
    if (!session?.user?.email) return;

    console.log(
      "🔄 Retrying login for already processed user:",
      session.user.email
    );
    await attemptAutoLogin(session.user.email, 2);
  };

  const forceStateUpdate = async (email: string) => {
    console.log("⚡ Force updating store state for:", email);

    try {
      // Get user from storage
      const users = JSON.parse(localStorage.getItem("freshko-users") || "[]");
      const user = users.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (user) {
        // Dispatch custom event for fallback authentication
        window.dispatchEvent(
          new CustomEvent("google-user-login", {
            detail: user,
          })
        );

        console.log("✅ Store state force updated via event");
      }
    } catch (error) {
      console.error("❌ Error force updating state:", error);
    }
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      syncInProgress.current = false;
    };
  }, []);

  return null;
}
