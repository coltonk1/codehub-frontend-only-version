import Link from "next/link";

export default function CTALink({
    href,
    children,
    variant = "primary",
    target,
}) {
    const base =
        "font-semibold px-6 py-3 rounded-full transition hover:scale-105 block w-fit mx-auto";
    const variants = {
        primary: "bg-blue-600 text-white",
        white: "bg-white text-blue-600",
    };

    return (
        <Link
            href={href}
            target={target}
            className={`${base} ${variants[variant]}`}
        >
            {children}
        </Link>
    );
}
