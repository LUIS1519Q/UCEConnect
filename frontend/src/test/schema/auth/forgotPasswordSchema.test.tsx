import { describe, it, expect } from "vitest";

import { forgotPasswordSchema } from "../../../schemas/auth/forgotPasswordSchema";

describe("forgotPasswordSchema", () => {
  it("accepts a valid institutional email", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "john@uce.edu.ec",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty email", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Institutional email is required."
      );
    }
  });

  it("rejects an invalid email", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "john",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Please enter a valid email address."
      );
    }
  });

  it("rejects non institutional emails", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "john@gmail.com",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Only institutional emails are allowed (@uce.edu.ec)."
      );
    }
  });

  it("trims spaces before validating", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "   john@uce.edu.ec   ",
    });

    expect(result.success).toBe(true);
  });
});