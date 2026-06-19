"use client";

import type { FC, ReactNode } from "react";
import { XClose } from "@untitledui/icons";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { cx } from "@/utils/cx";

type NotificationColor = "brand" | "gray" | "success" | "warning" | "error";

interface NotificationProps {
    /** Featured icon shown on the left. */
    icon?: FC<{ className?: string }>;
    /** Color scheme for the featured icon. Defaults to "brand". */
    color?: NotificationColor;
    /** Bold title at the top. */
    title: ReactNode;
    /** Optional description below the title. */
    description?: ReactNode;
    /** Optional inline actions row (rendered after description). */
    actions?: ReactNode;
    /** Called when the user clicks the close button. If omitted, no close button is rendered. */
    onClose?: () => void;
    className?: string;
}

/**
 * Untitled UI-styled inline notification (toast card pattern). White surface,
 * subtle ring + shadow, featured icon, title, optional description and actions.
 */
export const Notification = ({
    icon: Icon,
    color = "brand",
    title,
    description,
    actions,
    onClose,
    className,
}: NotificationProps) => (
    <div
        role="status"
        className={cx(
            "relative flex items-start gap-3 rounded-xl bg-primary p-4 shadow-lg ring-1 ring-secondary",
            className,
        )}
    >
        {Icon && <FeaturedIcon icon={Icon} color={color} theme="light" size="sm" className="shrink-0" />}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-sm font-semibold text-primary">{title}</span>
            {description && <div className="text-sm text-tertiary">{description}</div>}
            {actions && <div className="mt-2 flex items-center gap-3">{actions}</div>}
        </div>
        {onClose && (
            <button
                type="button"
                onClick={onClose}
                aria-label="Dismiss notification"
                className="ml-1 flex size-8 shrink-0 items-center justify-center rounded-md text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-primary_hover hover:text-fg-quaternary_hover focus-visible:outline-2 focus-visible:outline-offset-2"
            >
                <XClose className="size-5" aria-hidden="true" />
            </button>
        )}
    </div>
);
