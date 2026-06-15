"use client";

import type { ComponentProps } from "react";
import { Input as BaseInput } from "@base-ui/react/input";
import { cx } from "@/utils/cx";

type InputSize = "sm" | "default" | "lg";

type InputProps = ComponentProps<typeof BaseInput> & {
    inputSize?: InputSize;
};

const sizes: Record<InputSize, string> = {
    sm: "h-9 px-3 text-sm",
    default: "h-10 px-3 text-sm",
    lg: "h-11 px-3.5 text-md",
};

export const Input = ({ className, inputSize = "default", type, ...props }: InputProps) => (
    <BaseInput
        {...props}
        type={type}
        className={cx(
            "w-full rounded-lg border border-primary bg-primary text-primary shadow-xs outline-focus-ring transition duration-100 ease-linear placeholder:text-placeholder focus-visible:border-brand focus-visible:outline-2 focus-visible:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            sizes[inputSize],
            className,
        )}
    />
);
