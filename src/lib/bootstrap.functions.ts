import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  secret: z.string().min(10),
});

export const verifySecret = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const expected = process.env.SUPER_ADMIN_BOOTSTRAP_SECRET?.replace(/['"]/g, '').trim();
    if (!expected) throw new Error("Bootstrap secret not configured");
    
    const provided = data.secret.trim();
    if (expected !== provided) {
      throw new Error("Invalid bootstrap secret");
    }
    return { ok: true as const };
  });

export const superAdminExists = createServerFn({ method: "GET" }).handler(async () => {
  return { exists: false };
});