"use client";

import { cx } from "@/utils/cx";
import type { NavItemDividerType, NavItemType } from "../config";
import { NavItemBase } from "./nav-item";

interface NavListProps {
    /** URL of the currently active item. */
    activeUrl?: string;
    /** Additional CSS classes to apply to the list. */
    className?: string;
    /** List of items to display. */
    items: (NavItemType | NavItemDividerType)[];
}

const isRouteActive = (href?: string, activeUrl?: string) => {
    if (!href || !activeUrl) return false;
    if (href === activeUrl) return true;
    if (href !== "/" && activeUrl.startsWith(`${href}/`)) return true;
    return false;
};

export const NavList = ({ activeUrl, items, className }: NavListProps) => {
    return (
        <ul className={cx("flex flex-col px-4 pt-5", className)}>
            {items.map((item, index) => {
                if (item.divider) {
                    return (
                        <li key={index} className="w-full px-0.5 py-2">
                            <hr className="h-px w-full border-none bg-border-secondary" />
                        </li>
                    );
                }

                const isCurrent = isRouteActive(item.href, activeUrl) || item.items?.some((subItem) => isRouteActive(subItem.href, activeUrl));

                if (item.items?.length) {
                    return (
                        <details
                            key={item.label}
                            open={isCurrent}
                            className="appearance-none py-0.25"
                        >
                            <NavItemBase href={item.href} badge={item.badge} icon={item.icon} type="collapsible" current={isCurrent}>
                                {item.label}
                            </NavItemBase>

                            <dd>
                                <ul className="pb-1">
                                    {item.items.map((childItem) => (
                                        <li key={childItem.label} className="py-0.25">
                                            <NavItemBase
                                                href={childItem.href}
                                                badge={childItem.badge}
                                                type="collapsible-child"
                                                current={isRouteActive(childItem.href, activeUrl)}
                                            >
                                                {childItem.label}
                                            </NavItemBase>
                                        </li>
                                    ))}
                                </ul>
                            </dd>
                        </details>
                    );
                }

                return (
                    <li key={item.label} className="py-px">
                        <NavItemBase
                            type="link"
                            badge={item.badge}
                            icon={item.icon}
                            href={item.href}
                            current={isCurrent}
                        >
                            {item.label}
                        </NavItemBase>
                    </li>
                );
            })}
        </ul>
    );
};
