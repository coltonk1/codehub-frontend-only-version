"use client";

import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "@/lib/firebase";

const semesterOrder = { Spring: 0, Fall: 1 };

export default function ProjectPage() {
    const [projects, setProjects] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const snapshot = await get(ref(db, "projects"));
            const data = snapshot.val() || {};
            const projectList = Object.entries(data).map(([id, val]) => ({
                id,
                ...val,
            }));

            const sorted = projectList.sort((a, b) => {
                const yearDiff = b.year - a.year;
                if (yearDiff !== 0) return yearDiff;
                return semesterOrder[b.semester] - semesterOrder[a.semester];
            });

            setProjects(sorted);
            setSelected(sorted[0]);
        };

        fetchData();
    }, []);

    if (!selected) return null;

    return (
        <section className="py-20 px-4">
            <div className="max-w-5xl mx-auto space-y-16">
                {/* Main Project Section - No Card */}
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        {selected.title}
                    </h1>
                    <p className="text-lg text-gray-700 mb-8 max-w-2xl">
                        {selected.description}
                    </p>

                    <div className="w-full aspect-video bg-gray-100 flex items-center justify-center rounded-xl overflow-hidden mb-8 border border-gray-300">
                        {selected.imageUrl ? (
                            <img
                                src={selected.imageUrl}
                                alt="project image"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-gray-500 text-sm">
                                No Image Available
                            </span>
                        )}
                    </div>

                    <div className="text-sm text-gray-700 space-y-2">
                        <p>
                            <strong>Semester:</strong> {selected.semester}{" "}
                            {selected.year}
                        </p>
                        {selected.technologies?.length > 0 && (
                            <p>
                                <strong>Technologies:</strong>{" "}
                                {selected.technologies.join(", ")}
                            </p>
                        )}
                        {selected.developers?.length > 0 && (
                            <p>
                                <strong>Developers:</strong>{" "}
                                {selected.developers.join(", ")}
                            </p>
                        )}
                        {selected.github && (
                            <p>
                                <strong>GitHub:</strong>{" "}
                                <a
                                    href={selected.github}
                                    target="_blank"
                                    className="text-blue-600 underline hover:text-blue-800"
                                >
                                    {selected.github}
                                </a>
                            </p>
                        )}
                        {selected.live && (
                            <p>
                                <strong>Live Site:</strong>{" "}
                                <a
                                    href={selected.live}
                                    target="_blank"
                                    className="text-blue-600 underline hover:text-blue-800"
                                >
                                    {selected.live}
                                </a>
                            </p>
                        )}
                    </div>
                </div>

                {/* Other Projects Preview */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Other Projects
                    </h2>
                    <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                        {projects.map((proj) => (
                            <button
                                key={proj.id}
                                onClick={() => setSelected(proj)}
                                className={`flex-shrink-0 min-w-[250px] max-w-[300px] bg-white border ${
                                    proj.id === selected.id
                                        ? "border-blue-500"
                                        : "border-gray-200"
                                } rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all text-left`}
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
                                    <div className="text-sm font-semibold text-gray-800 truncate">
                                        {proj.title}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {proj.semester} {proj.year}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
