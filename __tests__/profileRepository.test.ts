import {
  getProfile,
  resetProfile,
  saveProfile,
} from "@/app/lib/profile/repository";
import { beforeEach, describe, expect, test } from "vitest";

const profile = { name: "Ada", email: "ada@example.com", timezone: "UTC" };

describe("profile repository", () => {
  beforeEach(() => {
    resetProfile();
  });

  test("returns null before any save and the saved values after saveProfile()", () => {
    expect(getProfile()).toBeNull();

    saveProfile(profile);

    expect(getProfile()).toEqual(profile);
  });

  test("a second save replaces the first record, and resetProfile returns storage to null", () => {
    saveProfile(profile);
    const second = { name: "Grace", email: "grace@example.com", timezone: "Europe/London" };
    saveProfile(second);

    expect(getProfile()).toEqual(second);

    resetProfile();

    expect(getProfile()).toBeNull();
  });

  test("saveProfile stores a copy, so mutating the caller's object afterward leaves storage untouched", () => {
    const input = { ...profile };
    saveProfile(input);
    input.name = "Mutated";

    expect(getProfile()).toEqual(profile);
  });
});
