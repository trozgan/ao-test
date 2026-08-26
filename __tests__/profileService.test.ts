import { getProfile, resetProfile } from "@/app/lib/profile/repository";
import { saveUserProfile } from "@/app/lib/profile/service";
import { beforeEach, describe, expect, test } from "vitest";

const valid = { name: "Ada", email: "ada@example.com", timezone: "UTC" };

describe("saveUserProfile", () => {
  beforeEach(() => {
    resetProfile();
  });

  test("a valid input returns ok:true carrying the profile, and getProfile reflects it", () => {
    const result = saveUserProfile(valid);

    expect(result).toEqual({ ok: true, profile: valid });
    expect(getProfile()).toEqual(valid);
  });

  test("a malformed email returns ok:false carrying errors.email and never reaches storage", () => {
    const result = saveUserProfile({ ...valid, email: "nope" });

    expect(result.ok).toBe(false);
    expect(result.ok === false && result.errors.email).toBeDefined();
    expect(getProfile()).toBeNull();
  });

  test("all fields empty returns ok:false carrying all three error keys", () => {
    const result = saveUserProfile({ name: "", email: "", timezone: "" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual([
        "email",
        "name",
        "timezone",
      ]);
    }
  });
});
