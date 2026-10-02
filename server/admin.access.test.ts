import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createUserContext(): TrpcContext {
  const now = new Date();
  return {
    user: {
      id: 2,
      openId: "regular-user",
      name: "Regular User",
      email: "user@example.com",
      loginMethod: "manus",
      role: "user",
      createdAt: now,
      updatedAt: now,
      lastSignedIn: now,
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("admin access", () => {
  it("rejects a regular user from the admin overview", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.admin.overview()).rejects.toHaveProperty("code", "FORBIDDEN");
  });
});
