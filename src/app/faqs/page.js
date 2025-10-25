import { ref, get } from "firebase/database";
import { db } from "@/lib/firebase";
import Head from "next/head";

export const dynamic = "force-dynamic";
export default async function FaqsPage() {
  const snapshot = await get(ref(db, "faqs"));
  const data = snapshot.val() || {};

  const faqs = Object.entries(data).map(([id, val]) => ({
    id,
    ...val,
  }));

  return (
    <>
      <Head>
        <link rel="canonical" href="https://codehub-uga.com/faqs" />
      </Head>
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
              Have questions about CodeHub? Here are answers to the most common
              ones from students and new members.
            </p>
          </div>

          {/* FAQ Cards */}
          <div className="grid gap-6">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 transition"
              >
                <h3 className="font-semibold text-lg text-gray-800 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <p className="text-lg text-gray-700 mb-4">
              Didn't find what you were looking for?
            </p>
            <a
              href="https://discord.gg/bkmC9NYMaN"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-500 text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-blue-700 transition"
            >
              Ask in our Discord
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
