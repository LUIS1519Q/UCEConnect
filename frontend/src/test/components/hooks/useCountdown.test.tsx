import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useCountdown } from "../../../hooks/useCountdown";

describe("useCountdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("initializes with the correct values", () => {
    const { result } = renderHook(() =>
      useCountdown(60)
    );

    expect(result.current.seconds).toBe(60);
    expect(result.current.formattedTime).toBe("1:00");
    expect(result.current.isRunning).toBe(true);
  });

  it("counts down every second", () => {
    const { result } = renderHook(() =>
      useCountdown(10)
    );

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.seconds).toBe(9);
    expect(result.current.formattedTime).toBe("0:09");
  });

  it("pauses the countdown", () => {
    const { result } = renderHook(() =>
      useCountdown(10)
    );

    act(() => {
      result.current.pause();
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.seconds).toBe(10);
  });

  it("starts the countdown again", () => {
    const { result } = renderHook(() =>
      useCountdown(10)
    );

    act(() => {
      result.current.pause();
    });

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.seconds).toBe(9);
  });

  it("resets the countdown", () => {
    const { result } = renderHook(() =>
      useCountdown(10)
    );

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.seconds).toBe(7);

    act(() => {
      result.current.reset();
    });

    expect(result.current.seconds).toBe(10);
    expect(result.current.isRunning).toBe(true);
  });
});