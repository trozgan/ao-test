import Contact from "@/app/contact/page";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

describe("Contact page", () => {
  test("renders its heading", () => {
    render(<Contact />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Contact" }),
    ).toBeInTheDocument();
  });

  test("renders a mailto anchor", () => {
    render(<Contact />);

    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toMatch(/^mailto:/);
  });
});
