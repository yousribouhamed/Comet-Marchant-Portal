"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowUp,
    Calendar,
    CheckCircle,
    ChevronDown,
    Clock,
    Coins01,
    CreditCard02,
    Download01,
    FilterLines,
    Hourglass03,
    SearchMd,
    Wallet02,
    XCircle,
} from "@untitledui/icons";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Input } from "@/components/base/input/input";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { RadioGroup as AriaRadioGroup, Radio as AriaRadio } from "react-aria-components";
import { RadioButtonBase } from "@/components/base/radio-buttons/radio-buttons";
import { Table, TableCard } from "@/components/application/table/table";
import { TablePagination, useTablePagination } from "@/components/application/table/table-pagination";
import { Tab, TabList, TabPanel, Tabs } from "@/components/application/tabs/tabs";
import {
    Drawer,
    DrawerClose,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerPanel,
    DrawerPopup,
    DrawerTitle,
} from "@/components/ui/drawer";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CurrencyIcon } from "@/components/foundations/currency-icon";
import { cx } from "@/utils/cx";

type OrderStatus = "pending" | "collected" | "failed";
type OrderType = "cash" | "online";

type Order = {
    id: string;
    customer: string;
    initials: string;
    amount: number;
    type: OrderType;
    status: OrderStatus;
    label: "Normal" | "Express" | "Bulk";
    time: string;
};

type PayoutStatus = "requested" | "approved" | "declined";

type PayoutRequest = {
    id: string;
    status: PayoutStatus;
    amount: number;
    method: "Cash" | "Pay-Online";
    requestedAt: string;
    resolution?: string;
};

const orders: Order[] = [
    {
        id: "1",
        customer: "Mike Test - 1",
        initials: "MT",
        amount: 900,
        type: "cash",
        status: "pending",
        label: "Normal",
        time: "9:58 AM · 9 Jun 2026",
    },
    {
        id: "2",
        customer: "Sarah Johnson",
        initials: "SJ",
        amount: 1240,
        type: "online",
        status: "collected",
        label: "Express",
        time: "11:24 AM · 9 Jun 2026",
    },
    {
        id: "3",
        customer: "Ahmed Khalil",
        initials: "AK",
        amount: 460,
        type: "cash",
        status: "collected",
        label: "Normal",
        time: "2:11 PM · 8 Jun 2026",
    },
    {
        id: "4",
        customer: "Priya Patel",
        initials: "PP",
        amount: 2150,
        type: "online",
        status: "pending",
        label: "Bulk",
        time: "4:45 PM · 8 Jun 2026",
    },
];

const payoutHistory: PayoutRequest[] = [
    {
        id: "PO-1042",
        status: "requested",
        amount: 900,
        method: "Cash",
        requestedAt: "Today, 10:24 AM",
        resolution: "Expected review today",
    },
    {
        id: "PO-1038",
        status: "approved",
        amount: 1240,
        method: "Pay-Online",
        requestedAt: "Jun 16, 2026",
        resolution: "Paid to bank account",
    },
    {
        id: "PO-1031",
        status: "declined",
        amount: 460,
        method: "Cash",
        requestedAt: "Jun 12, 2026",
        resolution: "Orders still within hold period",
    },
];

const STATUS_STYLE: Record<OrderStatus, { label: string; color: "warning" | "success" | "error" }> = {
    pending: { label: "Pending", color: "warning" },
    collected: { label: "Collected", color: "success" },
    failed: { label: "Failed", color: "error" },
};

const PAYOUT_STATUS_STYLE: Record<
    PayoutStatus,
    {
        label: string;
        color: "warning" | "success" | "error";
        icon: typeof Hourglass03;
    }
> = {
    requested: { label: "Requested", color: "warning", icon: Hourglass03 },
    approved: { label: "Approved", color: "success", icon: CheckCircle },
    declined: { label: "Declined", color: "error", icon: XCircle },
};

const transactionFilterOptions = [
    { id: "order-transaction", label: "Order Transaction" },
    { id: "payout-amount", label: "Payout Amount" },
    { id: "carry-over-transaction", label: "Carry over transaction" },
    { id: "refund", label: "Refund" },
    { id: "partial-refund", label: "Partial Refund" },
] as const;

