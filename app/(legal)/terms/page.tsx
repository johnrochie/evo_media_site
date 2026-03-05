import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Evolution Media",
  description: "Terms of service for Evolution Media.",
};

export default function TermsPage() {
  return (
    <article className="prose prose-invert prose-gray max-w-none">
      <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-white mb-8">
        Terms of Service
      </h1>
      <p className="text-gray-400 text-sm mb-8">Last updated: March 2025</p>

      <div className="space-y-6 text-gray-300">
        <section>
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">
            Agreement
          </h2>
          <p>
            By using our website or engaging our services, you agree to these
            terms. Evolution Media provides web design, development, and related
            digital services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">
            Services
          </h2>
          <p>
            We will deliver the services and deliverables as agreed in the quote
            or project brief. Scope changes may require a separate agreement.
            Timelines are estimates and not guaranteed unless otherwise stated.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">
            Payment
          </h2>
          <p>
            Payment terms will be specified in your quote or contract. We
            typically require a deposit before work begins and the balance upon
            completion or according to the agreed schedule.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">
            Intellectual property
          </h2>
          <p>
            Upon full payment, you receive the agreed deliverables and rights to
            use them for your business. We retain the right to showcase the work
            in our portfolio unless otherwise agreed.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">
            Contact
          </h2>
          <p>
            For questions about these terms,{" "}
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
