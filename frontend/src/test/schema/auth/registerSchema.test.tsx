import { describe, it, expect } from "vitest";

import { registerSchema } from "../../../schemas/auth/registerSchema";

describe("registerSchema", () => {
  const validData = {
    firstName: "John",
    lastName: "Doe",
    email: "john@uce.edu.ec",
    password: "Password123!",
    confirmPassword: "Password123!",
  };

  it("accepts valid data", () => {
    const result = registerSchema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it("rejects an empty first name", () => {
    const result = registerSchema.safeParse({
      ...validData,
      firstName: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid first name", () => {
    const result = registerSchema.safeParse({
      ...validData,
      firstName: "John123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty last name", () => {
    const result = registerSchema.safeParse({
      ...validData,
      lastName: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid last name", () => {
    const result = registerSchema.safeParse({
      ...validData,
      lastName: "Doe123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a non-institutional email", () => {
    const result = registerSchema.safeParse({
      ...validData,
      email: "john@gmail.com",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a weak password", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: "12345678",
      confirmPassword: "12345678",
    });

    expect(result.success).toBe(false);
  });

  it("rejects different passwords", () => {
    const result = registerSchema.safeParse({
      ...validData,
      confirmPassword: "Password321!",
    });

    expect(result.success).toBe(false);
  });
});