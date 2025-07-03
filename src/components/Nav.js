"use client";
import { useState } from "react";
import Link from "next/link";
import DashboardLink from "./AdminCheck";
import { Menu, X } from "lucide-react";

export default function Main() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="bg-blue-500 shadow-sm sticky top-0 z-[100]">
            <div className="max-w-6xl mx-auto px-4 py-4 md:py-2 flex items-center justify-between">
                <Link
                    href="/"
                    className="text-xl font-bold text-white hover:text-black transition"
                >
                    CodeHub
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex space-x-2 text-sm font-medium text-white">
                    <Link href="/projects" className="hover:text-black p-4">
                        Projects
                    </Link>
                    <Link href="/templates" className="hover:text-black p-4">
                        Templates
                    </Link>
                    <Link href="/faqs" className="hover:text-black p-4">
                        FAQs
                    </Link>
                    <Link href="/forms" className="hover:text-black p-4">
                        Forms
                    </Link>
                    <div className="[&>a]:p-4 w-full">
                        <DashboardLink />
                    </div>
                </nav>

                {/* Hamburger Icon for Mobile */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden text-white"
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-blue-500 border-t-white border-t-2 text-white text-sm font-medium flex flex-col px-4 pb-4 space-y-4">
                    <Link
                        href="/projects"
                        onClick={closeMenu}
                        className="hover:text-black py-2 mt-2"
                    >
                        Projects
                    </Link>
                    <Link
                        href="/templates"
                        onClick={closeMenu}
                        className="hover:text-black py-2"
                    >
                        Templates
                    </Link>
                    <Link
                        href="/faqs"
                        onClick={closeMenu}
                        className="hover:text-black py-2"
                    >
                        FAQs
                    </Link>
                    <Link
                        href="/forms"
                        onClick={closeMenu}
                        className="hover:text-black py-2"
                    >
                        Forms
                    </Link>
                    <div
                        onClick={closeMenu}
                        className="w-full [&>a]:py-2 relative"
                    >
                        <DashboardLink />
                    </div>
                </div>
            )}
        </header>
    );
}
