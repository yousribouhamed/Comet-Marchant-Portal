"use client";

import type { FC } from "react";
import { useState } from "react";
import {
    ArrowDown,
    ArrowRight,
    ArrowUp,
    CheckCircle,
    Coins01,
    CoinsHand,
    File02,
    Package,
    Plus,
    ShoppingCart01,
} from "@untitledui/icons";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Select } from "@/components/base/select/select";
import { Table } from "@/components/application/table/table";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { CurrencyIcon } from "@/components/foundations/currency-icon";
import { cx } from "@/utils/cx";

/* ----------------------------------- data ---------------------------------- */

const orderStatuses = [
    { id: "new", label: "New", count: 3, color: "var(--color-utility-blue-600)", href: "/orders" },
    { id: "upcoming", label: "Upcoming", count: 0, color: "var(--color-utility-purple-600)", href: "/orders" },
    { id: "pickup", label: "Ready to pickup", count: 0, color: "var(--color-utility-orange-600)", href: "/orders" },
    { id: "progress", label: "In progress", count: 0, color: "var(--color-fg-brand-primary)", href: "/orders" },
    { id: "delivered", label: "Delivered", count: 1, color: "var(--color-fg-success-primary)", href: "/orders" },
    { id: "cancelled", label: "Cancelled", count: 0, color: "var(--color-fg-quaternary)", href: "/orders" },
    { id: "failed", label: "Failed", count: 0, color: "var(--color-fg-error-primary)", href: "/orders" },
    { id: "returned", label: "Returned", count: 0, color: "var(--color-utility-pink-600)", href: "/orders" },
];

const totalOrders = orderStatuses.reduce((acc, s) => acc + s.count, 0);

const ordersTrend = [
    { day: "Mon", orders: 2 },
    { day: "Tue", orders: 4 },
    { day: "Wed", orders: 3 },
    { day: "Thu", orders: 6 },
    { day: "Fri", orders: 5 },
    { day: "Sat", orders: 8 },
    { day: "Sun", orders: 4 },
];

const codCollections = [
    { day: "Mon", amount: 320 },
    { day: "Tue", amount: 540 },
    { day: "Wed", amount: 460 },
    { day: "Thu", amount: 900 },
    { day: "Fri", amount: 1240 },
    { day: "Sat", amount: 1700 },
    { day: "Sun", amount: 610 },
];

type RecentOrder = {
    id: string;
    ref: string;
    customer: string;
    amount: number;
    status: { label: string; color: "blue" | "success" | "warning" | "error" | "gray" };
};

const recentOrders: RecentOrder[] = [
    { id: "6", ref: "sdfsdf", customer: "Mike Test", amount: 900, status: { label: "New", color: "blue" } },
    { id: "1", ref: "h1", customer: "Mike Test", amount: 1240, status: { label: "Delivered", color: "success" } },
    { id: "5", ref: "1321", customer: "Mike Test", amount: 460, status: { label: "New", color: "blue" } },
    { id: "2", ref: "h2", customer: "Mike Test", amount: 320, status: { label: "New", color: "blue" } },
];

type Invoice = {
    id: string;
    label: string;
    period: string;
    amount: number;
    dueDate: string;
    status: { label: string; color: "warning" | "success" | "gray" };
};

const invoices: Invoice[] = [
    { id: "INV-2026-07", label: "Growth plan", period: "Jun 12 – Jul 12, 2026", amount: 49, dueDate: "Jul 18, 2026", status: { label: "Upcoming", color: "warning" } },
    { id: "INV-2026-06", label: "Growth plan", period: "May 12 – Jun 12, 2026", amount: 49, dueDate: "Jun 18, 2026", status: { label: "Paid", color: "success" } },
    { id: "INV-2026-05", label: "Add-on · Telephony", period: "May 1 – May 31, 2026", amount: 12, dueDate: "May 31, 2026", status: { label: "Paid", color: "success" } },
];

const nextInvoice = invoices.find((i) => i.status.label === "Upcoming")!;

const formatAmount = (value: number) =>
    value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* --------------------------------- helpers --------------------------------- */

const ChartTooltip = ({ active, payload, label, money }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border border-secondary bg-primary px-3 py-2 shadow-lg">
            <p className="text-xs font-medium text-tertiary">{label}</p>
            <p className="flex items-center gap-1 text-sm font-semibold text-primary">
                {money && <CurrencyIcon className="size-3 self-center" />}
                {money ? formatAmount(payload[0].value) : payload[0].value}
                <span className="font-normal text-tertiary">{money ? "" : " orders"}</span>
            </p>
        </div>
    );
};

