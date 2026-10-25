import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/site-config";

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink("Hello OptimaByte, I would like to discuss a project.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
    >
      <span className="absolute inset-0 -z-10 animate-pulse-ring rounded-full bg-primary/40" aria-hidden="true" />
      <MessageCircle className="h-5 w-5" />
      <span className="hidden text-sm font-medium sm:inline">WhatsApp</span>
    </a>
  );
}
