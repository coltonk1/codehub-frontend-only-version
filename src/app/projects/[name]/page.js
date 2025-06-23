import { ref, get } from "firebase/database";
import { db } from "@/lib/firebase";
import { notFound } from "next/navigation";

export default async function ProjectPage({ params }) {
    const snapshot = await get(ref(db, "projects"));
    const data = snapshot.val() || {};

    const match = Object.entries(data).find(
        ([_, val]) =>
            val.title.toLowerCase().replaceAll(" ", "-") ===
            params.name.toLowerCase()
    );

    if (!match) return notFound();

    const [id, project] = match;

    return (
        <section className="px-4 pt-12 pb-20 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {project.title}
            </h1>

            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                {project.description}
            </p>

            <div className="w-full aspect-video bg-gray-200 rounded-xl overflow-hidden mb-8">
                {project.imageUrl ? (
                    <img
                        src={project.imageUrl}
                        alt="project image"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                        No Image
                    </div>
                )}
            </div>

            <div className="space-y-2 text-sm text-gray-700">
                {project.github && (
                    <p>
                        <strong>GitHub:</strong>{" "}
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 underline hover:text-indigo-800"
                        >
                            {project.github}
                        </a>
                    </p>
                )}
                {project.live && (
                    <p>
                        <strong>Live Site:</strong>{" "}
                        <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 underline hover:text-indigo-800"
                        >
                            {project.live}
                        </a>
                    </p>
                )}
                <p>
                    <strong>Semester:</strong> {project.semester} {project.year}
                </p>
                <p>
                    <strong>Technologies:</strong>{" "}
                    {project.technologies?.join(", ") || "N/A"}
                </p>
                <p>
                    <strong>Developers:</strong>{" "}
                    {project.developers?.join(", ") || "N/A"}
                </p>
            </div>
        </section>
    );
}
