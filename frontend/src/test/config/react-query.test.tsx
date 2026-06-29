import { describe, it, expect } from "vitest";

import { queryClient } from "../../config/react-query";

describe("queryClient", () => {
  it("uses the expected default query options", () => {
    const defaults = queryClient.getDefaultOptions();

    expect(defaults.queries?.retry).toBe(1);

    expect(defaults.queries?.staleTime).toBe(
      1000 * 60 * 5
    );

    expect(defaults.queries?.gcTime).toBe(
      1000 * 60 * 10
    );

    expect(
      defaults.queries?.refetchOnWindowFocus
    ).toBe(false);
  });

  it("uses the expected default mutation options", () => {
    const defaults = queryClient.getDefaultOptions();

    expect(defaults.mutations?.retry).toBe(false);
  });
});