const formatAmount = (value: number) =>
    value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const KpiCard = ({
    icon: Icon,
    label,
    amount,
    trend,
    color,
}: {
    icon: typeof Wallet02;
    label: string;
    amount: number;
    trend?: { value: string; direction: "up" | "down" };
    color: "brand" | "success" | "warning";
}) => (
    <div className="flex flex-col gap-5 rounded-2xl border border-secondary bg-primary p-5 shadow-xs">
        <div className="flex items-start justify-between">
            <FeaturedIcon icon={Icon} color={color} theme="light" size="md" />
            {trend && (
                <Badge color={trend.direction === "up" ? "success" : "error"} type="pill-color" size="sm">
                    <ArrowUp className="size-3" aria-hidden="true" />
                    {trend.value}
                </Badge>
            )}
        </div>
        <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-tertiary">{label}</p>
            <div className="flex items-baseline gap-1.5">
                <CurrencyIcon className="size-5 self-center text-primary" />
                <span className="text-display-xs font-semibold text-primary">{formatAmount(amount)}</span>
            </div>
        </div>
    </div>
);

const PAYOUT_QUOTA_USED = 0;
const PAYOUT_QUOTA_MAX = 1_000_000;

export default function CodPage() {
    const [activeTab, setActiveTab] = useState("all");
    const [breakdownOpen, setBreakdownOpen] = useState(false);
    const [payoutDrawerOpen, setPayoutDrawerOpen] = useState(false);
    const [selectedStatusFilters, setSelectedStatusFilters] = useState<Set<string>>(new Set());

    const filteredOrders =
        activeTab === "cash"
            ? orders.filter((o) => o.type === "cash")
            : activeTab === "online"
              ? orders.filter((o) => o.type === "online")
              : orders;

    const cashTotal = orders.filter((o) => o.type === "cash").reduce((acc, o) => acc + o.amount, 0);
    const onlineTotal = orders.filter((o) => o.type === "online").reduce((acc, o) => acc + o.amount, 0);
    const pendingTotal = orders.filter((o) => o.status === "pending").reduce((acc, o) => acc + o.amount, 0);
    const collectedTotal = orders.filter((o) => o.status === "collected").reduce((acc, o) => acc + o.amount, 0);
    const statusFilterLabel =
        selectedStatusFilters.size === 0
            ? "All statuses"
            : selectedStatusFilters.size === 1
              ? transactionFilterOptions.find((option) => selectedStatusFilters.has(option.id))?.label || "1 selected"
              : `${selectedStatusFilters.size} selected`;

    return (
        <div className="flex flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
            <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">COD</h1>
                    <p className="text-md text-tertiary">
                        Track cash-on-delivery orders, reconcile payments, and request payouts.
                    </p>
                </div>
                <Button size="md" iconLeading={Wallet02} onClick={() => setPayoutDrawerOpen(true)}>
                    Request Payout
                </Button>
            </header>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <KpiCard
                    icon={Wallet02}
                    label="Total collected"
                    amount={collectedTotal}
                    color="success"
                    trend={{ value: "12.4%", direction: "up" }}
                />
                <KpiCard
                    icon={Hourglass03}
                    label="Pending payout"
                    amount={pendingTotal}
                    color="warning"
                />
                <KpiCard
                    icon={CreditCard02}
                    label="Available balance"
                    amount={collectedTotal - PAYOUT_QUOTA_USED}
                    color="brand"
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="flex flex-col gap-4 lg:col-span-2">
                    <Tabs selectedKey={activeTab} onSelectionChange={(k) => setActiveTab(String(k))}>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center">
                                <div className="min-w-0 flex-1">
                                    <Input size="md" placeholder="Search by order ID or customer" icon={SearchMd} />
                                </div>
                                <div className="flex flex-wrap gap-2 self-start md:shrink-0 md:self-auto">
                                    <Button size="md" color="secondary" iconLeading={Calendar}>
                                        Select dates
                                    </Button>
                                    <Dropdown.Root>
                                        <Button size="md" color="secondary" iconLeading={FilterLines} iconTrailing={ChevronDown}>
                                            {statusFilterLabel}
                                        </Button>
                                        <Dropdown.Popover placement="bottom left" className="w-70">
                                            <Dropdown.Menu
                                                aria-label="Status filters"
                                                selectionMode="multiple"
                                                selectedKeys={selectedStatusFilters}
                                                onSelectionChange={(keys) =>
                                                    setSelectedStatusFilters(
                                                        keys === "all"
                                                            ? new Set(transactionFilterOptions.map((option) => option.id))
                                                            : new Set([...keys].map(String)),
                                                    )
                                                }
                                            >
                                                {transactionFilterOptions.map((option) => (
                                                    <Dropdown.Item key={option.id} id={option.id} selectionIndicator="checkbox">
                                                        {option.label}
                                                    </Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown.Popover>
                                    </Dropdown.Root>
                                    <Button size="md" color="secondary" iconLeading={Download01}>
                                        Export data
                                    </Button>
                                </div>
                            </div>

                            <TabList type="underline" size="md">
                                <Tab id="all">All Orders</Tab>
                                <Tab id="cash">Collected by Cash</Tab>
                                <Tab id="online">Collected by Pay-Online</Tab>
                            </TabList>
                        </div>

                        <TabPanel id="all" className="mt-6">
                            <OrdersTable orders={filteredOrders} />
                        </TabPanel>
                        <TabPanel id="cash" className="mt-6">
                            <OrdersTable orders={filteredOrders} />
                        </TabPanel>
                        <TabPanel id="online" className="mt-6">
                            <OrdersTable orders={filteredOrders} />
                        </TabPanel>
                    </Tabs>
                </div>

                <aside className="flex flex-col gap-4">
                    <div className="flex flex-col gap-5 rounded-2xl border border-secondary bg-primary p-5 shadow-xs">
                        <div className="flex items-center gap-3">
                            <FeaturedIcon icon={Wallet02} color="brand" theme="light" size="md" />
                            <div className="flex flex-col">
                                <p className="text-sm font-medium text-tertiary">Available to payout</p>
                                <p className="text-xs text-quaternary">Updated just now</p>
                            </div>
                        </div>

                        <div className="flex items-baseline gap-2">
                            <CurrencyIcon className="size-7 self-center text-primary" />
                            <span className="text-display-sm font-semibold text-primary">
                                {formatAmount(collectedTotal)}
                            </span>
                        </div>

                        <Button
                            size="md"
                            iconLeading={Wallet02}
                            className="w-full"
                            onClick={() => setPayoutDrawerOpen(true)}
                        >
                            Request payout
                        </Button>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-medium text-secondary">Free payouts this month</span>
                                <span className="text-tertiary">
                                    {PAYOUT_QUOTA_USED.toLocaleString()} / {PAYOUT_QUOTA_MAX.toLocaleString()}
                                </span>
                            </div>
                            <ProgressBar value={PAYOUT_QUOTA_USED} max={PAYOUT_QUOTA_MAX} />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-secondary bg-primary shadow-xs">
                        <button
                            type="button"
                            onClick={() => setBreakdownOpen((v) => !v)}
                            className="flex w-full items-center justify-between px-5 py-4 text-left"
                            aria-expanded={breakdownOpen}
                        >
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-primary">Breakdown</span>
                                <span className="text-xs text-tertiary">By collection method</span>
                            </div>
                            <span
                                className={cx(
                                    "text-fg-quaternary transition-transform duration-150",
                                    breakdownOpen ? "rotate-180" : "rotate-0",
                                )}
                                aria-hidden="true"
                            >
                                ▾
                            </span>
                        </button>
                        {breakdownOpen && (
                            <div className="flex flex-col gap-3 border-t border-secondary px-5 py-4">
                                <BreakdownRow label="Collected by Cash" amount={cashTotal} />
                                <BreakdownRow label="Collected by Pay-Online" amount={onlineTotal} />
                                <div className="my-1 h-px bg-border-secondary" />
                                <BreakdownRow label="Total" amount={cashTotal + onlineTotal} bold />
                            </div>
                        )}
                    </div>

                    <PayoutHistoryCard items={payoutHistory} />
                </aside>
            </div>

            <RequestPayoutDrawer
                open={payoutDrawerOpen}
                onOpenChange={setPayoutDrawerOpen}
                cashAmount={cashTotal}
                onlineAmount={onlineTotal}
            />
        </div>
    );
}

const PayoutOptionCard = ({
    value,
    icon: Icon,
    color,
    title,
    amount,
    disclaimer,
}: {
    value: string;
    icon: typeof Wallet02;
    color: "success" | "brand";
    title: React.ReactNode;
    amount: number;
    disclaimer: React.ReactNode;
}) => (
    <AriaRadio
        value={value}
        className={({ isSelected, isFocusVisible }) =>
            cx(
                "group flex w-full cursor-pointer flex-col gap-4 rounded-2xl border bg-primary p-5 text-left shadow-xs transition duration-100 ease-linear hover:border-brand",
                isSelected ? "border-brand ring-1 ring-brand" : "border-secondary",
                isFocusVisible && "outline-2 outline-brand outline-offset-2",
            )
        }
    >
        {({ isSelected, isDisabled, isFocusVisible }) => (
            <>
                <div className="flex items-start gap-4">
                    <FeaturedIcon icon={Icon} color={color} theme="light" size="md" />
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <p className="text-md font-semibold text-primary">{title}</p>
                        <div className="flex items-center gap-1.5 text-sm text-tertiary">
                            <span>Amount eligible for payout:</span>
                            <span className="flex items-baseline gap-1">
                                <CurrencyIcon className="size-3.5 self-center text-primary" />
                                <span className="font-semibold text-primary">{formatAmount(amount)}</span>
                            </span>
                        </div>
                    </div>
                    <RadioButtonBase
                        size="md"
                        isSelected={isSelected}
                        isDisabled={isDisabled}
                        isFocusVisible={isFocusVisible}
                    />
                </div>
                <div className="rounded-lg bg-secondary_subtle p-3 text-xs text-secondary">{disclaimer}</div>
            </>
        )}
    </AriaRadio>
);

const RequestPayoutDrawer = ({
    open,
    onOpenChange,
    cashAmount,
    onlineAmount,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    cashAmount: number;
    onlineAmount: number;
}) => {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);

    const handleContinue = () => {
        if (!selected) return;
        onOpenChange(false);
        router.push(selected === "cash" ? "/cod/payouts/cash" : "/cod/payouts/online");
    };

    return (
        <Drawer
            open={open}
            onOpenChange={(v) => {
                if (!v) setSelected(null);
                onOpenChange(v);
            }}
        >
            <DrawerPopup side="right">
                <DrawerHeader>
                    <DrawerTitle>Request Payout</DrawerTitle>
                    <DrawerDescription>Please select payout type</DrawerDescription>
                </DrawerHeader>

                <DrawerPanel>
                    <AriaRadioGroup
                        aria-label="Payout type"
                        value={selected}
                        onChange={setSelected}
                        className="flex flex-col gap-4"
                    >
                        <PayoutOptionCard
                            value="cash"
                            icon={Coins01}
                            color="success"
                            title={
                                <>
                                    Request amount collected by <span className="font-bold">Cash</span>
                                </>
                            }
                            amount={cashAmount}
                            disclaimer={
                                <>
                                    <span className="font-semibold text-primary">Disclaimer:</span> Amount collected for
                                    orders in previous 7 days won&apos;t be eligible for payout.
                                </>
                            }
                        />

                        <PayoutOptionCard
                            value="online"
                            icon={CreditCard02}
                            color="brand"
                            title={
                                <>
                                    Request amount collected by <span className="font-bold">Pay-Online</span>
                                </>
                            }
                            amount={onlineAmount}
                            disclaimer={
                                <>
                                    <span className="font-semibold text-primary">Disclaimer:</span> Amount collected by
                                    Pay-Online will be eligible for payout in the next day.
                                </>
                            }
                        />
                    </AriaRadioGroup>
                </DrawerPanel>

                <DrawerFooter>
                    <DrawerClose render={<Button color="tertiary-destructive" size="md" />}>Cancel</DrawerClose>
                    <Button size="md" isDisabled={!selected} onClick={handleContinue}>
                        Continue
                    </Button>
                </DrawerFooter>
            </DrawerPopup>
        </Drawer>
    );
};

const OrdersTable = ({ orders }: { orders: Order[] }) => {
    const pagination = useTablePagination(orders);

    return (
    <TableCard.Root size="sm">
        {orders.length === 0 ? (
            <div className="flex flex-col items-center gap-1 py-12 text-center">
                <p className="text-sm font-medium text-primary">No orders for this filter</p>
                <p className="text-sm text-tertiary">Try changing the date range or filters.</p>
            </div>
        ) : (
            <>
                <Table aria-label="COD orders" size="sm">
                    <Table.Header>
                        <Table.Head id="order" isRowHeader label="Order" />
                        <Table.Head id="type" label="Collection" />
                        <Table.Head id="status" label="Status" />
                        <Table.Head id="amount" label="Amount" />
                        <Table.Head id="time" label="Time" />
                    </Table.Header>

                    <Table.Body items={pagination.paginatedItems}>
                        {(order) => {
                            const status = STATUS_STYLE[order.status];

                            return (
                                <Table.Row id={order.id}>
                                    <Table.Cell>
                                        <div className="flex min-w-48 items-center gap-3">
                                            <FeaturedIcon
                                                icon={order.type === "cash" ? Wallet02 : CreditCard02}
                                                color={order.type === "cash" ? "success" : "brand"}
                                                theme="light"
                                                size="sm"
                                            />
                                            <div className="flex min-w-0 flex-col">
                                                <span className="truncate text-sm font-semibold text-primary">{order.customer}</span>
                                                <span className="text-xs font-medium text-tertiary">Order #{order.id}</span>
                                            </div>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Badge color="gray" type="modern" size="sm">
                                            {order.label}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <BadgeWithDot color={status.color} type="pill-color" size="sm">
                                            {status.label}
                                        </BadgeWithDot>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-baseline gap-1">
                                            <CurrencyIcon className="size-3.5 self-center text-success-primary" />
                                            <span className="text-sm font-semibold text-success-primary">{formatAmount(order.amount)}</span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div className="flex min-w-36 items-center gap-1 text-sm text-tertiary">
                                            <Clock className="size-3.5" aria-hidden="true" />
                                            {order.time}
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            );
                        }}
                    </Table.Body>
                </Table>
                <TablePagination totalItems={orders.length} page={pagination.page} onPageChange={pagination.setPage} />
            </>
        )}
    </TableCard.Root>
    );
};

const PayoutHistoryCard = ({ items }: { items: PayoutRequest[] }) => {
    const requested = items.filter((item) => item.status === "requested");
    const approved = items.filter((item) => item.status === "approved");
    const declined = items.filter((item) => item.status === "declined");
    const latestRequested = requested[0];

    return (
        <section className="flex flex-col gap-4 rounded-2xl border border-secondary bg-primary p-5 shadow-xs">
            <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <h2 className="text-sm font-semibold text-primary">Payouts history</h2>
                    <p className="text-xs text-tertiary">Track request status before starting another payout.</p>
                </div>
                <BadgeWithDot color={latestRequested ? "warning" : "success"} type="pill-color" size="sm">
                    {latestRequested ? "Pending review" : "Clear"}
                </BadgeWithDot>
            </div>

            {latestRequested && (
                <Alert variant="warning">
                    <Hourglass03 />
                    <AlertTitle className="flex items-center justify-between gap-3">
                        <span>Pending payout request</span>
                        <span className="flex items-baseline gap-1 text-sm font-semibold text-primary">
                            <CurrencyIcon className="size-3.5 self-center" />
                            {formatAmount(latestRequested.amount)}
                        </span>
                    </AlertTitle>
                    <AlertDescription>
                        {latestRequested.id} · {latestRequested.method} · {latestRequested.requestedAt}
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-3 gap-2">
                <PayoutStatusSummary label="Requested payouts" count={requested.length} color="warning" />
                <PayoutStatusSummary label="Approved payouts" count={approved.length} color="success" />
                <PayoutStatusSummary label="Declined payouts" count={declined.length} color="error" />
            </div>

            <div className="flex flex-col divide-y divide-secondary">
                {items.map((item) => {
                    const status = PAYOUT_STATUS_STYLE[item.status];
                    const StatusIcon = status.icon;

                    return (
                        <div key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary_subtle">
                                <StatusIcon className="size-4 text-fg-quaternary" aria-hidden="true" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-primary">{item.id}</p>
                                        <p className="text-xs text-tertiary">{item.method} · {item.requestedAt}</p>
                                    </div>
                                    <div className="flex shrink-0 flex-col items-end gap-1">
                                        <span className="flex items-baseline gap-1 text-sm font-semibold text-primary">
                                            <CurrencyIcon className="size-3.5 self-center" />
                                            {formatAmount(item.amount)}
                                        </span>
                                        <BadgeWithDot color={status.color} type="pill-color" size="sm">
                                            {status.label}
                                        </BadgeWithDot>
                                    </div>
                                </div>
                                {item.resolution && <p className="mt-1 text-xs text-secondary">{item.resolution}</p>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

const PayoutStatusSummary = ({
    label,
    count,
    color,
}: {
    label: string;
    count: number;
    color: "warning" | "success" | "error";
}) => {
    const dotColor = {
        warning: "bg-fg-warning-primary",
        success: "bg-fg-success-primary",
        error: "bg-fg-error-primary",
    }[color];

    return (
        <div className="rounded-lg border border-secondary bg-secondary_subtle px-3 py-2">
            <p className="text-lg font-semibold text-primary">{count}</p>
            <div className="mt-1 flex items-start gap-1.5 text-xs font-medium text-secondary">
                <span className={cx("mt-1.5 size-1.5 shrink-0 rounded-full", dotColor)} aria-hidden="true" />
                <span className="leading-snug">{label}</span>
            </div>
        </div>
    );
};

const BreakdownRow = ({ label, amount, bold }: { label: string; amount: number; bold?: boolean }) => (
    <div className="flex items-center justify-between">
        <span className={cx("text-sm", bold ? "font-semibold text-primary" : "text-secondary")}>{label}</span>
        <div className="flex items-baseline gap-1">
            <CurrencyIcon className={cx("size-3.5 self-center", bold ? "text-primary" : "text-secondary")} />
            <span className={cx("text-sm", bold ? "font-semibold text-primary" : "text-secondary")}>
                {formatAmount(amount)}
            </span>
        </div>
    </div>
);
