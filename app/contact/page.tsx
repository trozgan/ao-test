import type { Metadata } from "next";
import Container from "../components/Container";

export const metadata: Metadata = {
  title: "Contact",
  description: "How to get in touch with the Northwind team.",
};

export default function Contact() {
  return (
    <Container className="py-16 sm:py-24">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Contact
      </h1>
      <p className="mt-6 max-w-prose text-lg leading-8 text-foreground/70">
        Tell us which plan you are looking at and we will get back to you
        within one business day.
      </p>
      <p className="mt-6 text-lg leading-8 text-foreground/70">
        <a
          href="mailto:hello@northwind.example"
          className="font-medium text-foreground underline"
        >
          hello@northwind.example
        </a>
      </p>
    </Container>
  );
}
