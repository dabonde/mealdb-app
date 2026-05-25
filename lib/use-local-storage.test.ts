import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./use-local-storage";

describe("useLocalStorage", () => {
  const TEST_KEY = "test_key";
  const INITIAL_VALUE = { count: 0 };

  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();

    // Mock localStorage
    const store: Record<string, string> = {};
    vi.spyOn(window.localStorage, "getItem").mockImplementation(
      (key) => store[key] || null
    );
    vi.spyOn(window.localStorage, "setItem").mockImplementation(
      (key, value) => {
        store[key] = value;
      }
    );
  });

  it("should initialize with initialValue if localStorage is empty", () => {
    const { result } = renderHook(() =>
      useLocalStorage(TEST_KEY, INITIAL_VALUE)
    );
    expect(result.current[0]).toEqual(INITIAL_VALUE);
  });

  it("should initialize with value from localStorage if present", () => {
    const savedValue = { count: 10 };
    window.localStorage.setItem(TEST_KEY, JSON.stringify(savedValue));

    const { result } = renderHook(() =>
      useLocalStorage(TEST_KEY, INITIAL_VALUE)
    );
    expect(result.current[0]).toEqual(savedValue);
  });

  it("should NOT write to localStorage on initial mount (wipe protection)", () => {
    const setItemSpy = vi.spyOn(window.localStorage, "setItem");
    renderHook(() => useLocalStorage(TEST_KEY, INITIAL_VALUE));

    // Should not have been called during the effect because of isInitialMount guard
    expect(setItemSpy).not.toHaveBeenCalled();
  });

  it("should update localStorage when state changes after mount", () => {
    const { result } = renderHook(() =>
      useLocalStorage(TEST_KEY, INITIAL_VALUE)
    );
    const newValue = { count: 5 };

    act(() => {
      result.current[1](newValue);
    });

    expect(result.current[0]).toEqual(newValue);
    expect(JSON.parse(window.localStorage.getItem(TEST_KEY)!)).toEqual(
      newValue
    );
  });
});
