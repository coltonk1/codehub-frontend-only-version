import Link from "next/link";
import DashboardLink from "./AdminCheck";

export default function Main() {
    return (
        <header className="bg-blue-500 shadow-sm sticky top-0 z-100">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link
                    href="/"
                    className="text-xl font-bold text-white hover:text-black transition"
                >
                    CodeHub
                </Link>
                <nav className="space-x-2 text-sm font-medium text-white">
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
                    <DashboardLink />
                </nav>
            </div>
        </header>
    );
}
