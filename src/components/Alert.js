"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";

export default function AlertBar() {
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        const alertRef = ref(db, "siteAlert");

        const unsub = onValue(alertRef, (snap) => {
            const data = snap.val();
            if (!data) return setAlert(null);

            const now = Date.now();
            if (data.expiresAt && now < data.expiresAt) {
                setAlert(data.message);
            } else {
                setAlert(null);
            }
        });

        return () => unsub();
    }, []);

    if (!alert) return null;

    return (
        <div className="w-full bg-blue-900 text-white text-center py-2 px-4 text-sm font-medium border-b-white border-b-2">
            {alert}
        </div>
    );
}
