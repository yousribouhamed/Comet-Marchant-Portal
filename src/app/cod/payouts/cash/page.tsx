"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Selection } from "react-aria-components";
import {
    AlertCircle,
    ArrowLeft,
    Calendar,
    CheckSquare,
    Coins01,
    Hourglass03,
    Inbox02,
    SearchMd,
    Wallet02,
} from "@untitledui/icons";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";
import { Input } from "@/components/base/input/input";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { Table, TableCard } from "@/components/application/table/table";
import { TablePagination, useTablePagination } from "@/components/application/table/table-pagination";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { CurrencyIcon } from "@/components/foundations/currency-icon";
import { cx } from "@/utils/cx";

const PAYOUT_LIMIT = 10_000;

type Eligibility = "eligible" | "pending";

type Transaction = {
    id: string;
    orderId: string;
    refId: string;
    customerName: string;
    customerPhone: string;
    amount: number;
    collationDate: string;
    eligibility: Eligibility;
};

const transactions: Transaction[] = [
    {
        id: "1",
        orderId: "ORD-1042",
        refId: "REF-A8E2",
        customerName: "Mike Test",
        customerPhone: "+971 50 123 4567",
        amount: 900,
        collationDate: "2 Jun 2026",
        eligibility: "eligible",
    },
    {
        id: "2",
        orderId: "ORD-1043",
        refId: "REF-B7F1",
        customerName: "Ahmed Khalil",
        customerPhone: "+971 50 987 6543",
        amount: 460,
        collationDate: "3 Jun 2026",
        eligibility: "eligible",
    },
    {
        id: "3",
        orderId: "ORD-1044",
        refId: "REF-C2A9",
        customerName: "Layla Hassan",
        customerPhone: "+971 52 311 8870",
        amount: 1250,
        collationDate: "5 Jun 2026",
        eligibility: "eligible",
    },
    {
        id: "4",
        orderId: "ORD-1045",
        refId: "REF-D3B0",
        customerName: "Omar Idris",
        customerPhone: "+971 55 442 9123",
        amount: 780,
        collationDate: "11 Jun 2026",
        eligibility: "pending",
    },
    {
        id: "5",
        orderId: "ORD-1046",
        refId: "REF-E4C1",
        customerName: "Sara Mansoor",
        customerPhone: "+971 54 778 1130",
        amount: 320,
        collationDate: "12 Jun 2026",
        eligibility: "pending",
    },
];

const formatAmount = (value: number) =>
    value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const KpiCard = ({
    icon: Icon,
    label,
    amount,
    color,
    children,
}: {
    icon: typeof Wallet02;
    label: string;
    amount: number;
    color: "brand" | "success" | "warning";
    children?: React.ReactNode;
}) => (
    <div className="flex flex-col gap-4 rounded-2xl border border-secondary bg-primary p-5 shadow-xs">
        <div className="flex items-start gap-3">
            <FeaturedIcon icon={Icon} color={color} theme="light" size="md" />
            <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-tertiary">{label}</p>
                <div className="flex items-baseline gap-1.5">
                    <CurrencyIcon className="size-5 self-center text-primary" />
                    <span className="text-display-xs font-semibold text-primary">{formatAmount(amount)}</span>
                </div>
            </div>
        </div>
        {children}
    </div>
);

