import About from "@/app/about/page";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

describe("About page", () => {
  test("renders its heading and body copy", () => {
    render(<About />);

    expect(
      screen.getByRole("heading", { level: 1, name: "About" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/minimal product landing site/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/every page shares the same shell/i)).toBeInTheDocument();
  });

  test("does not render a 'Back to home' link", () => {
    render(<About />);

    expect(
      screen.queryByRole("link", { name: /back to home/i }),
    ).not.toBeInTheDocument();
    // Nav owns site navigation, so the page itself links nowhere.
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });
});