const KpiCard = ({
    icon: Icon,
    label,
    value,
    money,
    color,
    trend,
}: {
    icon: FC<{ className?: string }>;
    label: string;
    value: string;
    money?: boolean;
    color: "brand" | "success" | "warning" | "gray";
    trend?: { value: string; direction: "up" | "down" };
}) => (
    <div className="flex flex-col gap-4 rounded-2xl border border-secondary bg-primary p-5 shadow-xs">
        <div className="flex items-start justify-between">
            <FeaturedIcon icon={Icon} color={color} theme="light" size="md" />
            {trend && (
                <Badge color={trend.direction === "up" ? "success" : "error"} type="pill-color" size="sm">
                    {trend.direction === "up" ? (
                        <ArrowUp className="size-3" aria-hidden="true" />
                    ) : (
                        <ArrowDown className="size-3" aria-hidden="true" />
                    )}
                    {trend.value}
                </Badge>
            )}
        </div>
        <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-tertiary">{label}</p>
            <div className="flex items-baseline gap-1.5">
                {money && <CurrencyIcon className="size-5 self-center text-primary" />}
                <span className="text-display-xs font-semibold text-primary">{value}</span>
            </div>
        </div>
    </div>
);

const SectionCard = ({
    icon: Icon,
    title,
    metric,
    sub,
    href,
    color,
}: {
    icon: FC<{ className?: string }>;
    title: string;
    metric: string;
    sub: string;
    href: string;
    color: "brand" | "success" | "warning" | "gray";
}) => (
    <a
        href={href}
        className="group flex flex-col gap-4 rounded-2xl border border-secondary bg-primary p-5 shadow-xs transition duration-100 ease-linear hover:border-brand"
    >
        <div className="flex items-center justify-between">
            <FeaturedIcon icon={Icon} color={color} theme="light" size="md" />
            <span className="text-sm font-semibold text-brand-secondary group-hover:text-brand-secondary_hover">
                View →
            </span>
        </div>
        <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium text-tertiary">{title}</p>
            <p className="text-xl font-semibold text-primary">{metric}</p>
            <p className="text-xs text-tertiary">{sub}</p>
        </div>
    </a>
);

