import { describe, it, expect } from "vitest";

import { resetPasswordSchema } from "../../../schemas/auth/resetPasswordSchema";

describe("resetPasswordSchema", () => {
  const validData = {
    password: "Password123!",
    confirmPassword: "Password123!",
  };

  it("accepts valid passwords", () => {
    const result = resetPasswordSchema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it("rejects a short password", () => {
    const result = resetPasswordSchema.safeParse({
      password: "Pass1!",
      confirmPassword: "Pass1!",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a password without uppercase letters", () => {
    const result = resetPasswordSchema.safeParse({
      password: "password123!",
      confirmPassword: "password123!",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a password without lowercase letters", () => {
    const result = resetPasswordSchema.safeParse({
      password: "PASSWORD123!",
      confirmPassword: "PASSWORD123!",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a password without numbers", () => {
    const result = resetPasswordSchema.safeParse({
      password: "Password!",
      confirmPassword: "Password!",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a password without special characters", () => {
    const result = resetPasswordSchema.safeParse({
      password: "Password123",
      confirmPassword: "Password123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects different passwords", () => {
    const result = resetPasswordSchema.safeParse({
      password: "Password123!",
      confirmPassword: "Password321!",
    });

    expect(result.success).toBe(false);
  });
});