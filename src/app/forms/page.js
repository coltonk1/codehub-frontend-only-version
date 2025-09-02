import { get, ref } from "firebase/database";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Head from "next/head";

export const dynamic = "force-dynamic";
export default async function FormsPage() {
    const snap = await get(ref(db, "forms"));
    const data = snap.val() || {};

    const forms = Object.entries(data).map(([id, val]) => ({
        id,
        ...val,
    }));

    return (
        <>
            <Head>
                <link rel="canonical" href="https://codehub-uga.com/forms" />
            </Head>
            <section className="px-4 py-20 max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Available Forms
                    </h1>
                    <p className="text-gray-600 mt-2 text-lg">
                        Submit project info, feedback, or event signups through
                        these forms.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {forms.map((form) => (
                        <div
                            key={form.id}
                            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition border-gray-200 border"
                        >
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                {form.title}
                            </h2>
                            <Link
                                href={`/forms/${encodeURIComponent(
                                    form.title
                                        .toLowerCase()
                                        .replaceAll(" ", "-")
                                )}`}
                                className="inline-block text-indigo-600 text-sm font-medium hover:underline"
                            >
                                View Form Page →
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