const Card = ({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) => (
    <div className="flex flex-col gap-5 rounded-2xl border border-secondary bg-primary p-5 shadow-xs">
        <div className="flex items-center justify-between gap-3">
            <h2 className="text-md font-semibold text-primary">{title}</h2>
            {action}
        </div>
        {children}
    </div>
);

const SectionHeader = ({
    icon: Icon,
    title,
    description,
    href,
    actionLabel,
    color,
}: {
    icon: FC<{ className?: string }>;
    title: string;
    description: string;
    href: string;
    actionLabel: string;
    color: "brand" | "success" | "warning" | "gray";
}) => (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
            <FeaturedIcon icon={Icon} color={color} theme="light" size="md" />
            <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-primary">{title}</h2>
                <p className="text-sm text-tertiary">{description}</p>
            </div>
        </div>
        <Button color="link-color" size="sm" href={href} iconTrailing={ArrowRight}>
            {actionLabel}
        </Button>
    </div>
);

/* ---------------------------------- screen --------------------------------- */

export const HomeScreen = () => {
    const [range, setRange] = useState("7d");
    const activeStatuses = orderStatuses.filter((s) => s.count > 0);
    const deliveredRate = totalOrders ? Math.round((orderStatuses.find((s) => s.id === "delivered")!.count / totalOrders) * 100) : 0;
    const codTotal = codCollections.reduce((acc, d) => acc + d.amount, 0);

    return (
        <div className="flex flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
            <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">Welcome back, Olivia</h1>
                    <p className="text-md text-tertiary">Here&apos;s what&apos;s happening across your store today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select
                        aria-label="Date range"
                        size="md"
                        items={[
                            { id: "today", label: "Today" },
                            { id: "7d", label: "Last 7 days" },
                            { id: "30d", label: "Last 30 days" },
                            { id: "90d", label: "Last 90 days" },
                        ]}
                        selectedKey={range}
                        onSelectionChange={(k) => setRange(String(k))}
                        className="w-40"
                    >
                        {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                    </Select>
                    <Button size="md" iconLeading={Plus} href="/orders/new">
                        Create order
                    </Button>
                </div>
            </header>

            {/* Hero KPIs */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KpiCard icon={Package} label="Total orders" value={String(totalOrders)} color="brand" trend={{ value: "12.5%", direction: "up" }} />
                <KpiCard icon={Coins01} label="COD collected" value={formatAmount(codTotal)} money color="success" trend={{ value: "8.2%", direction: "up" }} />
                <KpiCard icon={CoinsHand} label="Pending payout" value={formatAmount(3050)} money color="warning" />
                <KpiCard icon={CheckCircle} label="Delivery success" value={`${deliveredRate}%`} color="brand" trend={{ value: "3.1%", direction: "down" }} />
            </div>

            {/* ───────────── ORDERS ───────────── */}
            <section className="flex flex-col gap-4">
                <SectionHeader
                    icon={Package}
                    title="Orders"
                    description="Pipeline activity and pickup → delivery status."
                    href="/orders"
                    actionLabel="View all orders"
                    color="brand"
                />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card
                        title="Orders overview"
                        action={
                            <span className="flex items-center gap-1.5 text-sm text-tertiary">
                                <span className="size-2 rounded-full bg-fg-brand-primary" aria-hidden="true" />
                                Orders per day
                            </span>
                        }
                    >
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={ordersTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--color-fg-brand-primary)" stopOpacity={0.25} />
                                            <stop offset="100%" stopColor="var(--color-fg-brand-primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} stroke="var(--color-border-secondary)" />
                                    <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-fg-quaternary)" }} />
                                    <YAxis tickLine={false} axisLine={false} width={32} tick={{ fontSize: 12, fill: "var(--color-fg-quaternary)" }} allowDecimals={false} />
                                    <Tooltip cursor={{ stroke: "var(--color-border-secondary)" }} content={<ChartTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="orders"
                                        stroke="var(--color-fg-brand-primary)"
                                        strokeWidth={2}
                                        fill="url(#ordersFill)"
                                        dot={{ r: 3, fill: "var(--color-fg-brand-primary)" }}
                                        activeDot={{ r: 5 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Orders by status donut + legend */}
                <Card title="Orders by status">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center lg:flex-col">
                        <div className="relative mx-auto h-32 w-32 shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={activeStatuses}
                                        dataKey="count"
                                        nameKey="label"
                                        innerRadius={44}
                                        outerRadius={62}
                                        paddingAngle={2}
                                        stroke="none"
                                    >
                                        {activeStatuses.map((s) => (
                                            <Cell key={s.id} fill={s.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<ChartTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-semibold text-primary">{totalOrders}</span>
                                <span className="text-xs text-tertiary">Total</span>
                            </div>
                        </div>

                        <ul className="grid w-full grid-cols-2 gap-x-3 gap-y-0.5">
                            {orderStatuses.map((s) => (
                                <li key={s.id}>
                                    <a
                                        href={s.href}
                                        className={cx(
                                            "flex items-center justify-between gap-2 rounded-md px-2 py-1.5 transition duration-100 ease-linear hover:bg-secondary_subtle",
                                            s.count === 0 && "opacity-60",
                                        )}
                                    >
                                        <span className="flex min-w-0 items-center gap-1.5">
                                            <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} aria-hidden="true" />
                                            <span className="truncate text-xs text-secondary">{s.label}</span>
                                        </span>
                                        <span className="text-xs font-semibold text-primary tabular-nums">{s.count}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Card>
            </div>

                <Card
                    title="Recent orders"
                    action={
                        <Button color="link-color" size="sm" href="/orders">
                            View all
                        </Button>
                    }
                >
                    <div className="-mx-5 -mb-5 overflow-x-auto">
                        <Table aria-label="Recent orders">
                            <Table.Header>
                                <Table.Head id="order" isRowHeader label="Order" />
                                <Table.Head id="customer" label="Customer" />
                                <Table.Head id="reference" label="Reference" />
                                <Table.Head id="amount" label="Amount" />
                                <Table.Head id="status" label="Status" />
                            </Table.Header>
                            <Table.Body items={recentOrders}>
                                {(order) => (
                                    <Table.Row id={order.id}>
                                        <Table.Cell>
                                            <Button color="link-color" size="sm" href={`/orders/${order.id}`}>
                                                #{order.id}
                                            </Button>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span className="text-sm font-medium text-primary">{order.customer}</span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span className="text-sm text-tertiary">{order.ref}</span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span className="flex items-baseline gap-1 text-sm font-semibold text-primary">
                                                <CurrencyIcon className="size-3 self-center" />
                                                {formatAmount(order.amount)}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Badge color={order.status.color} type="pill-color" size="sm">
                                                {order.status.label}
                                            </Badge>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    </div>
                </Card>
            </section>

            {/* ───────────── COD ───────────── */}
            <section className="flex flex-col gap-4">
                <SectionHeader
                    icon={Coins01}
                    title="COD"
                    description="Cash-on-delivery collections and merchant payouts."
                    href="/cod"
                    actionLabel="Open COD dashboard"
                    color="success"
                />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card
                        title="COD collections"
                        action={
                            <span className="flex items-baseline gap-1 text-sm">
                                <CurrencyIcon className="size-3 self-center text-tertiary" />
                                <span className="font-semibold text-primary">{formatAmount(codTotal)}</span>
                                <span className="text-tertiary">this week</span>
                            </span>
                        }
                    >
                        <div className="h-56 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={codCollections} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                                    <CartesianGrid vertical={false} stroke="var(--color-border-secondary)" />
                                    <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-fg-quaternary)" }} />
                                    <YAxis tickLine={false} axisLine={false} width={40} tick={{ fontSize: 12, fill: "var(--color-fg-quaternary)" }} />
                                    <Tooltip cursor={{ fill: "var(--color-bg-secondary_subtle)" }} content={<ChartTooltip money />} />
                                    <Bar dataKey="amount" fill="var(--color-fg-brand-primary)" radius={[6, 6, 0, 0]} maxBarSize={36} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-1 flex-col gap-1 rounded-2xl border border-secondary bg-primary p-5 shadow-xs">
                        <span className="text-sm font-medium text-tertiary">Available to payout</span>
                        <span className="flex items-baseline gap-1.5">
                            <CurrencyIcon className="size-5 self-center text-primary" />
                            <span className="text-display-xs font-semibold text-primary">{formatAmount(2610)}</span>
                        </span>
                        <Button color="primary" size="sm" href="/cod" className="mt-3 w-full">
                            Request payout
                        </Button>
                    </div>
                    <div className="flex flex-1 flex-col gap-1 rounded-2xl border border-secondary bg-primary p-5 shadow-xs">
                        <span className="text-sm font-medium text-tertiary">Pending payout</span>
                        <span className="flex items-baseline gap-1.5">
                            <CurrencyIcon className="size-5 self-center text-primary" />
                            <span className="text-display-xs font-semibold text-primary">{formatAmount(3050)}</span>
                        </span>
                        <span className="mt-2 text-xs text-tertiary">Released after 7 days · 1 request in review</span>
                    </div>
                </div>
            </div>
            </section>

            {/* ───────────── INVOICES ───────────── */}
            <section className="flex flex-col gap-4">
                <SectionHeader
                    icon={File02}
                    title="Invoices"
                    description="Upcoming bills and recent billing history."
                    href="/invoices"
                    actionLabel="View all invoices"
                    color="gray"
                />

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Next due card */}
                    <Card title="Next due" action={<Badge color="warning" type="pill-color" size="sm">{nextInvoice.status.label}</Badge>}>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-tertiary">{nextInvoice.label}</span>
                            <span className="flex items-baseline gap-1.5">
                                <CurrencyIcon className="size-5 self-center text-primary" />
                                <span className="text-display-xs font-semibold text-primary">{formatAmount(nextInvoice.amount)}</span>
                            </span>
                            <span className="text-xs text-tertiary">Due {nextInvoice.dueDate} · {nextInvoice.id}</span>
                        </div>
                        <Button color="secondary" size="sm" href="/invoices" className="mt-1 w-full">
                            View invoice
                        </Button>
                    </Card>

                    {/* Recent invoices list */}
                    <div className="lg:col-span-2">
                        <Card
                            title="Recent invoices"
                            action={
                                <Button color="link-color" size="sm" href="/invoices">
                                    View all
                                </Button>
                            }
                        >
                            <ul className="flex flex-col divide-y divide-secondary">
                                {invoices.map((inv) => (
                                    <li key={inv.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                                        <div className="flex min-w-0 flex-col">
                                            <span className="truncate text-sm font-medium text-primary">{inv.label}</span>
                                            <span className="text-xs text-tertiary">
                                                {inv.id} · {inv.period}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="flex items-baseline gap-1 text-sm font-semibold text-primary">
                                                <CurrencyIcon className="size-3 self-center" />
                                                {formatAmount(inv.amount)}
                                            </span>
                                            <Badge color={inv.status.color} type="pill-color" size="sm">
                                                {inv.status.label}
                                            </Badge>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Section shortcuts */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SectionCard icon={Package} title="Orders" metric={`${totalOrders} active`} sub="Across the pipeline" href="/orders" color="brand" />
                <SectionCard icon={ShoppingCart01} title="E-Commerce" metric="4 stores" sub="Shopify, Magento & more" href="/e-commerce" color="success" />
                <SectionCard icon={Coins01} title="COD" metric={`${formatAmount(2610)}`} sub="Available to payout" href="/cod" color="warning" />
                <SectionCard icon={File02} title="Invoices" metric="1 due" sub="Next: 18 Jul 2026" href="/invoices" color="gray" />
            </div>
        </div>
    );
};
