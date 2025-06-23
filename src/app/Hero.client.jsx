"use client";

import Link from "next/link";
import Curve from "@/assets/curve";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="text-white text-center p-4">
            <div
                className="pt-50 rounded-md"
                style={{
                    backgroundImage: "url(/hero-image.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <motion.h1
                    className="text-4xl md:text-6xl font-extrabold mb-4 text-yellow-400"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    CodeHub
                </motion.h1>

                <motion.p
                    className="text-lg md:text-2xl max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    Build real projects. Learn modern tech. Demo your work every
                    semester.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <Link
                        href="/projects"
                        className="inline-block mt-10 bg-white text-blue-600 font-semibold px-12 py-3 rounded-full hover:scale-105 transition"
                    >
                        Explore Projects
                    </Link>
                </motion.div>

                <Curve className="w-full mt-25" />
            </div>
        </section>
    );
}
