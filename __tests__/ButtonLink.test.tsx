import ButtonLink from "@/app/components/ButtonLink";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

describe("ButtonLink", () => {
  test("renders an anchor with the given href and children", () => {
    render(<ButtonLink href="/pricing">See pricing</ButtonLink>);

    const link = screen.getByRole("link", { name: "See pricing" });
    expect(link).toHaveAttribute("href", "/pricing");
  });

  test("applies a different class string for primary vs secondary", () => {
    const { unmount } = render(
      <ButtonLink href="/a" variant="primary">
        Go
      </ButtonLink>,
    );
    const primaryClass = screen.getByRole("link").className;
    unmount();

    render(
      <ButtonLink href="/a" variant="secondary">
        Go
      </ButtonLink>,
    );

    expect(screen.getByRole("link").className).not.toBe(primaryClass);
  });

  test("defaults to the primary variant", () => {
    const { unmount } = render(<ButtonLink href="/a">Go</ButtonLink>);
    const defaultClass = screen.getByRole("link").className;
    unmount();

    render(
      <ButtonLink href="/a" variant="primary">
        Go
      </ButtonLink>,
    );

    expect(screen.getByRole("link").className).toBe(defaultClass);
  });

  test("appends a caller-supplied className", () => {
    render(
      <ButtonLink href="/a" className="custom-class">
        Go
      </ButtonLink>,
    );
    expect(screen.getByRole("link")).toHaveClass("custom-class");
  });
});
