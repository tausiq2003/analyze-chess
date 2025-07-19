"use client";

import React from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function GoogleCaptchaWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const recaptchakey: string | undefined =
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;
    return (
        <GoogleReCaptchaProvider reCaptchaKey={recaptchakey ?? "NOT DEFINED"}>
            {children}
        </GoogleReCaptchaProvider>
    );
}
