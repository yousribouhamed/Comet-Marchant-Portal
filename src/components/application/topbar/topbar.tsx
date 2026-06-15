"use client";

import { useState } from "react";
import { Bell01, Check, ChevronDown, Globe01, Package, Settings01, UserPlus01 } from "@untitledui/icons";
import { Button as AriaButton } from "react-aria-components";
import { TopbarBreadcrumbs } from "@/components/application/breadcrumbs/topbar-breadcrumbs";
import { Avatar } from "@/components/base/avatar/avatar";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { cx } from "@/utils/cx";

type Language = "en" | "ar";

const languages: { id: Language; label: string; native: string; dir: "ltr" | "rtl" }[] = [
    { id: "en", label: "English", native: "English", dir: "ltr" },
    { id: "ar", label: "Arabic", native: "العربية", dir: "rtl" },
];

const LanguageSwitcher = () => {
    const [active, setActive] = useState<Language>("en");
    const current = languages.find((l) => l.id === active)!;

    return (
        <Dropdown.Root>
            <AriaButton
                aria-label="Language"
                className="flex h-10 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-secondary outline-focus-ring transition duration-100 ease-linear hover:bg-secondary_subtle focus-visible:outline-2 focus-visible:outline-offset-2"
            >
                <Globe01 className="size-5 text-fg-quaternary" aria-hidden="true" />
                <span className="hidden sm:inline">{current.id.toUpperCase()}</span>
                <ChevronDown className="size-4 text-fg-quaternary" aria-hidden="true" />
            </AriaButton>
            <Dropdown.Popover className="w-56">
                <Dropdown.Menu>
                    {languages.map((lang) => (
                        <Dropdown.Item
                            key={lang.id}
                            onAction={() => setActive(lang.id)}
                            icon={lang.id === active ? Check : undefined}
                        >
                            <span className={cx("flex flex-1 items-center justify-between gap-3", lang.id !== active && "pl-7")}>
                                <span className="text-sm font-medium text-primary">{lang.label}</span>
                                <span className="text-xs text-tertiary" dir={lang.dir}>
                                    {lang.native}
                                </span>
                            </span>
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown.Root>
    );
};

type Notification = {
    id: string;
    title: string;
    description: string;
    time: string;
    unread: boolean;
    icon?: typeof Bell01;
    avatarSrc?: string;
    initials?: string;
};

const sampleNotifications: Notification[] = [
    {
        id: "1",
        title: "Payout request approved",
        description: "Your cash payout of ₿ 2,610.00 has been queued for transfer.",
        time: "2 min ago",
        unread: true,
        icon: Package,
    },
    {
        id: "2",
        title: "Phoenix Baker accepted the invite",
        description: "Phoenix joined your workspace as Manager.",
        time: "1 h ago",
        unread: true,
        avatarSrc: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80",
        initials: "PB",
    },
    {
        id: "3",
        title: "Plan renewed",
        description: "Your Growth subscription has auto-renewed for another month.",
        time: "Yesterday",
        unread: false,
        icon: Settings01,
    },
    {
        id: "4",
        title: "New API request",
        description: "An order was pushed through the Shopify integration.",
        time: "2 d ago",
        unread: false,
        icon: UserPlus01,
    },
];

const NotificationsPopover = () => {
    const [items, setItems] = useState(sampleNotifications);
    const unreadCount = items.filter((n) => n.unread).length;

    const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
    const markOneRead = (id: string) => setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));

    return (
        <Dropdown.Root>
            <AriaButton
                aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
                className="relative flex size-10 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-secondary_subtle hover:text-fg-secondary_hover focus-visible:outline-2 focus-visible:outline-offset-2"
            >
                <Bell01 className="size-5" aria-hidden="true" />
                {unreadCount > 0 && (
                    <span
                        className="absolute top-2 right-2 size-2 rounded-full bg-fg-brand-primary ring-2 ring-primary"
                        aria-hidden="true"
                    />
                )}
            </AriaButton>
            <Dropdown.Popover className="w-96 max-w-[calc(100vw-2rem)] p-0">
                <div className="flex items-center justify-between border-b border-secondary px-4 py-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-primary">Notifications</span>
                        {unreadCount > 0 && (
                            <span className="rounded-full bg-utility-brand-50 px-2 py-0.5 text-xs font-medium text-utility-brand-700">
                                {unreadCount} new
                            </span>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={markAllRead}
                            className="text-xs font-semibold text-brand-secondary hover:text-brand-secondary_hover"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>

                <ul className="max-h-96 divide-y divide-secondary overflow-y-auto">
                    {items.map((n) => (
                        <li key={n.id}>
                            <button
                                type="button"
                                onClick={() => markOneRead(n.id)}
                                className={cx(
                                    "group flex w-full items-start gap-3 px-4 py-3 text-left transition duration-100 ease-linear hover:bg-secondary_subtle",
                                    n.unread && "bg-brand-primary_alt/40",
                                )}
                            >
                                {n.avatarSrc || n.initials ? (
                                    <Avatar src={n.avatarSrc} initials={n.initials} alt={n.title} size="sm" />
                                ) : n.icon ? (
                                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-utility-brand-50 text-utility-brand-700">
                                        <n.icon className="size-4" aria-hidden="true" />
                                    </span>
                                ) : null}

                                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                    <p className="truncate text-sm font-semibold text-primary">{n.title}</p>
                                    <p className="line-clamp-2 text-xs text-tertiary">{n.description}</p>
                                    <span className="text-xs text-quaternary">{n.time}</span>
                                </div>

                                {n.unread && (
                                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-fg-brand-primary" aria-label="Unread" />
                                )}
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="border-t border-secondary px-4 py-3 text-center">
                    <a href="#" className="text-sm font-semibold text-brand-secondary hover:text-brand-secondary_hover">
                        View all notifications
                    </a>
                </div>
            </Dropdown.Popover>
        </Dropdown.Root>
    );
};

export const Topbar = () => (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-secondary bg-primary/95 px-4 backdrop-blur md:px-8">
        <div className="min-w-0 flex-1">
            <TopbarBreadcrumbs />
        </div>
        <div className="flex items-center gap-1.5">
            <LanguageSwitcher />
            <NotificationsPopover />
        </div>
    </header>
);
