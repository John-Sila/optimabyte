import { Link } from "react-router-dom";
import LegalPage, { type LegalSection } from "@/components/layout/LegalPage";
import { siteConfig } from "@/lib/site-config";

const sections: LegalSection[] = [
  {
    id: "about",
    title: "About these terms",
    body: (
      <>
        <p>
          These terms apply to your use of this website and to enquiries you send through it. The website is
          operated by {siteConfig.fullName} (&ldquo;OptimaByte&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;),
          based in {siteConfig.location}.
        </p>
        <p>By using the website you agree to these terms. If you do not agree, please do not use it.</p>
      </>
    ),
  },
  {
    id: "website",
    title: "Using the website",
    body: (
      <>
        <p>You may browse the website and send us requests for lawful, business purposes. You agree not to:</p>
        <ul>
          <li>send false, abusive, misleading or spam requests, or requests on behalf of someone else without their knowledge;</li>
          <li>use scripts, bots or other automated means to submit the request form or to collect information from the website;</li>
          <li>try to bypass the request limits, the human check, or any security measure;</li>
          <li>try to access the admin area, other users&apos; data or our systems without permission.</li>
        </ul>
        <p>We may block access for anyone who breaks these rules.</p>
      </>
    ),
  },
  {
    id: "requests",
    title: "Requests and enquiries",
    body: (
      <>
        <p>
          Sending a request through the form, WhatsApp or email is an enquiry only. It does not create a
          contract, and it does not oblige either side to do any work.
        </p>
        <p>
          To keep the form free of spam, each email address and each device can send up to 3 requests per hour.
          We aim to reply to your email later the same day (evening) if the request arrives before 6:00 pm
          Nairobi time, and early the next morning if it arrives after. These are targets, not guarantees.
        </p>
      </>
    ),
  },
  {
    id: "services",
    title: "Services, quotes and pricing",
    body: (
      <>
        <p>
          The <Link to="/pricing">Pricing</Link> page shows our standard structure. All fees are in Kenya
          shillings (KES) and exclude VAT unless a quote says otherwise. Larger or non-standard projects are
          quoted individually.
        </p>
        <p>
          Work starts only after we have confirmed the scope, price and timeline with you in writing (WhatsApp
          or email is fine). Changes outside the agreed scope are quoted before they are done.
        </p>
      </>
    ),
  },
  {
    id: "payments",
    title: "Payments",
    body: (
      <p>
        Payment amounts and due dates are those in the written quote we confirm with you. Monthly retainer and
        database management fees apply from the month stated in that quote. We may pause support on a retainer
        that is overdue, after giving you notice.
      </p>
    ),
  },
  {
    id: "ip",
    title: "Intellectual property",
    body: (
      <>
        <p>
          The text, design, graphics and code of this website belong to {siteConfig.fullName} or its licensors.
          You may not copy or reuse them without our written permission.
        </p>
        <p>
          Ownership and licensing of software we build for you is set out in the written agreement for your
          project. Tools, libraries and components we use that are owned by others stay under their own
          licences.
        </p>
      </>
    ),
  },
  {
    id: "clients",
    title: "Your responsibilities",
    body: (
      <ul>
        <li>Give us accurate information and the access we need to do the work.</li>
        <li>Make sure you have the right to any content, logos and data you give us.</li>
        <li>Keep your account passwords and access keys safe.</li>
        <li>Review and approve work at the stages we agree.</li>
      </ul>
    ),
  },
  {
    id: "third-parties",
    title: "Third-party services",
    body: (
      <p>
        Our work and this website rely on third-party services such as Google Firebase, WhatsApp, M-Pesa, the
        Google Play Store and the Apple App Store. Those services have their own terms and can change or go
        down. We are not responsible for their availability or conduct.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Disclaimer and limit of liability",
    body: (
      <>
        <p>
          The website is provided &ldquo;as is&rdquo;. We try to keep the information on it accurate and up to
          date but do not promise it is free of errors.
        </p>
        <p>
          To the extent the law allows, we are not liable for indirect or consequential losses arising from the
          use of this website. Nothing in these terms limits any liability that cannot be limited by law.
          Liability for project work is governed by the agreement for that project.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <p>
        We may update these terms from time to time. The date at the top of this page shows when they were
        last changed. Continuing to use the website after a change means you accept the new terms.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law",
    body: (
      <p>
        These terms are governed by the laws of Kenya, and the courts of Kenya have jurisdiction over any
        dispute arising from them.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Questions about these terms: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or WhatsApp{" "}
        {siteConfig.phone}. See also our <Link to="/privacy">Privacy Policy</Link> and{" "}
        <Link to="/help">Help</Link> page.
      </p>
    ),
  },
];

export default function Terms() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      description="The rules for using this website and sending us requests, in plain language."
      updated="24th Oct 2026"
      sections={sections}
    />
  );
}
