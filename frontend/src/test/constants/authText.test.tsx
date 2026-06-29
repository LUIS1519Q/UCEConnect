import { describe, it, expect } from "vitest";

import { AUTH_TEXT } from "../../constants/authText";

describe("AUTH_TEXT", () => {
  it("contains the expected auth texts", () => {
    expect(AUTH_TEXT.slogan).toBe(
      "From your claim to the solution"
    );

    expect(AUTH_TEXT.resendCodeIn).toBe(
      "Resend code in"
    );

    expect(AUTH_TEXT.codeExpiresIn).toBe(
      "Code expires in"
    );

    expect(AUTH_TEXT.loginWithMicrosoft).toBe(
      "Continue with Microsoft"
    );

    expect(AUTH_TEXT.createAccount).toBe(
      "Create Account"
    );

    expect(AUTH_TEXT.resetPassword).toBe(
      "Reset Password"
    );
  });
});