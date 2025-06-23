import { ref, get } from "firebase/database";
import { db } from "@/lib/firebase";
import { notFound } from "next/navigation";
import Link from "next/link";

const CATEGORIES = [
    "front end only",
    "back end only",
    "full stack",
    "console",
    "other",
];

const TAB_COLORS = {
    "front end only": "bg-pink-500 hover:bg-pink-600 text-white",
    "back end only": "bg-green-500 hover:bg-green-600 text-white",
    "full stack": "bg-indigo-500 hover:bg-indigo-600 text-white",
    console: "bg-yellow-500 hover:bg-yellow-600 text-white",
    other: "bg-gray-500 hover:bg-gray-600 text-white",
};

function slugify(str) {
    return str.toLowerCase().replace(/\s+/g, "-");
}

function unslugify(slug) {
    return CATEGORIES.find((c) => slugify(c) === slug) || null;
}

export default async function TemplatesPage({ searchParams }) {
    const slug = searchParams?.category || slugify(CATEGORIES[0]);
    const activeCategory = unslugify(slug);

    if (!activeCategory) return notFound();

    const snapshot = await get(ref(db, "templates"));
    const data = snapshot.val() || {};

    const templates = Object.entries(data)
        .map(([id, val]) => ({ id, ...val }))
        .filter((t) => t.category === activeCategory);

    return (
        <section className="py-20 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Starter Code Templates
                    </h1>
                    <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
                        Browse ready-to-use starter projects by category.
                    </p>
                </div>

                {/* Tab Links */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {CATEGORIES.map((category) => {
                        const isActive = category === activeCategory;
                        const href = `?category=${slugify(category)}`;
                        const baseColor = TAB_COLORS[category];
                        return (
                            <Link
                                key={category}
                                href={href}
                                className={`px-4 py-2 text-sm font-medium rounded-full transition ${
                                    isActive
                                        ? baseColor
                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                }`}
                            >
                                {category}
                            </Link>
                        );
                    })}
                </div>

                {/* Templates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {templates.map((t) => (
                        <div
                            key={t.id}
                            className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:scale-[1.01] transition duration-200"
                        >
                            <h3 className="font-bold text-lg text-gray-800 mb-2">
                                {t.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                                {t.description}
                            </p>
                            <p className="text-sm text-gray-500 mb-3">
                                Tech: {t.technology}
                            </p>
                            <a
                                href={t.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block text-indigo-600 text-sm font-medium hover:underline"
                            >
                                View GitHub Repo →
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
