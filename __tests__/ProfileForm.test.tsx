import ProfileForm from "@/app/components/ProfileForm";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

function fillValidForm() {
  fireEvent.change(screen.getByLabelText("Name"), {
    target: { value: "Ada" },
  });
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "ada@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Timezone"), {
    target: { value: "UTC" },
  });
}

describe("ProfileForm", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test("submitting with every field empty renders an alert per field and does not call fetch", async () => {
    render(<ProfileForm />);

    fireEvent.submit(screen.getByRole("button", { name: "Save profile" }).closest("form")!);

    expect(await screen.findByText("Name is required.")).toBeInTheDocument();
    expect(screen.getByText("Timezone is required.")).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("submitting an invalid email renders its message and does not call fetch", async () => {
    render(<ProfileForm />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Ada" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "nope" },
    });
    fireEvent.change(screen.getByLabelText("Timezone"), {
      target: { value: "UTC" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Save profile" }).closest("form")!);

    expect(
      await screen.findByText("Enter a valid email address."),
    ).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("submitting three valid values posts to /api/profile and renders the success message", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        profile: { name: "Ada", email: "ada@example.com", timezone: "UTC" },
      }),
    } as Response);

    render(<ProfileForm />);
    fillValidForm();
    fireEvent.submit(screen.getByRole("button", { name: "Save profile" }).closest("form")!);

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Profile saved.",
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, init] = vi.mocked(global.fetch).mock.calls[0];
    expect(url).toBe("/api/profile");
    expect(init?.method).toBe("POST");
    expect(JSON.parse(init?.body as string)).toEqual({
      name: "Ada",
      email: "ada@example.com",
      timezone: "UTC",
    });
  });

  test("a 400 response renders the server-supplied error instead of the success message", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      json: async () => ({ errors: { email: "Email is already taken." } }),
    } as Response);

    render(<ProfileForm />);
    fillValidForm();
    fireEvent.submit(screen.getByRole("button", { name: "Save profile" }).closest("form")!);

    expect(
      await screen.findByText("Email is already taken."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  test("renders all three labelled controls and one option per TIMEZONES entry", () => {
    render(<ProfileForm />);

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    const select = screen.getByLabelText("Timezone") as HTMLSelectElement;
    expect(select.options[0].value).toBe("");
    expect(select.options.length).toBe(7);
  });
});
