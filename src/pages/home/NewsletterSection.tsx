import { Section, Container, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Send } from "lucide-react";

export function NewsletterSection() {
  return (
    <Section id="newsletter">
      <Container className="max-w-2xl text-center">
        <SectionHeading>Stay in the Loop</SectionHeading>
        <p className="mt-4 text-muted-foreground">
          Get industry tips, product updates, and exclusive offers delivered
          to your inbox. No spam — just value.
        </p>

        <form
          className="mt-8 flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 rounded-lg border border-input bg-muted px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button variant="default" size="lg">
            <Send size={16} />
            Subscribe
          </Button>
        </form>

        <p className="mt-3 text-xs text-muted-foreground">
          Unsubscribe anytime. We respect your privacy.
        </p>
      </Container>
    </Section>
  );
}
