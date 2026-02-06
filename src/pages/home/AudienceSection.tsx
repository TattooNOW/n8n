import { Section, Container, SectionHeading, SectionSubheading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Palette, Building2, CalendarDays } from "lucide-react";

const audiences = [
  {
    icon: Palette,
    title: "Solo Artists",
    description:
      "Build your brand, manage bookings, and grow your client base — all from one platform designed for independent tattoo artists.",
  },
  {
    icon: Building2,
    title: "Studios",
    description:
      "Coordinate multiple artists, manage walk-ins, streamline payments, and keep your studio running smoothly with powerful team tools.",
  },
  {
    icon: CalendarDays,
    title: "Event Organizers",
    description:
      "Promote conventions, manage vendor applications, sell tickets, and create unforgettable tattoo events with our event toolkit.",
  },
];

export function AudienceSection() {
  return (
    <Section id="audience">
      <Container>
        <div className="text-center">
          <SectionHeading>Built for Every Tattoo Professional</SectionHeading>
          <SectionSubheading className="mx-auto">
            Whether you're a solo artist, run a studio, or organize events —
            TattooNOW has the tools you need.
          </SectionSubheading>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {audiences.map((item) => (
            <Card
              key={item.title}
              className="text-center transition-colors hover:border-accent-light/30"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-accent/10">
                <item.icon size={28} className="text-accent-light" strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
