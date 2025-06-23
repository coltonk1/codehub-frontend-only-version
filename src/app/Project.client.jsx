"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Project({ p, delay }) {
    return (
        <motion.div
            key={p.id}
            className="rounded-2xl bg-white shadow-md hover:shadow-xl transition overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: delay }}
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ scale: 1.02 }}
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
        </motion.div>
    );
}
