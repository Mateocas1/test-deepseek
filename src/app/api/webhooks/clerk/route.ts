import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { api } from "@/convex/_generated/api";

const ADMIN_EMAIL = "meelnahir19@gmail.com";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const { type, data } = payload;

  if (type === "user.created" || type === "user.updated") {
    const email = data.email_addresses?.[0]?.email_address;
    const isAdminEmail = email === ADMIN_EMAIL;

    const client = await clerkClient();

    if (isAdminEmail) {
      await client.users.updateUser(data.id, {
        publicMetadata: { role: "admin" },
      });
    }

    try {
      const { ConvexHttpClient } = await import("convex/browser");
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
      await convex.mutation(api.users.upsertFromClerk, {
        clerkId: data.id,
        email: email ?? "",
        name:
          data.first_name && data.last_name
            ? `${data.first_name} ${data.last_name}`
            : data.first_name ?? email ?? "Usuario",
        avatar: data.image_url,
        role: isAdminEmail ? "admin" : "customer",
      });
    } catch (e) {
      console.error("Error syncing user to Convex:", e);
    }
  }

  return NextResponse.json({ success: true });
}
