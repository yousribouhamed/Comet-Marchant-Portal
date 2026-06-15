"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight } from "@untitledui/icons";
import { Breadcrumb, Breadcrumbs, Link } from "react-aria-components";
import { cx } from "@/utils/cx";

type BreadcrumbItem = {
    label: string;
    href: string;
};

const routeLabels: Record<string, string> = {
    "": "Home",
    about: "About",
    bulk: "Bulk Order",
    cash: "Cash",
    cod: "COD",
    configurations: "Configurations",
    "e-commerce": "E-Commerce",
    invoices: "Invoices",
    new: "New Order",
    orders: "Orders",
    payouts: "Payouts",
    subscription: "Subscription",
};

const formatSegmentLabel = (segment: string) => {
    const decoded = decodeURIComponent(segment);
    return decoded
        .split("-")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
};

const createBreadcrumbItems = (pathname: string): BreadcrumbItem[] => {
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) {
        return [{ label: routeLabels[""], href: "/" }];
    }

    return [
        { label: routeLabels[""], href: "/" },
        ...segments.map((segment, index) => {
            const href = `/${segments.slice(0, index + 1).join("/")}`;
            return {
                label: routeLabels[segment] ?? formatSegmentLabel(segment),
                href,
            };
        }),
    ];
};

export const TopbarBreadcrumbs = () => {
    const pathname = usePathname();
    const items = useMemo(() => createBreadcrumbItems(pathname), [pathname]);

    return (
        <Breadcrumbs aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1">
            {items.map((item, index) => {
                const isCurrent = index === items.length - 1;

                return (
                    <Breadcrumb key={item.href} className="flex min-w-0 items-center gap-1">
                        {index > 0 && <ChevronRight className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />}
                        <Link
                            href={item.href}
                            className={cx(
                                "max-w-40 truncate rounded-xs px-0.5 py-0.5 text-sm font-semibold outline-focus-ring transition duration-100 ease-linear sm:max-w-56",
                                isCurrent
                                    ? "cursor-default text-primary"
                                    : "text-tertiary hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2",
                            )}
                        >
                            {item.label}
                        </Link>
                    </Breadcrumb>
                );
            })}
        </Breadcrumbs>
    );
};
