import Container from "@/app/components/Container";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

describe("Container", () => {
  test("renders its children", () => {
    render(
      <Container>
        <p>Inside</p>
      </Container>,
    );
    expect(screen.getByText("Inside")).toBeInTheDocument();
  });

  test("appends a caller-supplied className instead of replacing the base classes", () => {
    const { unmount } = render(<Container>Inside</Container>);
    const baseClass = screen.getByText("Inside").className.trim();
    unmount();

    render(<Container className="custom-class">Inside</Container>);
    const withCustom = screen.getByText("Inside");

    expect(withCustom).toHaveClass("custom-class");
    for (const cls of baseClass.split(/\s+/)) {
      expect(withCustom).toHaveClass(cls);
    }
    expect(withCustom.className.trim().endsWith("custom-class")).toBe(true);
  });
});
