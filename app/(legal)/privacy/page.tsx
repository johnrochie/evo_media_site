import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Evolution Media",
  description:
    "How Evolution Media collects, uses, and protects your personal data. GDPR-compliant privacy policy.",
};

export default function PrivacyPage() {
  return (
    <article className="prose prose-invert prose-gray max-w-none">
      <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-white mb-8">
        Privacy Policy
      </h1>
      <p className="text-gray-400 text-sm mb-8">Last updated: March 2025</p>

      <div className="space-y-6 text-gray-300">
        <section>
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">
            Data controller
          </h2>
          <p>
            Evolution Media is the data controller for personal data collected
            through this website. We are committed to protecting your privacy in
            line with the EU General Data Protection Regulation (GDPR) and other
            applicable laws.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">
            Information we collect
          </h2>
          <p>
            <strong>Contact form:</strong> When you contact us via our form, we
            collect your name, email address, website type, budget range, and
            message. We use this solely to respond to your enquiry and provide
            our services.
          </p>
          <p>
            <strong>Live chat (with consent):</strong> If you accept analytics
            cookies, we load Crisp chat to provide support. Chat messages and
            metadata are processed by Crisp; see{" "}
            <a
              href="https://crisp.chat/en/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00d4ff] hover:underline"
            >
              Crisp&apos;s Privacy Policy
            </a>
            .
          </p>
          <p>
            <strong>Analytics (with consent):</strong> If you accept analytics
            cookies, we use Vercel Web Analytics and Google Analytics to collect
            anonymised usage data (e.g. page views). IP anonymisation is enabled.
            Data is aggregated and not sold to third parties. See{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00d4ff] hover:underline"
            >
              Google&apos;s Privacy Policy
            </a>{" "}
            for how Google processes data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">
            Legal basis
          </h2>
          <p>
            We process your data on the following bases:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>
              <strong>Contract / pre-contract:</strong> Contact form enquiries,
              to respond and provide quotes.
            </li>
            <li>
              <strong>Consent:</strong> Analytics, only when you accept cookies.
            </li>
            <li>
              <strong>Legitimate interest:</strong> Improving our services,
              security, and legal compliance.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">
            How we use your information
          </h2>
          <p>
            We use the information you provide to communicate with you about
            your project, deliver web design and development services, and
            improve our website. We do not sell or share your personal data with
            third parties for marketing purposes.
          </p>
        </section>

        <section id="cookies">
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">
            Cookies and similar technologies
          </h2>
          <p>
            <strong>Strictly necessary:</strong> We use local storage to remember
            your cookie consent choice. This is required for compliance and
            cannot be disabled.
          </p>
          <p>
            <strong>Analytics and chat (optional):</strong> With your consent, we
            use Vercel Web Analytics (anonymised data, no cookies) and Crisp
            live chat. You can accept or reject these via our cookie banner and
            change your choice anytime via{" "}
            <Link href="/privacy#cookies" className="text-[#00d4ff] hover:underline">
              Cookie preferences
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">
            Data retention
          </h2>
          <p>
            Contact form data is kept only as long as needed to fulfil your
            enquiry and any resulting project. Analytics data is aggregated and
            retained according to our provider&apos;s policy. You may request
            deletion at any time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">
            Your rights (GDPR)
          </h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li><strong>Access</strong> – request a copy of your personal data</li>
            <li><strong>Rectification</strong> – correct inaccurate data</li>
            <li><strong>Erasure</strong> – request deletion of your data</li>
            <li><strong>Restriction</strong> – limit how we process your data</li>
            <li><strong>Portability</strong> – receive your data in a structured format</li>
            <li><strong>Object</strong> – object to processing based on legitimate interest</li>
            <li><strong>Withdraw consent</strong> – withdraw consent for analytics at any time</li>
          </ul>
          <p className="mt-4">
            To exercise these rights,{" "}
            <Link href="/#contact" className="text-[#00d4ff] hover:underline">
              contact us via our form
            </Link>
            . You may also lodge a complaint with your local data protection
            authority.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">
            International transfers
          </h2>
          <p>
            Our hosting and tools (e.g. Vercel, Resend) may process data outside
            the UK/EEA. We ensure appropriate safeguards (e.g. adequacy
            decisions, standard contractual clauses) where required.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">
            Changes
          </h2>
          <p>
            We may update this policy from time to time. The &quot;Last updated&quot; date
            above indicates when changes were last made.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">
            Contact
          </h2>
          <p>
            For questions about this privacy policy or your data,{" "}
            <Link href="/#contact" className="text-[#00d4ff] hover:underline">
              get in touch via our contact form
            </Link>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
