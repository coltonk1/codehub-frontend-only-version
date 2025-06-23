import { Suspense } from "react";
import AuthPage from "./AuthPage.client";

export default function Page() {
    return (
        <Suspense fallback={<Temp />}>
            <AuthPage />
        </Suspense>
    );
}

function Temp() {
    return <div>Loading...</div>;
}
