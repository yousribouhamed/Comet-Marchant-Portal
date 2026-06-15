"use client";

import { useState } from "react";
import { SearchMd } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { DateRangePicker } from "@/components/application/date-picker/date-range-picker";
import { Table, TableCard } from "@/components/application/table/table";
import { TablePagination, useTablePagination } from "@/components/application/table/table-pagination";
import { Tab, TabList, Tabs } from "@/components/application/tabs/tabs";
import { CurrencyIcon } from "@/components/foundations/currency-icon";

type InvoiceStatus = "new" | "paid" | "overdue" | "pending";

type Invoice = {
    id: string;
    amount: number;
    creationDate: string;
    dueDate: string;
    transactionsHref: string;
    invoiceHref: string;
    status: InvoiceStatus;
    payment?: string;
};

const invoiceTabs = [
    { id: "all", label: "All" },
    { id: "new", label: "New" },
    { id: "paid", label: "Paid" },
    { id: "overdue", label: "Overdue" },
    { id: "pending", label: "Pending" },
];

const STATUS_BADGES: Record<InvoiceStatus, { label: string; color: "blue" | "success" | "error" | "warning" }> = {
    new: { label: "NEW", color: "blue" },
    paid: { label: "PAID", color: "success" },
    overdue: { label: "OVERDUE", color: "error" },
    pending: { label: "PENDING", color: "warning" },
};

const invoices: Invoice[] = [
    {
        id: "1",
        amount: 63,
        creationDate: "08/06/2026",
        dueDate: "18/07/2026",
        transactionsHref: "#",
        invoiceHref: "#",
        status: "new",
    },
];

export default function InvoicesPage() {
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const normalizedSearch = searchQuery.trim().toLowerCase();
    const visible = invoices.filter((invoice) => {
        const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
        const matchesSearch =
            !normalizedSearch ||
            [
                invoice.id,
                invoice.amount.toFixed(2),
                invoice.creationDate,
                invoice.dueDate,
                STATUS_BADGES[invoice.status].label,
                invoice.payment ?? "",
            ]
                .join(" ")
                .toLowerCase()
                .includes(normalizedSearch);

        return matchesStatus && matchesSearch;
    });
    const pagination = useTablePagination(visible);

    return (
        <div className="flex flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
            <header className="flex flex-col gap-1">
                <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">Invoices</h1>
                <p className="text-md text-tertiary">View, download, and reconcile your invoices.</p>
            </header>

            <TableCard.Root>
                <div className="flex flex-col gap-3 border-b border-secondary px-5 py-4 md:flex-row md:items-center md:justify-between">
                    <Input
                        aria-label="Search invoices"
                        placeholder="Search invoices"
                        icon={SearchMd}
                        value={searchQuery}
                        onChange={setSearchQuery}
                        className="md:w-72"
                    />

                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <DateRangePicker aria-label="Date range" size="md" className="w-full md:w-auto" />
                    </div>
                </div>

                <Tabs selectedKey={statusFilter} onSelectionChange={(key) => setStatusFilter(String(key))}>
                    <div className="border-b border-secondary px-5 pt-4">
                        <TabList type="underline" size="md" className="overflow-x-auto">
                            {invoiceTabs.map((tab) => (
                                <Tab key={tab.id} id={tab.id}>
                                    {tab.label}
                                </Tab>
                            ))}
                        </TabList>
                    </div>
                </Tabs>

                <Table aria-label="Invoices">
                    <Table.Header>
                        <Table.Head id="amount" isRowHeader label="Amount" />
                        <Table.Head id="creation-date" label="Creation Date" />
                        <Table.Head id="due-date" label="Due Date" />
                        <Table.Head id="transactions" label="Transactions" />
                        <Table.Head id="invoice" label="Invoice" />
                        <Table.Head id="status" label="Status" />
                        <Table.Head id="payment" label="Payment" />
                    </Table.Header>

                    <Table.Body items={pagination.paginatedItems}>
                        {(invoice) => {
                            const status = STATUS_BADGES[invoice.status];
                            return (
                                <Table.Row id={invoice.id}>
                                    <Table.Cell>
                                        <div className="flex items-center gap-1.5">
                                            <CurrencyIcon className="size-3.5 text-primary" />
                                            <span className="text-sm font-medium text-primary">
                                                {invoice.amount.toFixed(2)}
                                            </span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span className="text-sm font-medium text-primary">{invoice.creationDate}</span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span className="text-sm font-medium text-primary">{invoice.dueDate}</span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button href={invoice.transactionsHref} color="link-color" size="md">
                                            View Transactions
                                        </Button>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button href={invoice.invoiceHref} color="link-gray" size="md">
                                            View Invoice
                                        </Button>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Badge color={status.color} type="color" size="md">
                                            {status.label}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span className="text-sm text-tertiary">{invoice.payment ?? "—"}</span>
                                    </Table.Cell>
                                </Table.Row>
                            );
                        }}
                    </Table.Body>
                </Table>
                <TablePagination totalItems={visible.length} page={pagination.page} onPageChange={pagination.setPage} />
            </TableCard.Root>
        </div>
    );
}
