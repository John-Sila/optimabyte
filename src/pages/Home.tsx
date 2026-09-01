import PageShell from "@/components/layout/PageShell";
import Hero from "@/components/home/Hero";
import ServicesOverview from "@/components/home/ServicesOverview";
import WhyUs from "@/components/home/WhyUs";
import ProcessSteps from "@/components/home/ProcessSteps";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <PageShell>
      <Hero />
      <ServicesOverview />
      <WhyUs />
      <ProcessSteps />
      <CTASection />
    </PageShell>
  );
}
