import About from "@/app/about/page";
import Contact from "@/app/contact/page";
import Home from "@/app/page";
import Pricing from "@/app/pricing/page";
import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

// Nav is a client component that reads usePathname. Stubbing it here means a
// page that wrongly mounts its own Nav still renders, so the assertions below
// fail with a landmark mismatch rather than a hook error.
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

const pages = [
  ["Home", Home],
  ["Pricing", Pricing],
  ["About", About],
  ["Contact", Contact],
] as const;

describe.each(pages)("%s page landmarks", (_name, Page) => {
  test("does not render a nav landmark of its own", () => {
    render(<Page />);

    // Nav is mounted once in app/layout.tsx; a page repeating it would give
    // the site two headers.
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(screen.queryByRole("banner")).not.toBeInTheDocument();
  });
});
