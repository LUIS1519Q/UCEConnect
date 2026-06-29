import { describe, it, expect } from "vitest";

import { verifyCodeSchema } from "../../../schemas/auth/verifyCodeSchema";

describe("verifyCodeSchema", () => {
  it("accepts a valid verification code", () => {
    const result = verifyCodeSchema.safeParse({
      code: "123456",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty code", () => {
    const result = verifyCodeSchema.safeParse({
      code: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a code with less than 6 digits", () => {
    const result = verifyCodeSchema.safeParse({
      code: "12345",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a code with more than 6 digits", () => {
    const result = verifyCodeSchema.safeParse({
      code: "1234567",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a code containing letters", () => {
    const result = verifyCodeSchema.safeParse({
      code: "12AB56",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a code containing special characters", () => {
    const result = verifyCodeSchema.safeParse({
      code: "12@456",
    });

    expect(result.success).toBe(false);
  });
});