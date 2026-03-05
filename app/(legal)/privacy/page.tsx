import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Evolution Media",
  description: "Privacy policy for Evolution Media.",
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
            Information we collect
          </h2>
          <p>
            When you contact us via our form or email, we collect your name,
            email address, and the message you send. We use this information only
            to respond to your enquiry and to provide our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">
            How we use your information
          </h2>
          <p>
            We use the information you provide to communicate with you about
            your project and to deliver our web design and development services.
            We do not sell or share your personal data with third parties for
            marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">
            Cookies and analytics
          </h2>
          <p>
            Our website may use cookies or similar technologies for essential
            functionality. If we add analytics in the future, we will update
            this policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">
            Contact
          </h2>
          <p>
            For questions about this privacy policy or your data,{" "}
            <a
              href="/#contact"
              className="text-[#00d4ff] hover:underline"
            >
              get in touch via our contact form
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
