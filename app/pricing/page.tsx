import type { Metadata } from "next";
import ButtonLink from "../components/ButtonLink";
import Card from "../components/Card";
import Container from "../components/Container";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple plans that scale with your team.",
};

const tiers = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    description: "Everything you need to ship your first project.",
    features: [
      "1 project",
      "Up to 3 collaborators",
      "Community support",
      "1 GB storage",
    ],
    cta: "Get started",
    href: "/",
    featured: false,
  },
  {
    name: "Team",
    price: "$24",
    period: "/month",
    description: "For growing teams that need room to move.",
    features: [
      "Unlimited projects",
      "Up to 20 collaborators",
      "Priority email support",
      "100 GB storage",
    ],
    cta: "Start free trial",
    href: "/",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Controls and guarantees for larger organisations.",
    features: [
      "SSO and audit logs",
      "Dedicated success manager",
      "99.9% uptime SLA",
    ],
    cta: "Talk to us",
    href: "/about",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <Container className="py-16 sm:py-24">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Pricing
      </h1>
      <p className="mt-6 max-w-prose text-lg leading-8 text-foreground/70">
        Simple plans that scale with your team. Switch or cancel whenever you
        like.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`flex h-full flex-col ${
              tier.featured ? "ring-2 ring-foreground" : ""
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-foreground">
                {tier.name}
              </h2>
              {tier.featured && (
                <span className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
                  Most popular
                </span>
              )}
            </div>

            <p className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-semibold tracking-tight text-foreground">
                {tier.price}
              </span>
              {tier.period && (
                <span className="text-sm text-foreground/70">
                  {tier.period}
                </span>
              )}
            </p>

            <p className="mt-3 text-sm leading-6 text-foreground/70">
              {tier.description}
            </p>

            <ul className="mt-6 mb-8 flex flex-col gap-2 text-sm leading-6 text-foreground/70">
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span aria-hidden="true" className="text-foreground">
                    &#8226;
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <ButtonLink
              href={tier.href}
              variant={tier.featured ? "primary" : "secondary"}
              className="mt-auto w-full"
            >
              {tier.cta}
            </ButtonLink>
          </Card>
        ))}
      </div>
    </Container>
  );
}
