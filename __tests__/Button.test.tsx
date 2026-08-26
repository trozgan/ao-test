import Button from "@/app/components/Button";
import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

describe("Button", () => {
  test("renders its children", () => {
    render(<Button>Get started</Button>);
    expect(
      screen.getByRole("button", { name: "Get started" }),
    ).toBeInTheDocument();
  });

  test("applies a different class string for primary vs secondary", () => {
    const { unmount } = render(<Button variant="primary">Go</Button>);
    const primaryClass = screen.getByRole("button").className;
    unmount();

    render(<Button variant="secondary">Go</Button>);
    const secondaryClass = screen.getByRole("button").className;

    expect(primaryClass).not.toBe(secondaryClass);
  });

  test("defaults to the primary variant", () => {
    const { unmount } = render(<Button>Go</Button>);
    const defaultClass = screen.getByRole("button").className;
    unmount();

    render(<Button variant="primary">Go</Button>);
    expect(screen.getByRole("button").className).toBe(defaultClass);
  });

  test("forwards a native onClick handler", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Submit</Button>);

    screen.getByRole("button", { name: "Submit" }).click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("forwards native attributes such as disabled and type", () => {
    render(
      <Button disabled type="submit">
        Submit
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("type", "submit");
  });

  test("appends a caller-supplied className", () => {
    render(<Button className="custom-class">Go</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });
});
