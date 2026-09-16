import { auth, currentUser } from "@clerk/nextjs/server";

/** True when the signed-in Clerk user has publicMetadata.role === "admin". */
export async function requireAdmin(): Promise<boolean> {
  try {
    const { userId } = await auth();
    if (!userId) return false;
    const user = await currentUser();
    return (user?.publicMetadata?.role as string) === "admin";
  } catch {
    return process.env.ALLOW_DEV_ADMIN === "1";
  }
}

export async function requireAdminUser() {
  const { userId } = await auth();
  if (!userId && process.env.ALLOW_DEV_ADMIN !== "1") return null;
  const user = await currentUser();
  if ((user?.publicMetadata?.role as string) === "admin") return user;
  if (process.env.ALLOW_DEV_ADMIN === "1") return user;
  return null;
}
