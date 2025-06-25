import Link from "next/link";
import { ref, get } from "firebase/database";
import { db } from "@/lib/firebase";

const semesterOrder = { Spring: 0, Fall: 1 };

function slugify(title) {
    return title.toLowerCase().replace(/\s+/g, "-");
}

export default async function ProjectPage() {
    const snap = await get(ref(db, "projects"));
    const data = snap.val() ?? {};

    const projects = Object.entries(data)
        .map(([id, val]) => ({ id, ...val }))
        .sort((a, b) => {
            const yd = b.year - a.year;
            return yd !== 0
                ? yd
                : semesterOrder[b.semester] - semesterOrder[a.semester];
        });

    if (projects.length === 0) return null;

    const [featured, ...others] = projects;

    return (
        <section className="py-20 px-4">
            <div className="max-w-5xl mx-auto space-y-16">
                {/* ── featured project ── */}
                <article>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        {featured.title}
                    </h1>

                    <p className="text-lg text-gray-700 mb-8 max-w-2xl">
                        {featured.description}
                    </p>

                    <div className="w-full aspect-video bg-gray-100 flex items-center justify-center rounded-xl overflow-hidden mb-8 border border-gray-300">
                        {featured.imageUrl ? (
                            <img
                                src={featured.imageUrl}
                                alt={`${featured.title} preview`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-gray-500 text-sm">
                                No Image Available
                            </span>
                        )}
                    </div>

                    <ul className="text-sm text-gray-700 space-y-2">
                        <li>
                            <strong>Semester:</strong> {featured.semester}{" "}
                            {featured.year}
                        </li>
                        {featured.technologies?.length > 0 && (
                            <li>
                                <strong>Technologies:</strong>{" "}
                                {featured.technologies.join(", ")}
                            </li>
                        )}
                        {featured.developers?.length > 0 && (
                            <li>
                                <strong>Developers:</strong>{" "}
                                {featured.developers.join(", ")}
                            </li>
                        )}
                        {featured.github && (
                            <li>
                                <strong>GitHub:</strong>{" "}
                                <a
                                    href={featured.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline hover:text-blue-800"
                                >
                                    {featured.github}
                                </a>
                            </li>
                        )}
                        {featured.live && (
                            <li>
                                <strong>Live Site:</strong>{" "}
                                <a
                                    href={featured.live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline hover:text-blue-800"
                                >
                                    {featured.live}
                                </a>
                            </li>
                        )}
                    </ul>
                </article>

                {/* ── remaining projects in 3-col grid ── */}
                {others.length > 0 && (
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">
                            More Projects
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {others.map((proj) => (
                                <Link
                                    key={proj.id}
                                    href={`/projects/${slugify(proj.title)}`}
                                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-200"
                                >
                                    <div className="aspect-video bg-gray-100 border-b border-gray-200">
                                        {proj.imageUrl ? (
                                            <img
                                                src={proj.imageUrl}
                                                alt={proj.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-sm text-gray-500">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 space-y-1">
                                        <h3 className="text-sm font-semibold text-gray-800 truncate">
                                            {proj.title}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {proj.semester} {proj.year}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </section>
    );
}
