import { validateProfile } from "@/app/lib/profile/validation";
import { describe, expect, test } from "vitest";

describe("validateProfile", () => {
  test("returns no errors for a fully valid input", () => {
    expect(
      validateProfile({
        name: "Ada",
        email: "ada@example.com",
        timezone: "UTC",
      }),
    ).toEqual({});
  });

  test.each(["", "nope", "a@b", "a b@c.com"])(
    "flags an invalid email %j",
    (email) => {
      const errors = validateProfile({ name: "Ada", email, timezone: "UTC" });
      expect(errors.email).toBeDefined();
    },
  );

  test("does not flag a valid email", () => {
    const errors = validateProfile({
      name: "Ada",
      email: "ada@example.com",
      timezone: "UTC",
    });
    expect(errors.email).toBeUndefined();
  });

  test("flags a whitespace-only name", () => {
    const errors = validateProfile({
      name: "   ",
      email: "ada@example.com",
      timezone: "UTC",
    });
    expect(errors.name).toBe("Name is required.");
  });

  test.each(["", "Mars/Olympus"])("flags an invalid timezone %j", (timezone) => {
    const errors = validateProfile({
      name: "Ada",
      email: "ada@example.com",
      timezone,
    });
    expect(errors.timezone).toBeDefined();
  });

  test("returns all three keys when every field is empty", () => {
    const errors = validateProfile({ name: "", email: "", timezone: "" });
    expect(Object.keys(errors).sort()).toEqual(["email", "name", "timezone"]);
  });
});
