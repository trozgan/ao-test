import ProfileSettings from "@/app/settings/profile/page";
import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/settings/profile",
}));

describe("ProfileSettings page", () => {
  test("renders a level-1 heading and the form's three labelled controls", () => {
    render(<ProfileSettings />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Profile Settings" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Timezone")).toBeInTheDocument();
  });
});
