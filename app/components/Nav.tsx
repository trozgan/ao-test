"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "./Container";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
  { href: "/settings/profile", label: "Profile Settings" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-solid border-black/[.08] dark:border-white/[.145]">
      <Container className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-foreground"
        >
          Northwind
        </Link>
        <nav className="flex flex-wrap gap-x-6 gap-y-0 text-sm font-medium">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "flex min-h-11 items-center text-foreground underline underline-offset-4"
                    : "flex min-h-11 items-center text-foreground/70 transition-colors hover:text-foreground"
                }
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </Container>
    </header>
  );
}
