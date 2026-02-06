import { useState } from "react";
import { Section, Container, SectionHeading } from "@/components/ui/Section";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Is TattooNOW only for tattoo artists?",
    answer:
      "TattooNOW is built specifically for the tattoo industry — solo artists, studios, and event/convention organizers. Every feature is designed with tattoo professionals in mind.",
  },
  {
    question: "Can I migrate my existing website?",
    answer:
      "Yes! Our team can help migrate your existing portfolio, client data, and booking history. We also offer free white-glove migration for Studio and Enterprise plans.",
  },
  {
    question: "What payment processors do you support?",
    answer:
      "We integrate with Stripe and Square for payment processing. You can accept credit cards, Apple Pay, Google Pay, and even Text-to-Pay deposits.",
  },
  {
    question: "Is there a contract or commitment?",
    answer:
      "No long-term contracts. All plans are month-to-month, and you can cancel anytime. We also offer annual billing with a 20% discount.",
  },
  {
    question: "Do you offer support for conventions and events?",
    answer:
      "Our Enterprise plan includes a full convention toolkit — vendor applications, booth assignments, ticket sales, and event promotion tools.",
  },
  {
    question: "Can I try TattooNOW for free?",
    answer:
      "Every plan includes a 14-day free trial with full access to all features. No credit card required to get started.",
  },
];

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        className="flex w-full items-center justify-between py-5 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-medium">{question}</span>
        <ChevronDown
          size={18}
          className={cn(
            "shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <p className="pb-5 text-sm leading-relaxed text-muted-foreground">
          {answer}
        </p>
      )}
    </div>
  );
}

export function FAQSection() {
  return (
    <Section id="faq" className="bg-card/50">
      <Container className="max-w-3xl">
        <div className="text-center">
          <SectionHeading>Frequently Asked Questions</SectionHeading>
        </div>

        <div className="mt-12">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} {...faq} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
