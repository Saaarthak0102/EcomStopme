import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { WhyDifferentSection } from "@/components/landing/WhyDifferentSection";
import { ProductShowcaseSection } from "@/components/landing/ProductShowcaseSection";
import { LiveDemoSection } from "@/components/landing/LiveDemoSection";
import { QuoteBannerSection } from "@/components/landing/QuoteBannerSection";
import { ReviewsSection } from "@/components/landing/ReviewsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingNav />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <WhyDifferentSection />
      <ProductShowcaseSection />
      <LiveDemoSection />
      <QuoteBannerSection />
      <ReviewsSection />
      <FAQSection />
      <LandingFooter />
    </div>
  );
}

