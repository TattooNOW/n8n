import { Section, Container, SectionHeading, SectionSubheading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Solo Artist",
    price: "$29",
    period: "/mo",
    description: "Everything a solo artist needs to get booked and grow.",
    features: [
      "Portfolio website",
      "Online booking",
      "Client CRM",
      "Payment processing",
      "Email marketing (500 contacts)",
      "Social post scheduler",
      "Basic analytics",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Studio",
    price: "$79",
    period: "/mo",
    description: "Multi-artist tools for studios that mean business.",
    features: [
      "Everything in Solo Artist",
      "Up to 10 artist profiles",
      "Team calendar & scheduling",
      "Walk-in management",
      "Advanced analytics",
      "Reputation management",
      "Priority support",
      "Custom branding",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large studios, franchises, and event organizers.",
    features: [
      "Everything in Studio",
      "Unlimited artists",
      "Convention & event toolkit",
      "Vendor management",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <Section id="pricing">
      <Container>
        <div className="text-center">
          <SectionHeading>Simple, Transparent Pricing</SectionHeading>
          <SectionSubheading className="mx-auto">
            No hidden fees. No long-term contracts. Start free, upgrade when
            you're ready.
          </SectionSubheading>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${
                plan.popular
                  ? "border-accent-light shadow-lg shadow-accent/10"
                  : ""
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              )}
              <h3 className="font-display text-lg font-semibold">
                {plan.name}
              </h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-muted-foreground">{plan.period}</span>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm"
                  >
                    <Check size={16} className="mt-0.5 shrink-0 text-success" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "default" : "outline"}
                className="mt-8 w-full"
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
