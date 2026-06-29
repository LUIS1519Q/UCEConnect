import { describe, it, expect } from "vitest";

import { ROUTES } from "../../constants/routes";

describe("ROUTES", () => {
  it("contains auth routes", () => {
    expect(ROUTES.auth.login).toBe("/login");
    expect(ROUTES.auth.register).toBe("/register");
    expect(ROUTES.auth.forgotPassword).toBe(
      "/forgot-password"
    );
    expect(ROUTES.auth.verifyCode).toBe(
      "/verify-code"
    );
    expect(ROUTES.auth.resetPassword).toBe(
      "/reset-password"
    );
  });

  it("contains dashboard routes", () => {
    expect(ROUTES.dashboard.student).toBe(
      "/dashboard/student"
    );

    expect(ROUTES.dashboard.manager).toBe(
      "/dashboard/manager"
    );

    expect(ROUTES.dashboard.admin).toBe(
      "/dashboard/admin"
    );
  });
});