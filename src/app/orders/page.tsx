"use client";

import { useMemo, useState } from "react";
import { ClockRewind, Columns01, DotsHorizontal, List, Package, Phone, SearchMd } from "@untitledui/icons";
import {
    Button as AriaButton,
    Dialog as AriaDialog,
    DialogTrigger as AriaDialogTrigger,
    Popover as AriaPopover,
} from "react-aria-components";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { Avatar } from "@/components/base/avatar/avatar";
import { Table, TableCard } from "@/components/application/table/table";
import { TablePagination, useTablePagination } from "@/components/application/table/table-pagination";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { cx } from "@/utils/cx";

type Priority = "normal" | "priority";
type Storage = "ambient" | "dry" | "chilled" | "frozen";
type Stage = "new" | "pickup" | "delivery" | "finished";
type Direction = "delivery" | "return";
type Outcome = "delivered" | "returned";

type Order = {
    id: string;
    ref: string;
    customer: string;
    phone: string;
    priority: Priority;
    storage: Storage;
    boxes: { s: number; m: number; l: number };
    stage: Stage;
    direction?: Direction;
    outcome?: Outcome;
    time: string;
    timeLabel: "Pickup" | "ETA" | "Ended" | "Created";
};

const orders: Order[] = [
    { id: "6", ref: "sdfsdf", customer: "Mike Test", phone: "+971 52 977 5990", priority: "normal", storage: "ambient", boxes: { s: 0, m: 0, l: 1 }, stage: "new", time: "12 Jun 2026, 05:00 AM", timeLabel: "Pickup" },
    { id: "5", ref: "1321", customer: "Mike Test", phone: "+971 52 977 5990", priority: "normal", storage: "ambient", boxes: { s: 0, m: 0, l: 1 }, stage: "new", time: "13 Jun 2026, 08:00 PM", timeLabel: "Pickup" },
    { id: "2", ref: "h2", customer: "Mike Test", phone: "+971 52 977 5990", priority: "priority", storage: "dry", boxes: { s: 1, m: 0, l: 0 }, stage: "new", time: "09 Jun 2026, 09:50 AM", timeLabel: "Pickup" },
    { id: "7", ref: "rf-220", customer: "Layla Hassan", phone: "+971 52 311 8870", priority: "normal", storage: "chilled", boxes: { s: 0, m: 2, l: 0 }, stage: "pickup", time: "13 Jun 2026, 11:00 AM", timeLabel: "Pickup" },
    { id: "8", ref: "rf-221", customer: "Omar Idris", phone: "+971 55 442 9123", priority: "priority", storage: "frozen", boxes: { s: 1, m: 0, l: 1 }, stage: "pickup", time: "13 Jun 2026, 02:30 PM", timeLabel: "Pickup" },
    { id: "9", ref: "rf-300", customer: "Sara Mansoor", phone: "+971 54 778 1130", priority: "priority", storage: "ambient", boxes: { s: 0, m: 1, l: 0 }, stage: "delivery", direction: "delivery", time: "13 Jun 2026, 04:10 PM", timeLabel: "ETA" },
    { id: "10", ref: "rf-301", customer: "Karim Nabil", phone: "+971 50 220 4471", priority: "normal", storage: "dry", boxes: { s: 0, m: 0, l: 2 }, stage: "delivery", direction: "return", time: "13 Jun 2026, 05:45 PM", timeLabel: "ETA" },
    { id: "1", ref: "h1", customer: "Mike Test", phone: "+971 52 977 5991", priority: "priority", storage: "dry", boxes: { s: 0, m: 1, l: 1 }, stage: "finished", outcome: "delivered", time: "09 Jun 2026, 02:55 PM", timeLabel: "Ended" },
];

const STORAGE_BADGE: Record<Storage, { label: string; color: "blue" | "gray" | "sky" | "indigo" }> = {
    ambient: { label: "Ambient", color: "blue" },
    dry: { label: "Dry", color: "gray" },
    chilled: { label: "Chilled", color: "sky" },
    frozen: { label: "Frozen", color: "indigo" },
};