export default function CashPayoutPage() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [eligibilityFilter, setEligibilityFilter] = useState<string>("eligible");
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

    const filtered = useMemo(() => {
        return transactions.filter((t) => {
            if (eligibilityFilter !== "all" && t.eligibility !== eligibilityFilter) return false;
            if (!search.trim()) return true;
            const q = search.toLowerCase();
            return (
                t.orderId.toLowerCase().includes(q) ||
                t.refId.toLowerCase().includes(q) ||
                t.customerName.toLowerCase().includes(q) ||
                t.customerPhone.includes(q)
            );
        });
    }, [search, eligibilityFilter]);

    const eligibleTotal = useMemo(
        () => transactions.filter((t) => t.eligibility === "eligible").reduce((acc, t) => acc + t.amount, 0),
        [],
    );

    const selectedTransactions = useMemo(() => {
        if (selectedKeys === "all") return filtered;
        return filtered.filter((t) => selectedKeys.has(t.id));
    }, [selectedKeys, filtered]);

    const selectedTotal = selectedTransactions.reduce((acc, t) => acc + t.amount, 0);
    const selectedCount = selectedTransactions.length;
    const limitUsage = Math.min((selectedTotal / PAYOUT_LIMIT) * 100, 100);
    const overLimit = selectedTotal > PAYOUT_LIMIT;
    const pagination = useTablePagination(filtered);

    return (
        <div className="flex min-h-dvh flex-col">
            <div className="flex flex-1 flex-col gap-6 px-4 py-6 pb-32 md:px-8 md:py-8 md:pb-28">
                <div className="flex flex-col gap-3">
                    <Button color="link-gray" size="md" iconLeading={ArrowLeft} onClick={() => router.push("/cod")}>
                        Back to COD
                    </Button>
                    <header className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">
                                Select transactions for payout
                            </h1>
                            <Badge color="success" type="pill-color" size="lg">
                                Cash
                            </Badge>
                        </div>
                        <p className="text-md text-tertiary">
                            Choose which orders to include in this cash payout request.
                        </p>
                    </header>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-warning bg-warning-secondary p-4">
                    <FeaturedIcon icon={AlertCircle} color="warning" theme="light" size="sm" />
                    <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-semibold text-primary">Eligibility rule</p>
                        <p className="text-sm text-secondary">
                            Transactions are only eligible for payout after 7 days from their collation date. Pending
                            ones will appear here once they pass the waiting period.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <KpiCard icon={Wallet02} label="Eligible total" amount={eligibleTotal} color="success" />
                    <KpiCard icon={CheckSquare} label="Selected amount" amount={selectedTotal} color="brand">
                        <div className="flex flex-col gap-2">
                            <ProgressBar
                                value={limitUsage}
                                progressClassName={overLimit ? "bg-error-solid" : undefined}
                            />
                            <p className={cx("text-xs", overLimit ? "text-error-primary" : "text-tertiary")}>
                                {selectedCount} selected · {limitUsage.toFixed(0)}% of limit used
                            </p>
                        </div>
                    </KpiCard>
                    <KpiCard icon={Hourglass03} label="Payout limit" amount={PAYOUT_LIMIT} color="warning" />
                </div>

                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary px-5 py-4 md:flex-row md:items-center md:justify-between">
                        <div className="min-w-0 flex-1 md:max-w-sm">
                            <Input
                                size="md"
                                placeholder="Search by order, reference, or customer"
                                icon={SearchMd}
                                value={search}
                                onChange={setSearch}
                            />
                        </div>
                        <ButtonGroup size="md">
                            <ButtonGroupItem id="dates" iconLeading={Calendar}>
                                Select dates
                            </ButtonGroupItem>
                            <ButtonGroupItem
                                id="eligible-only"
                                iconLeading={CheckSquare}
                                isSelected={eligibilityFilter === "eligible"}
                                onPress={() =>
                                    setEligibilityFilter(eligibilityFilter === "eligible" ? "all" : "eligible")
                                }
                            >
                                Eligible only
                            </ButtonGroupItem>
                        </ButtonGroup>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                            <FeaturedIcon icon={Inbox02} color="gray" theme="modern" size="lg" />
                            <div className="flex flex-col gap-1">
                                <p className="text-md font-semibold text-primary">No transactions match</p>
                                <p className="max-w-sm text-sm text-tertiary">
                                    Try clearing the search or widening the date range to see more orders.
                                </p>
                            </div>
                            {(search || eligibilityFilter !== "eligible") && (
                                <Button
                                    color="secondary"
                                    size="md"
                                    onClick={() => {
                                        setSearch("");
                                        setEligibilityFilter("eligible");
                                    }}
                                >
                                    Reset filters
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            <Table
                                aria-label="Transactions eligible for cash payout"
                                selectionMode="multiple"
                                selectionBehavior="toggle"
                                selectedKeys={selectedKeys}
                                onSelectionChange={setSelectedKeys}
                                disabledKeys={transactions.filter((t) => t.eligibility !== "eligible").map((t) => t.id)}
                            >
                                <Table.Header>
                                    <Table.Head id="order" label="Order ID" />
                                    <Table.Head id="ref" label="Reference" />
                                    <Table.Head id="customer" label="Customer" />
                                    <Table.Head id="amount" label="Amount" />
                                    <Table.Head id="date" label="Collation date" />
                                    <Table.Head id="status" label="Status" />
                                </Table.Header>
                                <Table.Body items={pagination.paginatedItems}>
                                    {(transaction) => (
                                        <Table.Row id={transaction.id}>
                                            <Table.Cell>
                                                <span className="text-sm font-medium text-primary">{transaction.orderId}</span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className="font-mono text-sm text-secondary">{transaction.refId}</span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-primary">
                                                        {transaction.customerName}
                                                    </span>
                                                    <span className="text-xs text-tertiary">
                                                        {transaction.customerPhone}
                                                    </span>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="flex items-baseline gap-1">
                                                    <CurrencyIcon className="size-3.5 self-center text-primary" />
                                                    <span className="text-sm font-semibold text-primary">
                                                        {formatAmount(transaction.amount)}
                                                    </span>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="flex items-center gap-1 text-sm text-tertiary">
                                                    <Calendar className="size-3.5" aria-hidden="true" />
                                                    {transaction.collationDate}
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {transaction.eligibility === "eligible" ? (
                                                    <BadgeWithDot color="success" type="pill-color" size="sm">
                                                        Eligible
                                                    </BadgeWithDot>
                                                ) : (
                                                    <BadgeWithDot color="warning" type="pill-color" size="sm">
                                                        Pending 7-day hold
                                                    </BadgeWithDot>
                                                )}
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

            <div className="sticky bottom-0 z-10 border-t border-secondary bg-primary/95 backdrop-blur">
                <div className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8">
                    <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-medium text-tertiary">Total selected amount</p>
                        <div className="flex items-baseline gap-1.5">
                            <CurrencyIcon className="size-4 self-center text-primary" />
                            <span className="text-xl font-semibold text-primary">{formatAmount(selectedTotal)}</span>
                            <span className="text-sm text-tertiary">
                                · {selectedCount} {selectedCount === 1 ? "transaction" : "transactions"}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-2 md:flex-row md:items-center">
                        <Button color="link-destructive" size="md" onClick={() => router.push("/cod")}>
                            Cancel
                        </Button>
                        <Button color="secondary" size="md" iconLeading={Coins01}>
                            Request all eligible
                        </Button>
                        <Button size="md" iconLeading={Wallet02} isDisabled={selectedCount === 0 || overLimit}>
                            Request selected payout
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
