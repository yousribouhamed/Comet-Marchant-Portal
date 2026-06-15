"use client";

import type { ComponentProps } from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { cx } from "@/utils/cx";

type ButtonVariant = "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
type ButtonSize = "xs" | "sm" | "default" | "lg" | "icon";

type ButtonProps = ComponentProps<typeof BaseButton> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
};

const variants: Record<ButtonVariant, string> = {
    default: "bg-brand-solid text-white shadow-xs ring-1 ring-transparent hover:bg-brand-solid_hover",
    outline: "border border-primary bg-primary text-secondary shadow-xs hover:bg-primary_hover",
    secondary: "bg-secondary text-secondary hover:bg-secondary_hover",
    destructive: "bg-error-solid text-white hover:bg-error-solid_hover",
    ghost: "text-secondary hover:bg-primary_hover",
    link: "h-auto p-0 text-brand-secondary underline-offset-4 hover:text-brand-secondary_hover hover:underline",
};

const sizes: Record<ButtonSize, string> = {
    xs: "h-11 gap-1 rounded-md px-2.5 text-xs",
    sm: "h-11 gap-1 rounded-md px-3 text-sm",
    default: "h-11 gap-1 rounded-md px-3 text-sm",
    lg: "h-11 gap-1 rounded-md px-3 text-sm",
    icon: "size-11 rounded-md p-0",
};

export const Button = ({ className, variant = "default", size = "sm", loading, disabled, children, ...props }: ButtonProps) => (
    <BaseButton
        {...props}
        disabled={disabled || loading}
        className={cx(
            "inline-flex cursor-pointer items-center justify-center whitespace-nowrap font-semibold outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            variants[variant],
            sizes[size],
            className,
        )}
    >
        {children}
    </BaseButton>
);
