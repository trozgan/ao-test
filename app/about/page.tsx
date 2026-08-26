import type { Metadata } from "next";
import Container from "../components/Container";

export const metadata: Metadata = {
  title: "About",
  description: "What Northwind is and who builds it.",
};

export default function About() {
  return (
    <Container className="py-16 sm:py-24">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        About
      </h1>
      <p className="mt-6 max-w-prose text-lg leading-8 text-foreground/70">
        Northwind is a minimal product landing site built with the Next.js App
        Router, TypeScript, and Tailwind CSS.
      </p>
      <p className="mt-4 max-w-prose text-lg leading-8 text-foreground/70">
        Every page shares the same shell, so the layout, spacing, and type
        scale stay consistent as the site grows.
      </p>
    </Container>
  );
}
