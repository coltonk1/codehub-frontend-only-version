import { getDatabase, ref, get } from "firebase/database";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Hero from "./Hero.client";
import Curve from "@/assets/curve";
import Project from "./Project.client";
import CTALink from "@/components/CTALink";

export const dynamic = "force-dynamic";

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
            <div className="p-4">
                <div
                    style={{
                        backgroundImage:
                            "url(/dot2.png), radial-gradient(ellipse at bottom right, #444A6C 12%, #3A68FF 75%)",
                        backgroundSize: "10px, cover",
                        backgroundPosition: "center, center",
                        backgroundRepeat: "repeat, no-repeat",
                        backgroundBlendMode: "normal, normal",
                    }}
                >
                    <Curve className="w-full mb-25 rotate-180" />
                    <RecentProjects projects={projects} />
                    <Templates templates={templates} />
                    <Curve className="w-full mt-25" />
                </div>
            </div>
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

function About() {
    return (
        <section className="px-4 text-gray-800">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 p-10 ">
                {/* Text Content */}
                <div className="flex-1">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        What is CodeHub?
                    </h2>
                    <p className="text-lg md:text-xl mb-6 leading-relaxed">
                        CodeHub is a student-led tech organization at the
                        University of Georgia that helps students of all
                        experience levels learn to code and build real projects.
                        Through weekly sessions and team-based semester
                        projects, members can join either the Learn Track (for
                        web development or Python) or the Project Track (for
                        building full apps with a team). No prior experience
                        needed, just curiosity and a willingness to build.
                    </p>
                    <ul className="text-base md:text-lg leading-relaxed space-y-4">
                        <li>
                            <strong>Skill Development:</strong> Learn web
                            development or Python from the ground up through
                            beginner-friendly weekly sessions. No experience
                            required.
                        </li>
                        <li>
                            <strong>Community & Collaboration:</strong> Be part
                            of an inclusive student-led tech club where you can
                            meet others, share ideas, and grow together
                            regardless of your major or background.
                        </li>
                        <li>
                            <strong>Project Experience:</strong> Join teams to
                            build creative, semester-long projects that help you
                            practice real coding skills and create
                            portfolio-ready work.
                        </li>
                    </ul>
                </div>

                <div className="relative flex-1 max-w-md">
                    <img
                        src="/temp-image.jpg"
                        alt="What is CodeHub? Image"
                        className="rounded-xl shadow-lg w-full object-cover"
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
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
                    Latest Projects
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {projects.map((p, i) => (
                        <Project p={p} key={i} delay={i * 0.15} />
                    ))}
                </div>
                <div className="text-center mt-12">
                    <CTALink href="/projects">Browse All Projects</CTALink>
                </div>
            </div>
        </section>
    );
}

function Templates({ templates }) {
    return (
        <section id="templates" className="py-16 px-6">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
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
                <div className="mt-12">
                    <CTALink href="/templates">See All Templates</CTALink>
                </div>
            </div>
        </section>
    );
}

function FAQs({ faqs }) {
    return (
        <section id="faqs" className="w-full">
            <div className="max-w-4xl w-full mx-auto p-10 sm:p-12 md:p-16 z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
                    FAQs
                </h2>
                <div className="space-y-6">
                    {faqs.map((faq) => (
                        <div
                            key={faq.id}
                            className="rounded-xl border border-gray-200 p-5 group"
                        >
                            <strong className="font-semibold text-gray-800 marker:content-none flex justify-between items-center">
                                {faq.question}
                            </strong>
                            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-10">
                    <CTALink href="/faqs">More FAQs</CTALink>
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
                <div className="flex flex-col sm:flex-row justify-center gap-4 w-fit mx-auto">
                    <CTALink
                        href="https://discord.gg/bkmC9NYMaN"
                        target="_blank"
                        variant="white"
                    >
                        Join the Discord
                    </CTALink>
                    <CTALink href="/projects">Browse Projects</CTALink>
                </div>
            </div>
        </section>
    );
}
