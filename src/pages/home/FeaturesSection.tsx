import { Section, Container, SectionHeading, SectionSubheading } from "@/components/ui/Section";
import {
  Globe,
  CalendarCheck,
  CreditCard,
  Users,
  BarChart3,
  Mail,
  Smartphone,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Portfolio Websites",
    description: "Beautiful, mobile-ready websites with built-in galleries to showcase your best work.",
  },
  {
    icon: CalendarCheck,
    title: "Online Booking",
    description: "Let clients book appointments 24/7 with automated confirmations and reminders.",
  },
  {
    icon: CreditCard,
    title: "Payments & Invoicing",
    description: "Accept deposits, process payments, and send invoices — all in one place.",
  },
  {
    icon: Users,
    title: "Client CRM",
    description: "Track client history, preferences, consent forms, and communication in a unified CRM.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description: "Understand your business with real-time analytics on bookings, revenue, and growth.",
  },
  {
    icon: Mail,
    title: "Email Marketing",
    description: "Send targeted campaigns, flash sale announcements, and automated follow-ups.",
  },
  {
    icon: Smartphone,
    title: "Social Scheduling",
    description: "Plan and auto-publish posts across Instagram, Facebook, and TikTok.",
  },
  {
    icon: ShieldCheck,
    title: "Reputation Management",
    description: "Collect reviews, monitor your online reputation, and respond from one dashboard.",
  },
];

export function FeaturesSection() {
  return (
    <Section id="features">
      <Container>
        <div className="text-center">
          <SectionHeading>
            All the Tools You Need, <span className="text-accent-light">None You Don't</span>
          </SectionHeading>
          <SectionSubheading className="mx-auto">
            Purpose-built features for the tattoo industry — no generic bloat.
          </SectionSubheading>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent-light/30"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 transition-colors group-hover:bg-accent/20">
                <f.icon size={20} className="text-accent-light" strokeWidth={1.5} />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
