import PageShell from "@/components/layout/PageShell";
import Hero from "@/components/home/Hero";
import TechMarquee from "@/components/home/TechMarquee";
import ServicesOverview from "@/components/home/ServicesOverview";
import Industries from "@/components/home/Industries";
import FeaturedWork from "@/components/home/FeaturedWork";
import WhyUs from "@/components/home/WhyUs";
import ProcessSteps from "@/components/home/ProcessSteps";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <PageShell>
      <Hero />
      <TechMarquee />
      <ServicesOverview />
      <Industries />
      <FeaturedWork />
      <WhyUs />
      <ProcessSteps />
      <CTASection />
    </PageShell>
  );
}
