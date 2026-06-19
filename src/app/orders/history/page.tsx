"use client";

import { useMemo, useState } from "react";
import { getLocalTimeZone } from "@internationalized/date";
import { ChevronDown, Download01, Package, SearchMd } from "@untitledui/icons";
import { Button as AriaButton } from "react-aria-components";
import type { DateValue } from "react-aria-components";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Input } from "@/components/base/input/input";
import { DateRangePicker } from "@/components/application/date-picker/date-range-picker";
import { Table, TableCard } from "@/components/application/table/table";
import { TablePagination, useTablePagination } from "@/components/application/table/table-pagination";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { cx } from "@/utils/cx";

type Status = "delivered" | "returned" | "cancelled" | "failed";
type OrderType = "normal" | "express" | "bulk";

type HistoryOrder = {
    id: string;
    ref: string;
    customer: string;
    phone: string;
    date: string;
    pickupTime: string;
    city: string;
    type: OrderType;
    boxes: number;
    status: Status;
};

const STATUS_BADGE: Record<Status, { label: string; color: "success" | "warning" | "gray" | "error" }> = {
    delivered: { label: "Delivered", color: "success" },
    returned: { label: "Returned", color: "warning" },
    cancelled: { label: "Cancelled", color: "gray" },
    failed: { label: "Failed", color: "error" },
};

const TYPE_LABEL: Record<OrderType, string> = {
    normal: "Normal",
    express: "Express",
    bulk: "Bulk",
};

const history: HistoryOrder[] = [
    { id: "1", ref: "h1", customer: "Mike Test", phone: "+971 52 977 5991", date: "Jun 9, 2026", pickupTime: "4:23:22 PM", city: "Dubai", type: "normal", boxes: 2, status: "delivered" },
    { id: "12", ref: "rf-118", customer: "Layla Hassan", phone: "+971 52 311 8870", date: "Jun 8, 2026", pickupTime: "11:05:00 AM", city: "Dubai", type: "express", boxes: 1, status: "delivered" },
    { id: "11", ref: "rf-117", customer: "Omar Idris", phone: "+971 55 442 9123", date: "Jun 7, 2026", pickupTime: "2:40:10 PM", city: "Sharjah", type: "bulk", boxes: 3, status: "returned" },
    { id: "9", ref: "rf-090", customer: "Sara Mansoor", phone: "+971 54 778 1130", date: "Jun 6, 2026", pickupTime: "9:15:45 AM", city: "Abu Dhabi", type: "normal", boxes: 1, status: "cancelled" },
    { id: "8", ref: "rf-088", customer: "Karim Nabil", phone: "+971 50 220 4471", date: "Jun 5, 2026", pickupTime: "6:50:00 PM", city: "Ajman", type: "bulk", boxes: 2, status: "failed" },
    { id: "6", ref: "h0", customer: "Mike Test", phone: "+971 52 977 5990", date: "Jun 4, 2026", pickupTime: "10:30:00 AM", city: "Dubai", type: "express", boxes: 1, status: "delivered" },
];

const chartColors = [
    "var(--color-fg-brand-primary)",
    "var(--color-fg-success-primary)",
    "var(--color-fg-warning-primary)",
    "var(--color-utility-blue-600)",
    "var(--color-utility-purple-600)",
];

const getDistribution = <T extends string>(items: HistoryOrder[], key: keyof Pick<HistoryOrder, "city" | "type">, labelMap?: Record<T, string>) => {
    const counts = new Map<string, number>();
    items.forEach((item) => counts.set(String(item[key]), (counts.get(String(item[key])) || 0) + 1));

    return [...counts.entries()].map(([id, count], index) => ({
        id,
        name: labelMap?.[id as T] || id,
        count,
        color: chartColors[index % chartColors.length],
    }));
};

