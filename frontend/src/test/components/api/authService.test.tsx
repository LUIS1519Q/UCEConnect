import { describe, it, expect, vi, beforeEach } from "vitest";

import api from "../../../api/client";
import { authService } from "../../../api/authService";
import type { Role } from "../../../types/user";

vi.mock("../../../api/client", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls login endpoint", async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: {
        accessToken: "token",
        refreshToken: "refresh",
        user: {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "john@test.com",
          role: "student",
        },
      },
    });

    const payload = {
      email: "john@test.com",
      password: "123456",
    };

    const result = await authService.login(payload);

    expect(api.post).toHaveBeenCalledWith(
      "/api/v1/auth/login",
      payload
    );

    expect(result.accessToken).toBe("token");
  });

  it("calls register endpoint", async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: {
        message: "Success",
      },
    });

    const payload = {
      firstName: "John",
      lastName: "Doe",
      email: "john@test.com",
      password: "123456",
      role: "student" as Role,
    };

    const result = await authService.register(payload);

    expect(api.post).toHaveBeenCalledWith(
      "/api/v1/auth/register",
      payload
    );

    expect(result.message).toBe("Success");
  });

  it("gets current user", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@test.com",
        role: "student",
      },
    });

    const result = await authService.me();

    expect(api.get).toHaveBeenCalledWith(
      "/api/v1/auth/me"
    );

    expect(result.email).toBe("john@test.com");
  });

  it("calls forgotPassword endpoint", async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: {
        message: "Success",
      },
    });

    const payload = {
      email: "john@test.com",
    };

    const result =
      await authService.forgotPassword(payload);

    expect(api.post).toHaveBeenCalledWith(
      "/api/v1/auth/forgot-password",
      payload
    );

    expect(result.message).toBe("Success");
  });

  it("calls resetPassword endpoint", async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: {
        message: "Success",
      },
    });

    const payload = {
      email: "john@test.com",
      code: "123456",
      newPassword: "Password123!",
    };

    const result =
      await authService.resetPassword(payload);

    expect(api.post).toHaveBeenCalledWith(
      "/api/v1/auth/reset-password",
      payload
    );

    expect(result.message).toBe("Success");
  });

  it("calls verifyCode endpoint", async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: {
        message: "Success",
      },
    });

    const payload = {
      email: "john@test.com",
      code: "123456",
    };

    const result =
      await authService.verifyCode(payload);

    expect(api.post).toHaveBeenCalledWith(
      "/api/v1/auth/verify-code",
      payload
    );

    expect(result.message).toBe("Success");
  });

  it("calls verifyResetCode endpoint", async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: {
        message: "Success",
      },
    });

    const payload = {
      email: "john@test.com",
      code: "123456",
    };

    const result =
      await authService.verifyResetCode(payload);

    expect(api.post).toHaveBeenCalledWith(
      "/api/v1/auth/verify-reset-code",
      payload
    );

    expect(result.message).toBe("Success");
  });

  it("calls resendCode endpoint", async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: {
        message: "Success",
      },
    });

    const result =
      await authService.resendCode("john@test.com");

    expect(api.post).toHaveBeenCalledWith(
      "/api/v1/auth/resend-code",
      {
        email: "john@test.com",
      }
    );

    expect(result.message).toBe("Success");
  });

  it("calls resendResetCode endpoint", async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: {
        message: "Success",
      },
    });

    const result =
      await authService.resendResetCode(
        "john@test.com"
      );

    expect(api.post).toHaveBeenCalledWith(
      "/api/v1/auth/resend-reset-code",
      {
        email: "john@test.com",
      }
    );

    expect(result.message).toBe("Success");
  });

  it("redirects to microsoft login", () => {
    const originalLocation = window.location;

    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        href: "",
      },
    });

    authService.microsoftLogin();

    expect(window.location.href).toContain(
      "/api/v1/auth/microsoft"
    );

    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });
});