import Pricing from "@/app/pricing/page";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

describe("Pricing page", () => {
  test("renders three tiers", () => {
    render(<Pricing />);

    const tierNames = screen
      .getAllByRole("heading", { level: 2 })
      .map((heading) => heading.textContent);

    expect(tierNames).toEqual(["Starter", "Team", "Enterprise"]);
  });

  test("gives every tier a CTA link with a real href", () => {
    render(<Pricing />);

    const ctas = screen.getAllByRole("link");
    expect(ctas).toHaveLength(3);

    for (const cta of ctas) {
      expect(cta).toHaveAccessibleName();
      expect(cta.getAttribute("href")).toMatch(/^\//);
    }
  });

  test("marks the middle tier as the popular one", () => {
    render(<Pricing />);

    const tierNames = screen
      .getAllByRole("heading", { level: 2 })
      .map((heading) => heading.textContent);
    expect(tierNames[1]).toBe("Team");

    const badges = screen.getAllByText("Most popular");
    expect(badges).toHaveLength(1);
    expect(badges[0].parentElement).toContainElement(
      screen.getByRole("heading", { level: 2, name: "Team" }),
    );
  });
});
