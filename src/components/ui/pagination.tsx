"use client";

import type { ComponentProps, ReactElement } from "react";
import { ChevronLeft, ChevronRight, DotsHorizontal } from "@untitledui/icons";
import { cx } from "@/utils/cx";

export function Pagination({ className, ...props }: ComponentProps<"nav">): ReactElement {
    return (
        <nav
            aria-label="pagination"
            className={cx("mx-auto flex w-full justify-center", className)}
            data-slot="pagination"
            {...props}
        />
    );
}

export function PaginationContent({ className, ...props }: ComponentProps<"ul">): ReactElement {
    return <ul className={cx("flex flex-row items-center gap-1", className)} data-slot="pagination-content" {...props} />;
}

export function PaginationItem(props: ComponentProps<"li">): ReactElement {
    return <li data-slot="pagination-item" {...props} />;
}

export type PaginationLinkProps = {
    isActive?: boolean;
    isDisabled?: boolean;
    size?: "default" | "icon";
} & ComponentProps<"a">;

export function PaginationLink({
    className,
    isActive,
    isDisabled,
    size = "icon",
    href = "#",
    onClick,
    ...props
}: PaginationLinkProps): ReactElement {
    return (
        <a
            aria-current={isActive ? "page" : undefined}
            aria-disabled={isDisabled || undefined}
            data-active={isActive || undefined}
            data-slot="pagination-link"
            href={isDisabled ? undefined : href}
            onClick={(event) => {
                if (isDisabled) {
                    event.preventDefault();
                    return;
                }
                onClick?.(event);
            }}
            className={cx(
                "inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md text-sm font-semibold outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2",
                size === "icon" ? "w-9 px-0" : "px-3",
                isActive
                    ? "bg-primary_hover text-secondary_hover ring-1 ring-primary ring-inset"
                    : "text-secondary hover:bg-primary_hover hover:text-secondary_hover",
                isDisabled && "pointer-events-none cursor-not-allowed opacity-50",
                className,
            )}
            {...props}
        />
    );
}

export function PaginationPrevious({ className, ...props }: PaginationLinkProps): ReactElement {
    return (
        <PaginationLink
            aria-label="Go to previous page"
            className={cx("max-sm:aspect-square max-sm:p-0", className)}
            size="default"
            {...props}
        >
            <ChevronLeft className="size-4 shrink-0" aria-hidden="true" />
            <span className="max-sm:hidden">Previous</span>
        </PaginationLink>
    );
}

export function PaginationNext({ className, ...props }: PaginationLinkProps): ReactElement {
    return (
        <PaginationLink
            aria-label="Go to next page"
            className={cx("max-sm:aspect-square max-sm:p-0", className)}
            size="default"
            {...props}
        >
            <span className="max-sm:hidden">Next</span>
            <ChevronRight className="size-4 shrink-0" aria-hidden="true" />
        </PaginationLink>
    );
}

export function PaginationEllipsis({ className, ...props }: ComponentProps<"span">): ReactElement {
    return (
        <span
            aria-hidden="true"
            className={cx("flex min-w-7 justify-center text-tertiary", className)}
            data-slot="pagination-ellipsis"
            {...props}
        >
            <DotsHorizontal className="size-5" />
            <span className="sr-only">More pages</span>
        </span>
    );
}
