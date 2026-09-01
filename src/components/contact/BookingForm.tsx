import { useState, FormEvent } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/site-config";

const serviceOptions = [
  "Custom software",
  "Android or iOS app",
  "Website or web application",
  "Database management",
  "Changes to an existing project",
  "Graphic design or print",
];

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [error, setError] = useState("");

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.service || !formData.message.trim()) {
      setError("Please fill in your name, a service and a short project description.");
      return;
    }

    const lines = [
      `Hello OptimaByte, I would like to start a project.`,
      `Name: ${formData.name}`,
      formData.email ? `Email: ${formData.email}` : null,
      formData.phone ? `Phone: ${formData.phone}` : null,
      `Service: ${formData.service}`,
      `Details: ${formData.message}`,
    ].filter(Boolean);

    window.open(whatsappLink(lines.join("\n")), "_blank", "noopener,noreferrer");
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors";

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-5">
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Your name</label>
          <input
            type="text"
            required
            className={inputClass}
            value={formData.name}
            onChange={handleChange("name")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
          <input
            type="email"
            className={inputClass}
            value={formData.email}
            onChange={handleChange("email")}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Phone number</label>
        <input
          type="tel"
          className={inputClass}
          value={formData.phone}
          onChange={handleChange("phone")}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Service</label>
        <select
          required
          className={inputClass}
          value={formData.service}
          onChange={handleChange("service")}
        >
          <option value="">Select a service</option>
          {serviceOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Project details</label>
        <textarea
          required
          rows={4}
          className={`${inputClass} resize-none`}
          value={formData.message}
          onChange={handleChange("message")}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" size="lg" className="w-full">
        <MessageCircle className="h-4 w-4" />
        Send via WhatsApp
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        This opens WhatsApp with your details filled in. Nothing is sent until you press send there.
      </p>
    </form>
  );
}
