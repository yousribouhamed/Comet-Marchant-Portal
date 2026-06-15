"use client";

import type { HTMLAttributes } from "react";
import { cx } from "@/utils/cx";

export const UntitledLogoMinimal = (props: HTMLAttributes<HTMLOrSVGElement>) => {
    return (
        <img
            src="/brand/comet-mark.svg"
            alt="Comet"
            className={cx("h-8 w-auto select-none", props.className)}
        />
    );
};
