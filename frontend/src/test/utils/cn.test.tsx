import { describe, it, expect } from "vitest";

import { cn } from "../../utils/cn";

describe("cn", () => {
  it("joins class names", () => {
    expect(
      cn("flex", "items-center")
    ).toBe("flex items-center");
  });

  it("ignores falsy values", () => {
    expect(
      cn(
        "flex",
        false,
        undefined,
        null,
        "",
        "items-center"
      )
    ).toBe("flex items-center");
  });

  it("merges conflicting tailwind classes", () => {
    expect(
      cn("p-2", "p-4")
    ).toBe("p-4");

    expect(
      cn("text-sm", "text-lg")
    ).toBe("text-lg");
  });

  it("accepts conditional classes", () => {
        expect(
            cn(
            "flex",
            {
                "items-center": true,
                hidden: false,
            }
            )
        ).toBe("flex items-center");
    });
});
