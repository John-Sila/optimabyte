import { Link } from "react-router-dom";
import LegalPage, { type LegalSection } from "@/components/layout/LegalPage";
import { siteConfig } from "@/lib/site-config";

const sections: LegalSection[] = [
  {
    id: "who",
    title: "Who we are",
    body: (
      <p>
        {siteConfig.fullName}, based in {siteConfig.location}, is responsible for the personal data collected
        through this website. You can reach us at <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        We handle personal data in line with the Kenya Data Protection Act, 2019.
      </p>
    ),
  },
  {
    id: "collect",
    title: "What we collect",
    body: (
      <>
        <p>
          <strong>When you send a request</strong> through the form, we store what you type: your name, email
          address, phone number (optional), the service you chose and your project details. We also record the
          date and time of the request.
        </p>
        <p>
          <strong>To protect the form from abuse</strong>, your browser keeps a random identifier and a one-way
          hash of a few browser traits, which we use only to limit each email and device to 3 requests per hour
          and to spot spam. We do not ask for your location, and we do not store your browser type, language,
          time zone, screen size or the page you came from with your request.
        </p>
        <p>
          <strong>When you use WhatsApp, email or phone</strong> to contact us, we receive whatever you send us
          through those services. WhatsApp&apos;s own privacy policy applies to messages sent through it.
        </p>
        <p>
          We do not run advertising or analytics trackers on this website. We do not collect payment details here.
        </p>
      </>
    ),
  },
  {
    id: "storage",
    title: "Cookies and browser storage",
    body: (
      <>
        <p>The website stores a few small items in your browser. They are not used for advertising:</p>
        <ul>
          <li>your light or dark theme choice;</li>
          <li>the random device identifier used for the request limit;</li>
          <li>a short-lived cache of site content (such as portfolio screenshots) so pages load faster;</li>
          <li>a sign-in session, only on the admin&apos;s own browser.</li>
        </ul>
        <p>You can clear these at any time in your browser settings. The form will still work afterwards.</p>
      </>
    ),
  },
  {
    id: "why",
    title: "How and why we use it",
    body: (
      <ul>
        <li>To read your request and reply to you by email (and by phone or WhatsApp if you give a number).</li>
        <li>To prepare quotes and plan the work you ask about.</li>
        <li>To keep the website secure and free of spam, and to enforce the request limits.</li>
        <li>To keep records of enquiries and projects.</li>
      </ul>
    ),
  },
  {
    id: "basis",
    title: "Our basis for using your data",
    body: (
      <p>
        We use your data because you asked us to respond to your enquiry (consent and steps before a contract),
        and because we have a legitimate interest in keeping the website secure and free from abuse.
      </p>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: (
      <>
        <p>We do not sell your data. We share it only with:</p>
        <ul>
          <li>
            <strong>Google Firebase (Google Cloud)</strong>, which stores the requests and signs the admin in.
            Google may process data on servers outside Kenya.
          </li>
          <li>
            <strong>WhatsApp (Meta)</strong>, only if you choose to message us there.
          </li>
          <li>People who work with us on your project, when needed for that work.</li>
          <li>Authorities, where the law requires it.</li>
        </ul>
      </>
    ),
  },
  {
    id: "access",
    title: "Who can see your request",
    body: (
      <p>
        Requests are visible only to the site admin, who signs in with a protected account. They are not public,
        and the website does not let visitors read other people&apos;s requests.
      </p>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <p>
        We keep a request for as long as we need it to handle your enquiry and keep proper records, then delete
        it. Rate-limit counters are temporary. You can ask us to delete your request at any time.
      </p>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <p>You can ask us to:</p>
        <ul>
          <li>tell you what personal data we hold about you and give you a copy;</li>
          <li>correct data that is wrong;</li>
          <li>delete your data;</li>
          <li>stop using your data for a purpose you object to.</li>
        </ul>
        <p>
          Email <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> from the address you used on the
          form. If you are not happy with our response, you can complain to the Office of the Data Protection
          Commissioner in Kenya.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: (
      <p>
        Data is sent over encrypted connections and stored in Firebase behind access rules that stop visitors
        from reading requests. No system is perfectly secure, so please do not put passwords or financial
        details in the project description.
      </p>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: <p>This website is meant for businesses and adults. We do not knowingly collect data from children.</p>,
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy. The date at the top shows the latest version. See also our{" "}
        <Link to="/terms">Terms of Service</Link> and the <Link to="/help">Help</Link> page.
      </p>
    ),
  },
];

export default function Privacy() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="What we collect when you use this website, why, and the choices you have."
      updated="24th Oct 2026"
      sections={sections}
    />
  );
}
