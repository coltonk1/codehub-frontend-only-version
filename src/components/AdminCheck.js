"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, db } from "@/lib/firebase";

export default function DashboardLink() {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdmin = async (user) => {
            if (!user?.email) return;
            const safeEmail = user.email.replaceAll(".", ",");
            const snap = await get(ref(db, `admins/${safeEmail}`));
            setIsAdmin(snap.exists());
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            checkAdmin(user);
        });

        return () => unsubscribe();
    }, []);

    if (!isAdmin) return null;

    return (
        <Link href="/dashboard" className="hover:text-black w-full block">
            Dashboard
        </Link>
    );
}
