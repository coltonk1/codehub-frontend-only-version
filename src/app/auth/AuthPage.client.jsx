"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";

export default function AuthPage() {
    const router = useRouter();
    const [mode, setMode] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push("/dashboard");
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleAuth = async () => {
        setError("");
        setLoading(true);

        try {
            if (mode === "signup") {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (err) {
            setError(err.message);
        }

        setLoading(false);
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-16">
            <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    {mode === "login"
                        ? "Login to CodeHub"
                        : "Create an Account"}
                </h1>

                <input
                    className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleAuth}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-full shadow hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading
                        ? "Processing..."
                        : mode === "login"
                        ? "Login"
                        : "Sign Up"}
                </button>

                {error && (
                    <p className="text-red-500 text-sm mt-4 text-center">
                        {error}
                    </p>
                )}

                <p className="mt-6 text-sm text-center text-gray-600">
                    {mode === "login" ? (
                        <>
                            Don't have an account?{" "}
                            <button
                                className="text-blue-600 underline hover:text-blue-800"
                                onClick={() => setMode("signup")}
                            >
                                Sign up
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <button
                                className="text-blue-600 underline hover:text-blue-800"
                                onClick={() => setMode("login")}
                            >
                                Log in
                            </button>
                        </>
                    )}
                </p>
            </div>
        </section>
    );
}
