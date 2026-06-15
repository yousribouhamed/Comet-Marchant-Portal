"use client";

import type { HTMLAttributes } from "react";
import { cx } from "@/utils/cx";

export const UntitledLogo = (props: HTMLAttributes<HTMLOrSVGElement>) => {
    return (
        <img
            src="/brand/comet-logo.svg"
            alt="Comet"
            className={cx("h-8 w-auto select-none", props.className)}
        />
    );
};
