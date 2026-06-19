import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cx } from "@/utils/cx";

const alertVariants = cva(
    "group/alert relative grid w-full gap-0.5 rounded-xl border px-4 py-3 text-left text-sm shadow-xs has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-4 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-3 *:[svg]:row-span-2 *:[svg]:mt-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-5",
    {
        variants: {
            variant: {
                default: "border-secondary bg-primary text-secondary *:[svg]:text-fg-quaternary",
                brand: "border-brand_alt bg-primary text-secondary *:[svg]:text-fg-brand-primary",
                success: "border-success_subtle bg-success-secondary text-secondary *:[svg]:text-fg-success-primary",
                warning: "border-warning_subtle bg-warning-secondary text-secondary *:[svg]:text-fg-warning-primary",
                error: "border-error_subtle bg-error-secondary text-secondary *:[svg]:text-fg-error-primary",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

function Alert({
    className,
    variant,
    ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
    return (
        <div
            data-slot="alert"
            role="alert"
            className={cx(alertVariants({ variant }), className)}
            {...props}
        />
    );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-title"
            className={cx(
                "text-sm font-semibold text-primary group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-secondary_hover",
                className,
            )}
            {...props}
        />
    );
}

function AlertDescription({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-description"
            className={cx(
                "text-sm text-tertiary group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-secondary_hover [&_p:not(:last-child)]:mb-3",
                className,
            )}
            {...props}
        />
    );
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-action"
            className={cx("mt-2 flex items-center gap-2 group-has-[>svg]/alert:col-start-2", className)}
            {...props}
        />
    );
}

export { Alert, AlertTitle, AlertDescription, AlertAction };
