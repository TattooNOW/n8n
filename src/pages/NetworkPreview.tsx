import { Section, Container, SectionHeading, SectionSubheading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowRight, MapPin, Star, Search } from "lucide-react";
import { useState } from "react";

const sampleArtists = [
  {
    name: "Marcus Chen",
    specialty: "Japanese Traditional",
    location: "Portland, OR",
    rating: 4.9,
    reviews: 127,
  },
  {
    name: "Sarah Blackwood",
    specialty: "Blackwork & Dotwork",
    location: "Austin, TX",
    rating: 5.0,
    reviews: 89,
  },
  {
    name: "Diego Ramirez",
    specialty: "Neo-Traditional",
    location: "Miami, FL",
    rating: 4.8,
    reviews: 203,
  },
  {
    name: "Emma Wilkins",
    specialty: "Watercolor",
    location: "Seattle, WA",
    rating: 4.9,
    reviews: 64,
  },
  {
    name: "Jake Torres",
    specialty: "Realism & Portraits",
    location: "Los Angeles, CA",
    rating: 5.0,
    reviews: 312,
  },
  {
    name: "Aisha Patel",
    specialty: "Fine Line & Micro",
    location: "New York, NY",
    rating: 4.7,
    reviews: 156,
  },
];

const sampleStudios = [
  {
    name: "Black Anvil Tattoo",
    artists: 6,
    location: "Brooklyn, NY",
    rating: 4.9,
    reviews: 421,
  },
  {
    name: "Sacred Skin Collective",
    artists: 4,
    location: "San Francisco, CA",
    rating: 4.8,
    reviews: 287,
  },
  {
    name: "Iron Rose Studio",
    artists: 8,
    location: "Chicago, IL",
    rating: 5.0,
    reviews: 512,
  },
];

export function NetworkPreview() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-accent)_0%,_transparent_50%)] opacity-15" />
        <Container className="relative text-center">
          <p className="mb-4 inline-block rounded-full border border-accent-light/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent-light">
            Directory Network
          </p>

          <h1 className="mx-auto max-w-4xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Discover Top Tattoo{" "}
            <span className="text-accent-light">Artists & Studios</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Browse the TattooNOW network — the largest directory of verified
            tattoo professionals. Find your next artist by style, location, or
            availability.
          </p>

          {/* Search */}
          <div className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search by style, artist, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-input bg-muted py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button variant="default" size="lg">
              Search
            </Button>
          </div>
        </Container>
      </section>

      {/* Featured Artists */}
      <Section>
        <Container>
          <SectionHeading>Featured Artists</SectionHeading>
          <SectionSubheading>
            Top-rated artists on the TattooNOW network.
          </SectionSubheading>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sampleArtists.map((artist) => (
              <Card
                key={artist.name}
                className="transition-colors hover:border-accent-light/30"
              >
                <div className="flex h-32 items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
                  Portfolio Preview
                </div>
                <h3 className="mt-4 font-display text-base font-semibold">
                  {artist.name}
                </h3>
                <p className="text-sm text-accent-light">
                  {artist.specialty}
                </p>
                <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {artist.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={14} className="fill-warning text-warning" />
                    {artist.rating} ({artist.reviews})
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Featured Studios */}
      <Section className="bg-card/50">
        <Container>
          <SectionHeading>Featured Studios</SectionHeading>
          <SectionSubheading>
            Premier tattoo studios in the network.
          </SectionSubheading>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sampleStudios.map((studio) => (
              <Card
                key={studio.name}
                className="transition-colors hover:border-accent-light/30"
              >
                <div className="flex h-32 items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
                  Studio Preview
                </div>
                <h3 className="mt-4 font-display text-base font-semibold">
                  {studio.name}
                </h3>
                <p className="text-sm text-accent-light">
                  {studio.artists} Artists
                </p>
                <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {studio.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={14} className="fill-warning text-warning" />
                    {studio.rating} ({studio.reviews})
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section>
        <Container className="text-center">
          <SectionHeading>
            List Your Business on TattooNOW
          </SectionHeading>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Join the network and get discovered by thousands of clients
            searching for tattoo artists in your area.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="hero">
              Join the Network
              <ArrowRight size={20} />
            </Button>
            <Button variant="heroOutline">Learn More</Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
