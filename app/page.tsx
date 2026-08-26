import ButtonLink from "./components/ButtonLink";
import Card from "./components/Card";
import Container from "./components/Container";

const features = [
  {
    title: "Unified workspace",
    body: "Bring briefs, tasks, and reviews into a single shared view. Everyone sees the same status without chasing an update thread.",
  },
  {
    title: "Automations that hold",
    body: "Describe a rule once and Northwind applies it to every new item. Handoffs, reminders, and escalations run without a nudge.",
  },
  {
    title: "Reporting you can trust",
    body: "Every metric traces back to the record that produced it. Export a snapshot or share a live link with the people who need it.",
  },
];

export default function Home() {
  return (
    <Container className="py-16 sm:py-24">
      <section className="flex flex-col items-start gap-6">
        <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Ship the work, not the status updates
        </h1>
        <p className="max-w-prose text-lg leading-8 text-foreground/70">
          Northwind gives your team one place to plan, run, and report on work,
          so progress stays visible without another meeting.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <ButtonLink href="/pricing">See pricing</ButtonLink>
          <ButtonLink href="/about" variant="secondary">
            Learn more
          </ButtonLink>
        </div>
      </section>

      <section className="mt-16 grid grid-cols-1 gap-6 sm:mt-24 md:grid-cols-3">
        {features.map(({ title, body }) => (
          <Card key={title}>
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
            <p className="mt-2 text-base leading-7 text-foreground/70">
              {body}
            </p>
          </Card>
        ))}
      </section>

      <section className="mt-16 flex flex-col items-start gap-6 border-t border-solid border-black/[.08] pt-12 dark:border-white/[.145] sm:mt-24 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Start with your next project
          </h2>
          <p className="max-w-prose text-base leading-7 text-foreground/70">
            Pick a plan and invite your team in a few minutes.
          </p>
        </div>
        <ButtonLink href="/pricing">Get started</ButtonLink>
      </section>
    </Container>
  );
}
