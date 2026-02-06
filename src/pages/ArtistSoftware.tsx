import { Section, Container, SectionHeading, SectionSubheading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Check, ArrowRight, Quote } from "lucide-react";
import {
  Package,
  Users,
  Globe,
  Phone,
  MessageSquare,
  Star,
  CalendarDays,
  CalendarCheck,
  Mail,
  Clock,
  HeartHandshake,
} from "lucide-react";

/* ---------- Hero ---------- */
function ArtistHero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-accent)_0%,_transparent_50%)] opacity-15" />
      <Container className="relative text-center">
        <p className="mb-4 inline-block rounded-full border border-accent-light/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent-light">
          Artist Software Suite
        </p>

        <h1 className="mx-auto max-w-4xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Your Tattoo Career,{" "}
          <span className="text-accent-light">Fully Automated</span>
        </h1>

        <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-border bg-card p-6">
          <Quote size={24} className="text-accent-light" />
          <p className="mt-3 text-lg italic text-muted-foreground">
            "Since switching to TattooNOW, I spend 80% less time on admin and
            100% more time doing what I love — tattooing."
          </p>
          <p className="mt-3 text-sm font-semibold">
            Gabe Ripley{" "}
            <span className="font-normal text-muted-foreground">
              — Award-winning tattoo artist
            </span>
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button variant="hero">
            Start Free Trial
            <ArrowRight size={20} />
          </Button>
          <Button variant="heroOutline">View Live Demo</Button>
        </div>
      </Container>
    </section>
  );
}

/* ---------- Tools Grid ---------- */
const tools = [
  {
    icon: Package,
    title: "One-Box",
    description: "A single dashboard to manage every aspect of your tattoo business.",
  },
  {
    icon: Users,
    title: "CRM",
    description: "Track clients, preferences, consent forms, and communication history.",
  },
  {
    icon: Globe,
    title: "Website Builder",
    description: "Drag-and-drop portfolio sites optimized for tattoo artists.",
  },
  {
    icon: Phone,
    title: "IVR Phone System",
    description: "Professional phone system with auto-attendant and call routing.",
  },
  {
    icon: MessageSquare,
    title: "Text-to-Pay",
    description: "Send payment requests via text. Clients pay instantly from their phone.",
  },
  {
    icon: Star,
    title: "Reputation Manager",
    description: "Automate review requests and monitor your online reputation.",
  },
  {
    icon: CalendarDays,
    title: "Calendars",
    description: "Sync all your calendars in one view — personal, booking, and events.",
  },
  {
    icon: CalendarCheck,
    title: "Appointments",
    description: "Online booking with deposits, automated reminders, and waitlists.",
  },
  {
    icon: Mail,
    title: "Email Marketing",
    description: "Drag-and-drop email campaigns, automations, and drip sequences.",
  },
  {
    icon: Clock,
    title: "Post Scheduler",
    description: "Plan and auto-publish social content across all your platforms.",
  },
  {
    icon: HeartHandshake,
    title: "Gabe's Help",
    description: "Personalized onboarding and ongoing support from Gabe and the team.",
  },
];

function ToolsGrid() {
  return (
    <Section>
      <Container>
        <div className="text-center">
          <SectionHeading>
            11 Tools.{" "}
            <span className="text-accent-light">One Platform.</span>
          </SectionHeading>
          <SectionSubheading className="mx-auto">
            Everything you need to book more clients, get paid faster, and
            build your brand.
          </SectionSubheading>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <div
              key={tool.title}
              className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent-light/30"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 transition-colors group-hover:bg-accent/20">
                <tool.icon
                  size={20}
                  className="text-accent-light"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold">
                {tool.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {tool.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ---------- Pricing ---------- */
const packages = [
  {
    name: "Artist Essentials",
    price: "$99",
    period: "/mo",
    description: "Core tools to run a professional tattoo business.",
    features: [
      "Portfolio website",
      "Online booking & deposits",
      "Client CRM",
      "Text-to-Pay",
      "Reputation management",
      "Social post scheduler",
      "Email marketing (1,000 contacts)",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "$199",
    period: "/mo",
    description: "The full suite for serious artists who want to scale.",
    features: [
      "Everything in Essentials",
      "IVR phone system",
      "Advanced automations",
      "Unlimited email contacts",
      "Priority support",
      "Custom branding & domain",
      "Gabe's Help onboarding",
      "API access",
    ],
    popular: true,
  },
];

const usagePricing = [
  { item: "Additional phone numbers", price: "$5/mo each" },
  { item: "SMS messages", price: "$0.015/segment" },
  { item: "Email sends (over limit)", price: "$0.001/email" },
  { item: "Additional users", price: "$25/mo each" },
];

function ArtistPricing() {
  return (
    <Section id="artist-pricing" className="bg-card/50">
      <Container>
        <div className="text-center">
          <SectionHeading>Transparent Pricing</SectionHeading>
          <SectionSubheading className="mx-auto">
            Two packages designed for where you are in your career.
          </SectionSubheading>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-8 lg:grid-cols-2">
          {packages.map((pkg) => (
            <Card
              key={pkg.name}
              className={`relative flex flex-col ${
                pkg.popular
                  ? "border-accent-light shadow-lg shadow-accent/10"
                  : ""
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              )}
              <h3 className="font-display text-lg font-semibold">
                {pkg.name}
              </h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold">
                  {pkg.price}
                </span>
                <span className="text-muted-foreground">{pkg.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {pkg.description}
              </p>

              <ul className="mt-6 flex-1 space-y-3">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-success"
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={pkg.popular ? "default" : "outline"}
                className="mt-8 w-full"
              >
                Start Free Trial
              </Button>
            </Card>
          ))}
        </div>

        {/* Usage Pricing */}
        <div className="mx-auto mt-12 max-w-2xl rounded-xl border border-border bg-card p-6">
          <h3 className="text-center font-display text-lg font-semibold">
            Usage-Based Pricing
          </h3>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Pay only for what you use beyond your plan limits.
          </p>
          <div className="mt-4 space-y-2">
            {usagePricing.map((row) => (
              <div
                key={row.item}
                className="flex items-center justify-between border-b border-border py-2 text-sm last:border-0"
              >
                <span className="text-muted-foreground">{row.item}</span>
                <span className="font-medium">{row.price}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ---------- CTA ---------- */
function ArtistCTA() {
  return (
    <Section>
      <Container className="text-center">
        <SectionHeading>
          Ready to Level Up Your Tattoo Career?
        </SectionHeading>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Join thousands of artists who trust TattooNOW to run their business.
          Start your free trial today — no credit card required.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button variant="hero">
            Start Free Trial
            <ArrowRight size={20} />
          </Button>
          <Button variant="heroOutline">Talk to Sales</Button>
        </div>
      </Container>
    </Section>
  );
}

/* ---------- Page ---------- */
export function ArtistSoftware() {
  return (
    <>
      <ArtistHero />
      <ToolsGrid />
      <ArtistPricing />
      <ArtistCTA />
    </>
  );
}
