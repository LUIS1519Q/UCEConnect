import { describe, it, expect } from "vitest";

import { loginSchema } from "../../../schemas/auth/loginSchema";

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({
      email: "john@uce.edu.ec",
      password: "Password123!",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty email", () => {
    const result = loginSchema.safeParse({
      email: "",
      password: "Password123!",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a non-institutional email", () => {
    const result = loginSchema.safeParse({
      email: "john@gmail.com",
      password: "Password123!",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({
      email: "john@uce.edu.ec",
      password: "",
    });

    expect(result.success).toBe(false);
  });
});