const STAGE_META: Record<Stage, { label: string; dot: string; badge: "gray" | "warning" | "brand" | "success" }> = {
    new: { label: "New", dot: "bg-fg-quaternary", badge: "gray" },
    pickup: { label: "Next pickups", dot: "bg-warning-solid", badge: "warning" },
    delivery: { label: "Out for delivery", dot: "bg-fg-brand-primary", badge: "brand" },
    finished: { label: "Finished orders", dot: "bg-success-solid", badge: "success" },
};

const PriorityBadge = ({ priority }: { priority: Priority }) =>
    priority === "priority" ? (
        <Badge color="warning" type="pill-color" size="sm">
            Priority
        </Badge>
    ) : (
        <Badge color="gray" type="modern" size="sm">
            Normal
        </Badge>
    );

const StorageBadge = ({ storage }: { storage: Storage }) => {
    const s = STORAGE_BADGE[storage];
    return (
        <Badge color={s.color} type="pill-color" size="sm">
            {s.label}
        </Badge>
    );
};

const BoxChips = ({ boxes }: { boxes: Order["boxes"] }) => (
    <AriaDialogTrigger>
        <AriaButton
            aria-label="Show box breakdown by size"
            className="flex cursor-pointer items-center gap-1 rounded-md border border-secondary px-1.5 py-0.5 text-xs font-medium text-secondary outline-brand transition duration-100 ease-linear hover:bg-primary_hover focus-visible:outline-2 focus-visible:outline-offset-2 data-pressed:bg-primary_hover"
        >
            <Package className="size-3 shrink-0" aria-hidden="true" />
            <DotsHorizontal className="size-3 shrink-0" aria-hidden="true" />
        </AriaButton>
        <AriaPopover
            placement="bottom"
            offset={6}
            className="data-entering:animate-in data-exiting:animate-out data-entering:fade-in-0 data-exiting:fade-out-0 data-entering:zoom-in-95 data-exiting:zoom-out-95"
        >
            <AriaDialog className="rounded-lg border border-secondary bg-primary p-2 shadow-lg outline-hidden">
                <div className="flex items-center gap-1">
                    {(["s", "m", "l"] as const).map((size) => {
                        const count = boxes[size];
                        return (
                            <span
                                key={size}
                                className={cx(
                                    "flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs font-medium tabular-nums",
                                    count > 0 ? "border-secondary text-secondary" : "border-secondary/60 text-quaternary",
                                )}
                                title={`${size.toUpperCase()} boxes: ${count}`}
                            >
                                <Package className="size-3 shrink-0" aria-hidden="true" />
                                <span className="uppercase">{size}</span>
                                <span>{count}</span>
                            </span>
                        );
                    })}
                </div>
            </AriaDialog>
        </AriaPopover>
    </AriaDialogTrigger>
);

const totalBoxes = (b: Order["boxes"]) => b.s + b.m + b.l;

const OrderCard = ({ order }: { order: Order }) => (
    <div
        role="button"
        tabIndex={0}
        className="group flex w-full cursor-pointer flex-col gap-3 rounded-xl border border-secondary bg-primary p-4 text-left shadow-xs transition duration-100 ease-linear hover:border-brand hover:shadow-md focus:outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand"
    >
        <div className="flex items-center justify-between gap-2">
            <PriorityBadge priority={order.priority} />
            <span className="font-mono text-xs font-medium text-tertiary">#{order.id}</span>
        </div>

        <div className="flex items-center gap-2.5">
            <Avatar
                alt={order.customer}
                initials={order.customer.split(" ").map((n) => n[0]).join("")}
                size="sm"
            />
            <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold text-primary">{order.customer}</span>
                <span className="flex items-center gap-1 text-xs text-tertiary">
                    <Phone className="size-3" aria-hidden="true" />
                    {order.phone}
                </span>
            </div>
        </div>

        <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center justify-between">
                <span className="text-quaternary">Reference</span>
                <span className="font-medium text-secondary">{order.ref}</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-quaternary">{order.timeLabel}</span>
                <span className="font-medium text-secondary">{order.time}</span>
            </div>
        </div>

        <div className="flex items-center justify-between border-t border-secondary pt-3">
            <BoxChips boxes={order.boxes} />
            <StorageBadge storage={order.storage} />
        </div>
    </div>
);

