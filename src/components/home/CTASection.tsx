import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/site-config";

interface CTASectionProps {
  title?: string;
  description?: string;
  message?: string;
}

export default function CTASection({
  title = "Ready to start a project",
  description = "Message us on WhatsApp with what you need. We will confirm scope and price before any work begins.",
  message = "Hello OptimaByte, I would like to discuss a project.",
}: CTASectionProps) {
  return (
    <section className="py-20 md:py-24 border-t border-border">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">{description}</p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              Message us on WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
