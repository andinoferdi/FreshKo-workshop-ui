// Debug Helpers for FreshKo
// Use these functions in browser console for debugging

import { refreshGoogleProfile } from "./google-profile-refresh";

// Debug Google Session Data
export const debugGoogleSession = () => {
  if (typeof window === "undefined") {
    console.log("❌ Not in browser environment");
    return;
  }

  console.log("🔍 === GOOGLE SESSION DEBUG ===");

  // Check NextAuth session
  const sessionStr = sessionStorage.getItem("freshko-google-signin");
  if (sessionStr) {
    try {
      const session = JSON.parse(sessionStr);
      console.log("📋 Stored Google Session:", session);
    } catch (error) {
      console.log("❌ Error parsing stored session:", error);
    }
  } else {
    console.log("❌ No stored Google session found");
  }

  // Check localStorage users
  const usersStr = localStorage.getItem("freshko-users");
  if (usersStr) {
    try {
      const users = JSON.parse(usersStr);
      console.log("👥 All Users in Storage:", users);
    } catch (error) {
      console.log("❌ Error parsing users:", error);
    }
  } else {
    console.log("❌ No users found in storage");
  }

  // Check current store state
  try {
    const { useHydratedStore } = require("./store");
    const store = useHydratedStore.getState();
    console.log("🏪 Current Store State:", {
      isAuthenticated: store.isAuthenticated,
      user: store.user,
    });
  } catch (error) {
    console.log("❌ Error accessing store:", error);
  }
};

// Force Google Profile Update
export const forceGoogleProfileUpdate = async (email?: string) => {
  if (typeof window === "undefined") {
    console.log("❌ Not in browser environment");
    return;
  }

  console.log("🔄 === FORCE GOOGLE PROFILE UPDATE ===");

  try {
    const { useSession } = await import("next-auth/react");
    const session = (window as any).__NEXT_AUTH_SESSION__ || null;

    if (!session && !email) {
      console.log("❌ No session found and no email provided");
      return;
    }

    const targetEmail = email || session?.user?.email;
    if (!targetEmail) {
      console.log("❌ No email to update");
      return;
    }

    console.log("📧 Updating profile for:", targetEmail);

    // Simulate session data for testing
    const fakeSession = session || {
      user: {
        email: targetEmail,
        name: "Test Google User",
        image: "https://lh3.googleusercontent.com/a/test-avatar",
      },
    };

    const result = await refreshGoogleProfile(targetEmail, fakeSession);

    if (result) {
      console.log("✅ Profile updated successfully:", result);

      // Dispatch update event
      window.dispatchEvent(
        new CustomEvent("google-profile-updated", {
          detail: result,
        })
      );
    } else {
      console.log("❌ Profile update failed");
    }
  } catch (error) {
    console.log("❌ Error updating profile:", error);
  }
};

// Test Google Login Flow
export const testGoogleLoginFlow = () => {
  if (typeof window === "undefined") {
    console.log("❌ Not in browser environment");
    return;
  }

  console.log("🧪 === TEST GOOGLE LOGIN FLOW ===");

  // Simulate Google user data
  const testGoogleUser = {
    id: `google_test_${Date.now()}`,
    firstName: "Test",
    lastName: "Google User",
    email: "test.google.user@gmail.com",
    phone: "",
    role: "user",
    createdAt: new Date().toISOString(),
    avatar: "https://lh3.googleusercontent.com/a/test-avatar-url",
  };

  console.log("👤 Test User Data:", testGoogleUser);

  // Dispatch Google login event
  window.dispatchEvent(
    new CustomEvent("google-user-login", {
      detail: testGoogleUser,
    })
  );

  console.log("✅ Google login event dispatched");
};

// Export to window for console access
if (typeof window !== "undefined") {
  (window as any).debugGoogleSession = debugGoogleSession;
  (window as any).forceGoogleProfileUpdate = forceGoogleProfileUpdate;
  (window as any).testGoogleLoginFlow = testGoogleLoginFlow;

  console.log(`
🛠️  === FRESHKO DEBUG HELPERS ===
Available in console:
• debugGoogleSession() - Check Google session data
• forceGoogleProfileUpdate(email?) - Force refresh profile
• testGoogleLoginFlow() - Test login flow
• freshkoAuthDebugger.exportLogs() - Export debug logs
  `);
}
