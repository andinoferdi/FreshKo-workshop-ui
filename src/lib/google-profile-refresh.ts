// Google Profile Refresh Utility
// This utility helps update existing users with their Google profile data

import { debugAuthFlow } from "./auth-debug";

export const refreshGoogleProfile = async (email: string, session: any) => {
  try {
    debugAuthFlow.googleSync("Force Profile Refresh Started", { email }, true);

    // Get existing users
    const users = JSON.parse(localStorage.getItem("freshko-users") || "[]");
    const userIndex = users.findIndex(
      (u: any) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (userIndex === -1) {
      console.log("❌ User not found for profile refresh");
      return false;
    }

    // Extract Google profile data
    const firstName =
      session.user.name?.split(" ")[0] ||
      email.split("@")[0] ||
      users[userIndex].firstName;
    const lastName =
      session.user.name?.split(" ").slice(1).join(" ") ||
      users[userIndex].lastName;
    const avatar = session.user.image || users[userIndex].avatar;

    // Update user with Google profile data
    const updatedUser = {
      ...users[userIndex],
      firstName,
      lastName,
      avatar,
    };

    users[userIndex] = updatedUser;
    localStorage.setItem("freshko-users", JSON.stringify(users));

    debugAuthFlow.googleSync("Profile Refreshed", updatedUser, true);
    console.log("✅ Google profile refreshed for:", email);

    return updatedUser;
  } catch (error) {
    debugAuthFlow.error("Profile Refresh", error);
    console.error("❌ Error refreshing Google profile:", error);
    return false;
  }
};

// Function to check if user needs profile refresh
export const needsProfileRefresh = (user: any, session: any): boolean => {
  if (!user || !session?.user) return false;

  // Check if user has Google avatar but no name, or generic name
  const hasGoogleAvatar =
    user.avatar && user.avatar.includes("googleusercontent.com");
  const hasGenericName =
    user.firstName === "Google User" ||
    user.firstName === "Google" ||
    !user.firstName ||
    user.firstName === user.email?.split("@")[0];

  // Check if session has more complete data
  const sessionHasName = session.user.name && session.user.name.trim();
  const sessionHasAvatar = session.user.image;

  return (
    (hasGenericName && sessionHasName) ||
    (!user.avatar && sessionHasAvatar) ||
    (hasGoogleAvatar && sessionHasName)
  );
};

// Auto-refresh function to be called from components
export const autoRefreshGoogleProfile = async (user: any, session: any) => {
  if (needsProfileRefresh(user, session)) {
    console.log("🔄 Auto-refreshing Google profile for:", user.email);
    const refreshedUser = await refreshGoogleProfile(user.email, session);

    if (refreshedUser) {
      // Dispatch event to notify store to update
      window.dispatchEvent(
        new CustomEvent("google-profile-updated", {
          detail: refreshedUser,
        })
      );
      return refreshedUser;
    }
  }

  return user;
};
