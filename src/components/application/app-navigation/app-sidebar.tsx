"use client";

import { usePathname } from "next/navigation";
import {
    ChevronDown,
    Coins01,
    File02,
    HomeLine,
    InfoCircle,
    Package,
    Plus,
    Settings01,
    ShoppingCart01,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import type { NavItemType } from "@/components/application/app-navigation/config";
import { SidebarNavigationSimple } from "@/components/application/app-navigation/sidebar-navigation/sidebar-simple";

const navItems: NavItemType[] = [
    { label: "Home", href: "/", icon: HomeLine },
    { label: "Orders", href: "/orders", icon: Package },
    { label: "E-Commerce", href: "/e-commerce", icon: ShoppingCart01 },
    { label: "COD", href: "/cod", icon: Coins01 },
    { label: "Invoices", href: "/invoices", icon: File02 },
    { label: "Configurations", href: "/configurations", icon: Settings01 },
    { label: "About", href: "/about", icon: InfoCircle },
];

const CreateOrderMenu = () => (
    <Dropdown.Root>
        <Button size="md" noTextPadding className="w-full [&_[data-text]]:flex [&_[data-text]]:w-full">
            <span className="flex w-full min-w-0 items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2">
                    <Plus data-icon="leading" className="size-5 shrink-0" />
                    <span className="truncate">Create Order</span>
                </span>
                <ChevronDown data-icon="trailing" className="size-5 shrink-0" />
            </span>
        </Button>
        <Dropdown.Popover className="w-56">
            <Dropdown.Menu>
                <Dropdown.Item href="/orders/new">Order</Dropdown.Item>
                <Dropdown.Item href="/orders/bulk">Bulk Order</Dropdown.Item>
                <Dropdown.Item href="/orders/subscription">Subscription</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown.Popover>
    </Dropdown.Root>
);

export const AppSidebar = () => {
    const pathname = usePathname();
    return (
        <SidebarNavigationSimple
            activeUrl={pathname}
            items={navItems}
            primaryAction={<CreateOrderMenu />}
        />
    );
};
