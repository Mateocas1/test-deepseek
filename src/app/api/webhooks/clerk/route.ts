import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

const ADMIN_EMAIL = "meelnahir19@gmail.com";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const payload = JSON.parse(body);
    const { type, data } = payload;

    if (type === "user.created" || type === "user.updated") {
      const email = data.email_addresses?.[0]?.email_address;
      const isAdminEmail = email === ADMIN_EMAIL;

      if (isAdminEmail) {
        const client = await clerkClient();
        await client.users.updateUser(data.id, {
          publicMetadata: { role: "admin" },
        });
      }

      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/action`,
          {
            method: "POST",
            body: JSON.stringify({
              path: "webhooks:clerkSync",
              args: payload,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );
      } catch (e) {
        console.error("Error forwarding to Convex:", e);
      }
    }
  } catch (e) {
    console.error("Clerk webhook error:", e);
  }

  return NextResponse.json({ success: true });
}
