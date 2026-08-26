import Nav from "@/app/components/Nav";
import { render, screen, within } from "@testing-library/react";
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

  test("renders links to /, /about, /pricing and /contact", () => {
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
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });

  test("renders exactly four nav links, plus the brand link", () => {
    render(<Nav />);

    // This list is exact on purpose: an accidental addition or removal
    // fails loudly here rather than silently changing the site nav.
    const navLinks = within(screen.getByRole("navigation")).getAllByRole(
      "link",
    );
    expect(navLinks.map((link) => link.textContent)).toEqual([
      "Home",
      "About",
      "Pricing",
      "Contact",
    ]);

    // The brand anchor also points at "/" but sits outside the nav landmark,
    // so the document total is one higher than the nav count.
    expect(screen.getByRole("link", { name: "Northwind" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getAllByRole("link")).toHaveLength(5);
  });

  test.each([
    ["/", "Home"],
    ["/about", "About"],
    ["/pricing", "Pricing"],
    ["/contact", "Contact"],
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
