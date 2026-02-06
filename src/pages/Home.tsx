import { HeroSection } from "./home/HeroSection";
import { AudienceSection } from "./home/AudienceSection";
import { SocialProofSection } from "./home/SocialProofSection";
import { FeaturesSection } from "./home/FeaturesSection";
import { PricingSection } from "./home/PricingSection";
import { FAQSection } from "./home/FAQSection";
import { NewsletterSection } from "./home/NewsletterSection";

export function Home() {
  return (
    <>
      <HeroSection />
      <AudienceSection />
      <SocialProofSection />
      <FeaturesSection />
      <PricingSection />
      <FAQSection />
      <NewsletterSection />
    </>
  );
}
