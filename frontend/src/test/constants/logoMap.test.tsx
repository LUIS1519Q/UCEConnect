import { describe, it, expect } from "vitest";

import { logoMap } from "../../constants/logoMap";

describe("logoMap", () => {
  it("contains all logo variants", () => {
    expect(logoMap["horizontal-color"]).toBeTruthy();
    expect(logoMap["horizontal-white"]).toBeTruthy();
    expect(logoMap["horizontal-dark"]).toBeTruthy();

    expect(logoMap["vertical-color"]).toBeTruthy();
    expect(logoMap["vertical-white"]).toBeTruthy();
    expect(logoMap["vertical-dark"]).toBeTruthy();

    expect(logoMap["isotype-color"]).toBeTruthy();
    expect(logoMap["isotype-white"]).toBeTruthy();
    expect(logoMap["isotype-dark"]).toBeTruthy();

    expect(
      logoMap["horizontal-slogan-color"]
    ).toBeTruthy();

    expect(
      logoMap["horizontal-slogan-white"]
    ).toBeTruthy();
  });
});