import { getProfile, resetProfile } from "@/app/lib/profile/repository";
import { POST } from "@/app/api/profile/route";
import { beforeEach, describe, expect, test } from "vitest";

function postJson(body: string) {
  return POST(
    new Request("http://localhost/api/profile", {
      method: "POST",
      body,
    }),
  );
}

describe("POST /api/profile", () => {
  beforeEach(() => {
    resetProfile();
  });

  test("a valid body returns status 200 with the saved profile", async () => {
    const response = await postJson(
      JSON.stringify({ name: "Ada", email: "ada@example.com", timezone: "UTC" }),
    );

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.profile).toEqual({
      name: "Ada",
      email: "ada@example.com",
      timezone: "UTC",
    });
  });

  test("a malformed email returns status 400 with errors.email, and storage is untouched", async () => {
    const response = await postJson(
      JSON.stringify({ name: "Ada", email: "nope", timezone: "UTC" }),
    );

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.errors.email).toBeDefined();
    expect(getProfile()).toBeNull();
  });

  test.each([JSON.stringify({}), "not json"])(
    "an invalid body %j returns status 400 with all three error keys",
    async (body) => {
      const response = await postJson(body);

      expect(response.status).toBe(400);
      const json = await response.json();
      expect(Object.keys(json.errors).sort()).toEqual([
        "email",
        "name",
        "timezone",
      ]);
    },
  );
});