const EmptyColumn = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-secondary px-4 py-10 text-center">
        <FeaturedIcon icon={Package} color="gray" theme="modern" size="md" />
        <p className="text-sm text-tertiary">{message}</p>
    </div>
);

const ColumnHeader = ({ stage, count, children }: { stage: Stage; count: number; children?: React.ReactNode }) => (
    <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
            <span className={cx("size-2.5 rounded-full", STAGE_META[stage].dot)} aria-hidden="true" />
            <h2 className="text-sm font-semibold text-primary">{STAGE_META[stage].label}</h2>
            <Badge color={STAGE_META[stage].badge} type="pill-color" size="sm" className="ml-auto">
                {count}
            </Badge>
        </div>
        {children}
    </div>
);

const BoardView = ({ orders }: { orders: Order[] }) => {
    const [direction, setDirection] = useState<Direction>("delivery");
    const [finishedFilter, setFinishedFilter] = useState<string>("all");

    const newOrders = orders.filter((o) => o.stage === "new");
    const pickupOrders = orders.filter((o) => o.stage === "pickup");
    const deliveryOrders = orders.filter((o) => o.stage === "delivery" && o.direction === direction);
    const finishedOrders = orders.filter(
        (o) => o.stage === "finished" && (finishedFilter === "all" || o.outcome === finishedFilter),
    );

    return (
        <div className="flex gap-5 overflow-x-auto pb-4">
            <section className="flex w-80 shrink-0 flex-col gap-4">
                <ColumnHeader stage="new" count={newOrders.length} />
                <div className="flex flex-col gap-3">
                    {newOrders.length ? newOrders.map((o) => <OrderCard key={o.id} order={o} />) : <EmptyColumn message="No new orders" />}
                </div>
            </section>

            <section className="flex w-80 shrink-0 flex-col gap-4">
                <ColumnHeader stage="pickup" count={pickupOrders.length} />
                <div className="flex flex-col gap-3">
                    {pickupOrders.length ? pickupOrders.map((o) => <OrderCard key={o.id} order={o} />) : <EmptyColumn message="No orders to pick up" />}
                </div>
            </section>

            <section className="flex w-80 shrink-0 flex-col gap-4">
                <ColumnHeader stage="delivery" count={deliveryOrders.length}>
                    <ButtonGroup
                        size="sm"
                        selectedKeys={[direction]}
                        onSelectionChange={(keys) => {
                            const next = [...keys][0];
                            if (next) setDirection(next as Direction);
                        }}
                    >
                        <ButtonGroupItem id="delivery">Out for delivery</ButtonGroupItem>
                        <ButtonGroupItem id="return">Out for return</ButtonGroupItem>
                    </ButtonGroup>
                </ColumnHeader>
                <div className="flex flex-col gap-3">
                    {deliveryOrders.length ? deliveryOrders.map((o) => <OrderCard key={o.id} order={o} />) : <EmptyColumn message="No orders in transit" />}
                </div>
            </section>

            <section className="flex w-80 shrink-0 flex-col gap-4">
                <ColumnHeader stage="finished" count={finishedOrders.length}>
                    <Select
                        aria-label="Outcome"
                        size="sm"
                        items={[
                            { id: "all", label: "All outcomes" },
                            { id: "delivered", label: "Delivered" },
                            { id: "returned", label: "Returned" },
                        ]}
                        selectedKey={finishedFilter}
                        onSelectionChange={(k) => setFinishedFilter(String(k))}
                    >
                        {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                    </Select>
                </ColumnHeader>
                <div className="flex flex-col gap-3">
                    {finishedOrders.length ? finishedOrders.map((o) => <OrderCard key={o.id} order={o} />) : <EmptyColumn message="No finished orders" />}
                </div>
            </section>
        </div>
    );
};

const STATUS_BADGE = (order: Order): { label: string; color: "gray" | "warning" | "brand" | "success" } => {
    if (order.stage === "delivery") {
        return { label: order.direction === "return" ? "Out for return" : "Out for delivery", color: "brand" };
    }
    if (order.stage === "finished") {
        return { label: order.outcome === "returned" ? "Returned" : "Delivered", color: "success" };
    }
    return { label: STAGE_META[order.stage].label.replace(" orders", ""), color: STAGE_META[order.stage].badge };
};

const ListView = ({ orders }: { orders: Order[] }) => {
    const pagination = useTablePagination(orders);

    return (
        <TableCard.Root>
            <Table aria-label="Orders">
                <Table.Header>
                    <Table.Head id="order" isRowHeader label="Order" />
                    <Table.Head id="customer" label="Customer" />
                    <Table.Head id="status" label="Status" />
                    <Table.Head id="boxes" label="Boxes" />
                    <Table.Head id="time" label="Time" />
                    <Table.Head id="actions" label="" className="w-12" />
                </Table.Header>
                <Table.Body items={pagination.paginatedItems}>
                    {(order) => {
                        const status = STATUS_BADGE(order);
                        return (
                            <Table.Row id={order.id}>
                                <Table.Cell>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-primary">#{order.id}</span>
                                        <span className="text-xs text-tertiary">{order.ref}</span>
                                    </div>
                                </Table.Cell>
                                <Table.Cell>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-primary">{order.customer}</span>
                                        <span className="text-xs text-tertiary">{order.phone}</span>
                                    </div>
                                </Table.Cell>
                                <Table.Cell>
                                    <div className="flex items-center gap-2">
                                        <Badge color={status.color} type="pill-color" size="sm">
                                            {status.label}
                                        </Badge>
                                        <StorageBadge storage={order.storage} />
                                    </div>
                                </Table.Cell>
                                <Table.Cell>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-secondary">{totalBoxes(order.boxes)}</span>
                                        <BoxChips boxes={order.boxes} />
                                    </div>
                                </Table.Cell>
                                <Table.Cell>
                                    <span className="text-sm text-tertiary">{order.time}</span>
                                </Table.Cell>
                                <Table.Cell>
                                    <Dropdown.Root>
                                        <Dropdown.DotsButton />
                                        <Dropdown.Popover>
                                            <Dropdown.Menu>
                                                <Dropdown.Item label="Details" href={`/orders/${order.id}`} />
                                                <Dropdown.Item label="Screen" href={`/orders/${order.id}?view=screen`} />
                                            </Dropdown.Menu>
                                        </Dropdown.Popover>
                                    </Dropdown.Root>
                                </Table.Cell>
                            </Table.Row>
                        );
                    }}
                </Table.Body>
            </Table>
            <TablePagination totalItems={orders.length} page={pagination.page} onPageChange={pagination.setPage} />
        </TableCard.Root>
    );
};

export default function OrdersPage() {
    const [view, setView] = useState<"board" | "list">("board");
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        if (!search.trim()) return orders;
        const q = search.toLowerCase();
        return orders.filter((o) => o.id.toLowerCase().includes(q) || o.ref.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q));
    }, [search]);

    return (
        <div className="flex flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
            <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">Orders</h1>
                    <p className="text-md text-tertiary">Track every order across the fulfillment pipeline.</p>
                </div>
                <Button color="secondary" size="md" iconLeading={ClockRewind} href="/orders/history">
                    Order history
                </Button>
            </header>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="w-full md:max-w-sm">
                    <Input
                        size="md"
                        placeholder="Search by Order ID, reference, or customer"
                        icon={SearchMd}
                        value={search}
                        onChange={setSearch}
                    />
                </div>
                <ButtonGroup
                    size="md"
                    selectedKeys={[view]}
                    onSelectionChange={(keys) => {
                        const next = [...keys][0];
                        if (next) setView(next as "board" | "list");
                    }}
                >
                    <ButtonGroupItem id="board" iconLeading={Columns01}>
                        Board
                    </ButtonGroupItem>
                    <ButtonGroupItem id="list" iconLeading={List}>
                        List
                    </ButtonGroupItem>
                </ButtonGroup>
            </div>

            {view === "board" ? <BoardView orders={filtered} /> : <ListView orders={filtered} />}
        </div>
    );
}
