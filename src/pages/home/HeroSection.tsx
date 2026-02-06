import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { ArrowRight, Play } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-accent)_0%,_transparent_50%)] opacity-15" />

      <Container className="relative text-center">
        <p className="mb-4 inline-block rounded-full border border-accent-light/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent-light">
          Trusted by 10,000+ tattoo professionals
        </p>

        <h1 className="mx-auto max-w-4xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Everything Your Tattoo Business Needs to{" "}
          <span className="text-accent-light">Thrive Online</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Websites, booking, CRM, marketing, and payments — all built
          exclusively for tattoo artists, studios, and event organizers.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button variant="hero">
            Start Free Trial
            <ArrowRight size={20} />
          </Button>
          <Button variant="heroOutline">
            <Play size={20} />
            Watch Demo
          </Button>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
          <span>No credit card required</span>
          <span className="hidden sm:inline">·</span>
          <span>14-day free trial</span>
          <span className="hidden sm:inline">·</span>
          <span>Cancel anytime</span>
        </div>
      </Container>
    </section>
  );
}
