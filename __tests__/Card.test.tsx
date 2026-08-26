import Card from "@/app/components/Card";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

describe("Card", () => {
  test("renders its children", () => {
    render(
      <Card>
        <p>Inside</p>
      </Card>,
    );
    expect(screen.getByText("Inside")).toBeInTheDocument();
  });

  test("appends a caller-supplied className instead of replacing the base classes", () => {
    const { unmount } = render(<Card>Inside</Card>);
    const baseClass = screen.getByText("Inside").className.trim();
    unmount();

    render(<Card className="custom-class">Inside</Card>);
    const withCustom = screen.getByText("Inside");

    expect(withCustom).toHaveClass("custom-class");
    for (const cls of baseClass.split(/\s+/)) {
      expect(withCustom).toHaveClass(cls);
    }
    expect(withCustom.className.trim().endsWith("custom-class")).toBe(true);
  });
});
