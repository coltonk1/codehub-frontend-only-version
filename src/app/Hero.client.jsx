"use client";

import Curve from "@/assets/curve";
import { motion } from "framer-motion";
import CTALink from "@/components/CTALink";

export default function Hero() {
    return (
        <section className="text-white text-center p-4">
            <div
                className="pt-50 rounded-md"
                style={{
                    backgroundImage:
                        "linear-gradient(to bottom right, #444A6C 12%, #3A68FF 50%), url(/dot.png), url(/hero-image.webp)",
                    backgroundSize: "cover, 10px, cover",
                    backgroundPosition: "center, center, center",
                    backgroundRepeat: "no-repeat, repeat, no-repeat",
                    backgroundBlendMode: "multiply, overlay, normal",
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
                    className="mt-6"
                >
                    <CTALink href="/projects" variant="white">
                        Explore Projects
                    </CTALink>
                </motion.div>
                <Curve className="w-full mt-25" />
            </div>
        </section>
    );
}
