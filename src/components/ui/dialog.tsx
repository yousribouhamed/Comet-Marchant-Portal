"use client";

import type { ComponentProps, ReactNode } from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cx } from "@/utils/cx";

export const Dialog = BaseDialog.Root;
export const DialogTrigger = BaseDialog.Trigger;
export const DialogClose = BaseDialog.Close;

export const DialogPopup = ({
    className,
    children,
    portalProps,
    ...props
}: ComponentProps<typeof BaseDialog.Popup> & { portalProps?: ComponentProps<typeof BaseDialog.Portal> }) => (
    <BaseDialog.Portal {...portalProps}>
        <BaseDialog.Backdrop className="fixed inset-0 z-50 bg-overlay/70 backdrop-blur-xs transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <BaseDialog.Popup
            {...props}
            className={cx(
                "fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-primary shadow-xl ring-1 ring-secondary",
                "transition-all duration-150 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
                className,
            )}
        >
            {children}
        </BaseDialog.Popup>
    </BaseDialog.Portal>
);

export const DialogHeader = ({ className, ...props }: ComponentProps<"div">) => (
    <div {...props} className={cx("flex flex-col gap-1.5 border-b border-secondary px-6 py-5", className)} />
);

export const DialogTitle = ({ className, ...props }: ComponentProps<typeof BaseDialog.Title>) => (
    <BaseDialog.Title {...props} className={cx("text-lg font-semibold text-primary", className)} />
);

export const DialogDescription = ({ className, ...props }: ComponentProps<typeof BaseDialog.Description>) => (
    <BaseDialog.Description {...props} className={cx("text-sm text-tertiary", className)} />
);

export const DialogPanel = ({ className, ...props }: ComponentProps<"div">) => (
    <div {...props} className={cx("min-h-0 overflow-y-auto px-6 py-5", className)} />
);

export const DialogFooter = ({ className, variant, ...props }: ComponentProps<"div"> & { variant?: "bare" | "default"; children?: ReactNode }) => (
    <div
        {...props}
        className={cx(
            "flex flex-col-reverse gap-2 px-6 py-4 sm:flex-row sm:justify-end",
            variant !== "bare" && "border-t border-secondary bg-secondary",
            className,
        )}
    />
);
