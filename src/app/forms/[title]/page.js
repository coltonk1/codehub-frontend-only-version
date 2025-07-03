import { get, ref } from "firebase/database";
import { db } from "@/lib/firebase";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export default async function FormDetailPage({ params }) {
    const snap = await get(ref(db, "forms"));
    const data = snap.val() || {};

    const forms = Object.entries(data).map(([id, val]) => ({ id, ...val }));
    const match = forms.find(
        (f) =>
            f.title.toLowerCase().replaceAll(" ", "-") ===
            params.title.toLowerCase()
    );

    if (!match) return notFound();

    return (
        <section className="px-4 py-20 max-w-5xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-800">
                    {match.title}
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                    Fill out the form below.
                </p>
            </div>

            <div className="rounded-2xl shadow-lg overflow-hidden aspect-video bg-gray-100">
                <iframe
                    src={match.url}
                    className="w-full h-full"
                    allowFullScreen
                    loading="lazy"
                />
            </div>
        </section>
    );
}
