import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/site-config";

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink("Hello OptimaByte, I would like to discuss a project.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline text-sm font-medium">WhatsApp</span>
    </a>
  );
}
