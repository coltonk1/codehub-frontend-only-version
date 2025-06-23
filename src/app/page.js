import { getDatabase, ref, get } from "firebase/database";
import { db } from "@/lib/firebase";
import Link from "next/link";

export default async function CodeHubLanding() {
    const [projSnap, tmpSnap, faqSnap, formSnap] = await Promise.all([
        get(ref(db, "projects")),
        get(ref(db, "templates")),
        get(ref(db, "faqs")),
        get(ref(db, "forms")),
    ]);

    const semesterOrder = { Spring: 0, Fall: 1 };

    const projects = Object.entries(projSnap.val() || {})
        .map(([id, val]) => ({ id, ...val }))
        .sort((a, b) => {
            const yd = b.year - a.year;
            return yd !== 0
                ? yd
                : semesterOrder[b.semester] - semesterOrder[a.semester];
        })
        .slice(0, 3);

    const templates = Object.entries(tmpSnap.val() || {}).map(([id, val]) => ({
        id,
        ...val,
    }));
    const faqs = Object.entries(faqSnap.val() || {})
        .map(([id, val]) => ({ id, ...val }))
        .slice(0, 4);
    const forms = Object.entries(formSnap.val() || {}).map(([id, val]) => ({
        id,
        ...val,
    }));

    return (
        <div className="min-h-screen overflow-x-hidden flex flex-col gap-10">
            <Hero />
            <About />
            <RecentProjects projects={projects} />
            <Templates templates={templates} />
            <FAQs faqs={faqs} />
            <CTA />

            <footer className="bg-gray-900 text-gray-400 text-center py-6">
                <p className="text-sm">
                    © {new Date().getFullYear()} CodeHub @ UGA. All rights
                    reserved.
                </p>
            </footer>
        </div>
    );
}

function Hero() {
    return (
        <section className="text-white text-center p-4">
            <div
                className="py-50 rounded-2xl shadow-lg"
                style={{
                    backgroundImage: "url(/hero-image.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-yellow-300">
                    CodeHub
                </h1>
                <p className="text-lg md:text-2xl max-w-2xl mx-auto">
                    Build real projects. Learn modern tech. Demo your work every
                    semester.
                </p>
                <Link
                    href="/projects"
                    className="inline-block mt-10 bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition"
                >
                    Explore Projects
                </Link>
            </div>
        </section>
    );
}

function About() {
    return (
        <section className="bg-gray-100 py-16 px-4 text-gray-800">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 p-10 ">
                {/* Text Content */}
                <div className="flex-1">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        What is CodeHub?
                    </h2>
                    <p className="text-lg md:text-xl mb-6 leading-relaxed">
                        CodeHub is a student-run organization at the University
                        of Georgia focused on building a vibrant community for
                        aspiring developers, engineers, and tech enthusiasts.
                        Whether you're new to coding or already experienced,
                        you’ll find opportunities to grow, collaborate, and
                        build real-world projects.
                    </p>
                    <ul className="text-base md:text-lg leading-relaxed space-y-4">
                        <li>
                            <strong>Skill Development:</strong> Hands-on
                            workshops, open-source challenges, and curated
                            resources to help you level up.
                        </li>
                        <li>
                            <strong>Community & Collaboration:</strong> Connect
                            with like-minded students, share ideas, and work
                            together on exciting projects.
                        </li>
                        <li>
                            <strong>Impactful Projects:</strong> Build things
                            that matter—enhance your resume while gaining real
                            experience and confidence.
                        </li>
                    </ul>
                </div>

                <div className="relative flex-1 max-w-md">
                    <img
                        src="/temp-image.jpg"
                        alt="CodeHub Team"
                        className="rounded-xl shadow-lg w-full object-cover aspect-video"
                    />
                </div>
            </div>
        </section>
    );
}

function RecentProjects({ projects }) {
    return (
        <section id="projects" className="py-16 px-6">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
                    Latest Projects
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {projects.map((p) => (
                        <div
                            key={p.id}
                            className="rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
                        >
                            {p.imageUrl ? (
                                <img
                                    src={p.imageUrl}
                                    alt={`${p.title} preview`}
                                    className="h-48 w-full object-cover"
                                />
                            ) : (
                                <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                                    No Image
                                </div>
                            )}
                            <div className="p-5">
                                <h3 className="text-lg font-semibold text-gray-800 truncate mb-1">
                                    {p.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                    {p.description}
                                </p>
                                <p className="text-xs text-gray-500 mb-3">
                                    {p.semester} {p.year}
                                </p>
                                <Link
                                    href={`/projects/${p.title
                                        .toLowerCase()
                                        .replaceAll(" ", "-")}`}
                                    className="inline-block text-indigo-600 text-sm font-medium hover:underline"
                                >
                                    View Project →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Link
                        href="/projects"
                        className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-indigo-700 transition"
                    >
                        Browse All Projects
                    </Link>
                </div>
            </div>
        </section>
    );
}

function Templates({ templates }) {
    return (
        <section id="templates" className="py-16 px-6">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
                    Starter Code Templates
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {templates.slice(0, 6).map((t) => (
                        <div
                            key={t.id}
                            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5"
                        >
                            <h3 className="text-lg font-semibold text-gray-800 truncate mb-1">
                                {t.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {t.description}
                            </p>
                            <p className="text-xs text-gray-500 mb-3">
                                Category: {t.category}
                            </p>
                            <a
                                href={t.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block text-indigo-600 text-sm font-medium hover:underline"
                            >
                                GitHub Repo →
                            </a>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Link
                        href="/templates"
                        className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-indigo-700 transition"
                    >
                        See All Templates
                    </Link>
                </div>
            </div>
        </section>
    );
}

function FAQs({ faqs }) {
    return (
        <section id="faqs" className="w-full p-4">
            <div className="py-32 w-full flex justify-center bg-gradient-to-br from-indigo-700 via-blue-600 to-blue-400 p-16 text-white rounded-2xl shadow-lg">
                <div className="max-w-4xl w-full bg-white rounded-2xl p-10 sm:p-12 md:p-16 shadow-lg">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
                        FAQs
                    </h2>
                    <div className="space-y-6">
                        {faqs.map((faq) => (
                            <details
                                key={faq.id}
                                className="rounded-xl border border-gray-200 p-5 group"
                            >
                                <summary className="font-semibold text-gray-800 cursor-pointer marker:content-none flex justify-between items-center">
                                    {faq.question}
                                    <span className="text-blue-500 group-open:rotate-180 transition-transform">
                                        ▼
                                    </span>
                                </summary>
                                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </details>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <Link
                            href="/faqs"
                            className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-blue-600 transition"
                        >
                            More FAQs
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

function CTA() {
    return (
        <section className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 py-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
                    Ready to Build Something Awesome?
                </h2>
                <p className="text-lg md:text-xl mb-8">
                    Whether you're a beginner or a seasoned developer, CodeHub
                    is your space to grow, build, and shine. Join our community
                    or check out past projects to get inspired.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        href="https://discord.gg/bkmC9NYMaN"
                        target="_blank"
                        className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full  hover:scale-105 transition"
                    >
                        Join the Discord
                    </Link>
                    <Link
                        href="/projects"
                        className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-full hover:scale-105 transition"
                    >
                        Browse Projects
                    </Link>
                </div>
            </div>
        </section>
    );
}
