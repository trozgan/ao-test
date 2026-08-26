import Nav from "@/app/components/Nav";
import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

const mockPathname = vi.mocked(usePathname);

describe("Nav", () => {
  beforeEach(() => {
    mockPathname.mockReturnValue("/");
  });

  test("renders links to /, /about and /pricing", () => {
    render(<Nav />);

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about",
    );
    expect(screen.getByRole("link", { name: "Pricing" })).toHaveAttribute(
      "href",
      "/pricing",
    );
  });

  test.each([
    ["/", "Home"],
    ["/about", "About"],
    ["/pricing", "Pricing"],
  ])("marks the active link for %s", (pathname, activeLabel) => {
    mockPathname.mockReturnValue(pathname);
    render(<Nav />);

    const active = screen.getAllByRole("link", { current: "page" });
    expect(active).toHaveLength(1);
    expect(active[0]).toHaveAccessibleName(activeLabel);
  });

  test("does not mark any nav link active on an unknown route", () => {
    mockPathname.mockReturnValue("/nope");
    render(<Nav />);

    expect(screen.queryAllByRole("link", { current: "page" })).toHaveLength(0);
  });
});
