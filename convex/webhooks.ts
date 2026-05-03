import { httpAction } from "./_generated/server";

const ADMIN_EMAIL = "meelnahir19@gmail.com";

export const clerkSync = httpAction(async (ctx, request) => {
  const payload = await request.json();
  const { type, data } = payload;

  if (type === "user.created" || type === "user.updated") {
    const email = data.email_addresses?.[0]?.email_address;
    const isAdminEmail = email === ADMIN_EMAIL;
    const name =
      data.first_name && data.last_name
        ? `${data.first_name} ${data.last_name}`
        : data.first_name ?? email ?? "Usuario";

    await ctx.runMutation("users:upsertFromClerk", {
      args: {
        clerkId: data.id,
        email: email ?? "",
        name,
        avatar: data.image_url,
        role: isAdminEmail ? "admin" : "customer",
      },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
