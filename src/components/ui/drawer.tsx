"use client";

import type { ComponentProps } from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cx } from "@/utils/cx";

export const Drawer = BaseDialog.Root;
export const DrawerTrigger = BaseDialog.Trigger;
export const DrawerClose = BaseDialog.Close;

type Side = "right" | "left";

const sideStyles: Record<Side, string> = {
    right: "inset-y-0 right-0 data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full",
    left: "inset-y-0 left-0 data-[ending-style]:-translate-x-full data-[starting-style]:-translate-x-full",
};

export const DrawerPopup = ({
    className,
    children,
    side = "right",
    portalProps,
    ...props
}: ComponentProps<typeof BaseDialog.Popup> & {
    side?: Side;
    portalProps?: ComponentProps<typeof BaseDialog.Portal>;
}) => (
    <BaseDialog.Portal {...portalProps}>
        <BaseDialog.Backdrop className="fixed inset-0 z-50 bg-overlay/70 backdrop-blur-xs transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <BaseDialog.Popup
            {...props}
            className={cx(
                "fixed z-50 flex h-full w-full max-w-md flex-col bg-primary shadow-2xl outline-hidden",
                "transition-transform duration-200 ease-out",
                sideStyles[side],
                className,
            )}
        >
            {children}
        </BaseDialog.Popup>
    </BaseDialog.Portal>
);

export const DrawerHeader = ({ className, ...props }: ComponentProps<"div">) => (
    <div {...props} className={cx("flex flex-col gap-1.5 border-b border-secondary px-6 py-5", className)} />
);

export const DrawerTitle = ({ className, ...props }: ComponentProps<typeof BaseDialog.Title>) => (
    <BaseDialog.Title {...props} className={cx("text-lg font-semibold text-primary", className)} />
);

export const DrawerDescription = ({
    className,
    ...props
}: ComponentProps<typeof BaseDialog.Description>) => (
    <BaseDialog.Description {...props} className={cx("text-sm text-tertiary", className)} />
);

export const DrawerPanel = ({ className, ...props }: ComponentProps<"div">) => (
    <div {...props} className={cx("flex-1 overflow-y-auto p-6", className)} />
);

export const DrawerFooter = ({ className, ...props }: ComponentProps<"div">) => (
    <div
        {...props}
        className={cx(
            "flex flex-col-reverse gap-2 border-t border-secondary px-6 py-4 sm:flex-row sm:justify-end",
            className,
        )}
    />
);
