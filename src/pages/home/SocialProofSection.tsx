import { Section, Container, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "TattooNOW completely transformed how I run my business. My bookings increased 3x in the first month.",
    name: "Marcus Chen",
    role: "Solo Artist, Portland OR",
    rating: 5,
  },
  {
    quote:
      "Managing five artists used to be chaos. Now everything is in one place — scheduling, payments, portfolios.",
    name: "Sarah Blackwood",
    role: "Studio Owner, Austin TX",
    rating: 5,
  },
  {
    quote:
      "The convention toolkit made organizing our annual event effortless. Vendor signups, tickets, everything.",
    name: "Jake Torres",
    role: "Event Organizer, Miami FL",
    rating: 5,
  },
];

export function SocialProofSection() {
  return (
    <Section id="social-proof" className="bg-card/50">
      <Container>
        <div className="text-center">
          <SectionHeading>Loved by Tattoo Professionals</SectionHeading>
          <p className="mt-4 text-muted-foreground">
            See what artists and studio owners are saying about TattooNOW.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="flex flex-col">
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-warning text-warning"
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                "{t.quote}"
              </blockquote>
              <div className="mt-6 border-t border-border pt-4">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
