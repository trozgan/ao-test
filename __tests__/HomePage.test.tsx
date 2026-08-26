import Home from "@/app/page";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

const featureTitles = [
  "Unified workspace",
  "Automations that hold",
  "Reporting you can trust",
];

describe("Home page", () => {
  test("renders the hero headline", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Ship the work, not the status updates",
      }),
    ).toBeInTheDocument();
  });

  test("renders three feature cards", () => {
    render(<Home />);

    for (const title of featureTitles) {
      expect(
        screen.getByRole("heading", { level: 2, name: title }),
      ).toBeInTheDocument();
    }

    const headings = screen
      .getAllByRole("heading", { level: 2 })
      .map((heading) => heading.textContent);
    expect(headings).toEqual([...featureTitles, "Start with your next project"]);
  });

  test("points its CTAs at /pricing and /about", () => {
    render(<Home />);

    expect(screen.getByRole("link", { name: "See pricing" })).toHaveAttribute(
      "href",
      "/pricing",
    );
    expect(screen.getByRole("link", { name: "Learn more" })).toHaveAttribute(
      "href",
      "/about",
    );
    expect(screen.getByRole("link", { name: "Get started" })).toHaveAttribute(
      "href",
      "/pricing",
    );
  });
});
