import { auth } from "@/auth";

export async function getServerAuthSession() {
  return await auth();
}

// Helper to get user session on client side
export const getClientSession = async () => {
  if (typeof window !== "undefined") {
    const { getSession } = await import("next-auth/react");
    return await getSession();
  }
  return null;
};
