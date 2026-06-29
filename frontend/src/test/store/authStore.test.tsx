import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "../../store/authStore";

describe("authStore", () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it("sets the session", () => {
    useAuthStore.getState().setSession({
      user: {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@test.com",
        role: "student",
      },
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    const state = useAuthStore.getState();

    expect(state.user).toEqual({
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@test.com",
      role: "student",
    });

    expect(state.accessToken).toBe("access-token");
    expect(state.refreshToken).toBe("refresh-token");
  });

  it("logs out correctly", () => {
    useAuthStore.getState().setSession({
      user: {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@test.com",
        role: "student",
      },
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();

    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
  });
});