const FilterMenu = ({
    label,
    selectedKey,
    options,
    onChange,
    className,
}: {
    label: string;
    selectedKey: string;
    options: { id: string; label: string }[];
    onChange: (key: string) => void;
    className?: string;
}) => {
    const selectedLabel = options.find((option) => option.id === selectedKey)?.label || label;

    return (
        <Dropdown.Root>
            <AriaButton
                className={({ isPressed, isFocusVisible }) =>
                    cx(
                        "inline-flex h-11 min-w-36 items-center justify-between gap-2 border border-primary bg-primary px-3.5 py-2 text-sm font-semibold text-secondary shadow-skeuomorphic outline-brand transition duration-100 ease-linear hover:bg-primary_hover hover:text-secondary_hover",
                        isPressed && "bg-primary_hover text-secondary_hover",
                        isFocusVisible && "z-10 outline-2 outline-offset-2",
                        className,
                    )
                }
            >
                {selectedLabel}
                <ChevronDown className="size-5 shrink-0 text-fg-quaternary" />
            </AriaButton>

            <Dropdown.Popover className="w-48">
                <Dropdown.Menu>
                    <Dropdown.Section
                        selectionMode="single"
                        selectedKeys={[selectedKey]}
                        onSelectionChange={(keys) => {
                            const next = typeof keys === "string" ? keys : (keys.keys().toArray()[0] as string);
                            onChange(next);
                        }}
                    >
                        {options.map((option) => (
                            <Dropdown.Item key={option.id} id={option.id}>
                                {option.label}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Section>
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown.Root>
    );
};

const OrderHistoryInsights = ({ cityData, typeData }: { cityData: ReturnType<typeof getDistribution>; typeData: ReturnType<typeof getDistribution> }) => {
    const maxCityCount = Math.max(...cityData.map((entry) => entry.count), 1);
    const totalTypeCount = typeData.reduce((sum, entry) => sum + entry.count, 0);
    let offset = 0;
    const typeGradient =
        totalTypeCount === 0
            ? "var(--color-bg-secondary_subtle) 0 100%"
            : typeData
                  .map((entry) => {
                      const start = offset;
                      const end = offset + (entry.count / totalTypeCount) * 100;
                      offset = end;
                      return `${entry.color} ${start}% ${end}%`;
                  })
                  .join(", ");

    return (
        <div className="grid gap-4 lg:grid-cols-2">
            <section className="flex flex-col gap-4 rounded-2xl border border-secondary bg-primary p-5 shadow-xs">
                <div className="flex flex-col gap-1">
                    <h2 className="text-sm font-semibold text-primary">Orders by city</h2>
                    <p className="text-xs text-tertiary">Where completed order activity is concentrated.</p>
                </div>
                <div className="flex flex-col gap-3 pt-2">
                    {cityData.length === 0 ? (
                        <p className="text-sm text-tertiary">No city data for the selected filters.</p>
                    ) : (
                        cityData.map((entry) => (
                            <div key={entry.id} className="grid grid-cols-[5.5rem_minmax(0,1fr)_2rem] items-center gap-3">
                                <span className="truncate text-xs font-medium text-secondary">{entry.name}</span>
                                <div className="h-2.5 overflow-hidden rounded-full bg-secondary_subtle">
                                    <div
                                        className="h-full rounded-full"
                                        style={{ width: `${(entry.count / maxCityCount) * 100}%`, backgroundColor: entry.color }}
                                    />
                                </div>
                                <span className="text-right text-xs font-semibold text-primary">{entry.count}</span>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <section className="flex flex-col gap-4 rounded-2xl border border-secondary bg-primary p-5 shadow-xs">
                <div className="flex flex-col gap-1">
                    <h2 className="text-sm font-semibold text-primary">Orders by type</h2>
                    <p className="text-xs text-tertiary">Mix of normal, express, and bulk orders.</p>
                </div>
                <div className="grid gap-4 pt-2 md:grid-cols-[11rem_minmax(0,1fr)] md:items-center">
                    <div
                        className="relative mx-auto flex size-36 items-center justify-center rounded-full"
                        style={{ background: `conic-gradient(${typeGradient})` }}
                        aria-label={`${totalTypeCount} orders by type`}
                    >
                        <div className="flex size-22 flex-col items-center justify-center rounded-full bg-primary shadow-xs ring-1 ring-secondary ring-inset">
                            <span className="text-display-xs font-semibold text-primary">{totalTypeCount}</span>
                            <span className="text-xs text-tertiary">orders</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        {typeData.length === 0 ? (
                            <p className="text-sm text-tertiary">No type data for the selected filters.</p>
                        ) : (
                            typeData.map((entry) => (
                                <div key={entry.id} className="flex items-center justify-between gap-6 text-sm">
                                    <span className="flex items-center gap-2 text-secondary">
                                        <span className="size-2 rounded-full" style={{ backgroundColor: entry.color }} aria-hidden="true" />
                                        {entry.name}
                                    </span>
                                    <span className="font-semibold text-primary">{entry.count}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default function OrderHistoryPage() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<string>("all");
    const [city, setCity] = useState<string>("all");
    const [type, setType] = useState<string>("all");
    const [dateRange, setDateRange] = useState<{ start: DateValue; end: DateValue } | null>(null);

    const cityOptions = useMemo(
        () => [
            { id: "all", label: "All cities" },
            ...Array.from(new Set(history.map((order) => order.city))).map((city) => ({ id: city, label: city })),
        ],
        [],
    );
    const typeOptions = useMemo(
        () => [
            { id: "all", label: "All types" },
            ...Object.entries(TYPE_LABEL).map(([id, label]) => ({ id, label })),
        ],
        [],
    );
    const statusOptions = [
        { id: "all", label: "Show all" },
        { id: "delivered", label: "Delivered" },
        { id: "returned", label: "Returned" },
        { id: "cancelled", label: "Cancelled" },
        { id: "failed", label: "Failed" },
    ];

    const filtered = useMemo(() => {
        return history.filter((o) => {
            if (status !== "all" && o.status !== status) return false;
            if (city !== "all" && o.city !== city) return false;
            if (type !== "all" && o.type !== type) return false;
            if (dateRange) {
                const orderDate = new Date(o.date);
                const startDate = dateRange.start.toDate(getLocalTimeZone());
                const endDate = dateRange.end.toDate(getLocalTimeZone());
                const normalizedOrderDate = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
                const normalizedStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                const normalizedEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
                if (normalizedOrderDate < normalizedStartDate || normalizedOrderDate > normalizedEndDate) return false;
            }
            if (!search.trim()) return true;
            const q = search.toLowerCase();
            return (
                o.id.toLowerCase().includes(q) ||
                o.ref.toLowerCase().includes(q) ||
                o.customer.toLowerCase().includes(q) ||
                o.city.toLowerCase().includes(q) ||
                TYPE_LABEL[o.type].toLowerCase().includes(q)
            );
        });
    }, [city, dateRange, search, status, type]);
    const cityData = useMemo(() => getDistribution(filtered, "city"), [filtered]);
    const typeData = useMemo(() => getDistribution<OrderType>(filtered, "type", TYPE_LABEL), [filtered]);
    const pagination = useTablePagination(filtered);

    return (
        <div className="flex flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
            <div className="flex flex-col gap-3">
                <header className="flex flex-col gap-1">
                    <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">Order history</h1>
                    <p className="text-md text-tertiary">A complete record of every order that has left the pipeline.</p>
                </header>
            </div>

            <TableCard.Root>
                <div className="flex flex-col gap-3 border-b border-secondary px-5 py-4 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0 flex-1 md:max-w-sm">
                        <Input
                            size="md"
                            placeholder="Search by reference ID or order ID"
                            icon={SearchMd}
                            value={search}
                            onChange={setSearch}
                        />
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="inline-flex w-full flex-col rounded-lg shadow-xs sm:w-auto sm:flex-row sm:-space-x-px">
                            <DateRangePicker
                                value={dateRange}
                                onChange={(value) => setDateRange(value as { start: DateValue; end: DateValue } | null)}
                                size="md"
                                buttonClassName="sm:rounded-r-none"
                            />

                            <FilterMenu selectedKey={status} options={statusOptions} onChange={setStatus} label="Show all" className="sm:rounded-none" />
                            <FilterMenu selectedKey={city} options={cityOptions} onChange={setCity} label="All cities" className="sm:rounded-none" />
                            <FilterMenu selectedKey={type} options={typeOptions} onChange={setType} label="All types" className="sm:rounded-none" />

                            <Button color="secondary" size="md" iconLeading={Download01} className="sm:rounded-l-none">
                                Export to Excel
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="border-b border-secondary px-5 py-4">
                    <OrderHistoryInsights cityData={cityData} typeData={typeData} />
                </div>

                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                        <FeaturedIcon icon={Package} color="gray" theme="modern" size="lg" />
                        <div className="flex flex-col gap-1">
                            <p className="text-md font-semibold text-primary">No orders found</p>
                            <p className="max-w-sm text-sm text-tertiary">Try a different search term or status filter.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <Table aria-label="Order history">
                            <Table.Header>
                                <Table.Head id="order" isRowHeader label="Order ID" />
                                <Table.Head id="ref" label="Reference No" />
                                <Table.Head id="customer" label="Customer Name" />
                                <Table.Head id="phone" label="Phone #" />
                                <Table.Head id="city" label="City" />
                                <Table.Head id="type" label="Type" />
                                <Table.Head id="date" label="Date" />
                                <Table.Head id="pickup" label="Pickup Time" />
                                <Table.Head id="boxes" label="No. of Boxes" />
                                <Table.Head id="status" label="Status" />
                            </Table.Header>
                            <Table.Body items={pagination.paginatedItems}>
                                {(order) => (
                                    <Table.Row id={order.id}>
                                        <Table.Cell>
                                            <Button color="link-color" size="sm" href={`/orders?order=${order.id}`}>
                                                #{order.id}
                                            </Button>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span className="text-sm text-secondary">{order.ref}</span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span className="text-sm font-medium text-primary">{order.customer}</span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span className="text-sm text-secondary">{order.phone}</span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span className="text-sm text-secondary">{order.city}</span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Badge color="gray" type="modern" size="sm">
                                                {TYPE_LABEL[order.type]}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span className="text-sm text-secondary">{order.date}</span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span className="text-sm text-secondary">{order.pickupTime}</span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span className="text-sm tabular-nums text-secondary">{order.boxes}</span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Badge color={STATUS_BADGE[order.status].color} type="pill-color" size="sm">
                                                {STATUS_BADGE[order.status].label}
                                            </Badge>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                        <TablePagination totalItems={filtered.length} page={pagination.page} onPageChange={pagination.setPage} />
                    </>
                )}
            </TableCard.Root>
        </div>
    );
}
