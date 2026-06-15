"use client";

import type { ComponentProps, ReactNode } from "react";
import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";
import { cx } from "@/utils/cx";

export const AlertDialog = BaseAlertDialog.Root;
export const AlertDialogTrigger = BaseAlertDialog.Trigger;
export const AlertDialogClose = BaseAlertDialog.Close;

export const AlertDialogPopup = ({ className, children, portalProps, ...props }: ComponentProps<typeof BaseAlertDialog.Popup> & { portalProps?: ComponentProps<typeof BaseAlertDialog.Portal> }) => (
    <BaseAlertDialog.Portal {...portalProps}>
        <BaseAlertDialog.Backdrop className="fixed inset-0 z-50 bg-overlay/70 backdrop-blur-xs data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 transition-opacity duration-150" />
        <BaseAlertDialog.Popup
            {...props}
            className={cx(
                "fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-primary p-6 shadow-xl ring-1 ring-secondary",
                "data-[ending-style]:opacity-0 data-[ending-style]:scale-95 data-[starting-style]:opacity-0 data-[starting-style]:scale-95 transition-all duration-150",
                className,
            )}
        >
            {children}
        </BaseAlertDialog.Popup>
    </BaseAlertDialog.Portal>
);

export const AlertDialogHeader = ({ className, ...props }: ComponentProps<"div">) => (
    <div {...props} className={cx("flex flex-col gap-1.5 pb-4", className)} />
);

export const AlertDialogTitle = ({ className, ...props }: ComponentProps<typeof BaseAlertDialog.Title>) => (
    <BaseAlertDialog.Title {...props} className={cx("text-lg font-semibold text-primary", className)} />
);

export const AlertDialogDescription = ({ className, ...props }: ComponentProps<typeof BaseAlertDialog.Description>) => (
    <BaseAlertDialog.Description {...props} className={cx("text-sm text-tertiary", className)} />
);

export const AlertDialogFooter = ({ className, variant, ...props }: ComponentProps<"div"> & { variant?: "bare" | "default"; children?: ReactNode }) => (
    <div
        {...props}
        className={cx(
            "mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
            variant !== "bare" && "pt-4",
            className,
        )}
    />
);
