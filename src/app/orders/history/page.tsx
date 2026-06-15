"use client";

import { useMemo, useState } from "react";
import { Download01, Package, SearchMd } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { Table, TableCard } from "@/components/application/table/table";
import { TablePagination, useTablePagination } from "@/components/application/table/table-pagination";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";

type Status = "delivered" | "returned" | "cancelled" | "failed";

type HistoryOrder = {
    id: string;
    ref: string;
    customer: string;
    phone: string;
    date: string;
    pickupTime: string;
    boxes: number;
    status: Status;
};

const STATUS_BADGE: Record<Status, { label: string; color: "success" | "warning" | "gray" | "error" }> = {
    delivered: { label: "Delivered", color: "success" },
    returned: { label: "Returned", color: "warning" },
    cancelled: { label: "Cancelled", color: "gray" },
    failed: { label: "Failed", color: "error" },
};

const history: HistoryOrder[] = [
    { id: "1", ref: "h1", customer: "Mike Test", phone: "+971 52 977 5991", date: "Jun 9, 2026", pickupTime: "4:23:22 PM", boxes: 2, status: "delivered" },
    { id: "12", ref: "rf-118", customer: "Layla Hassan", phone: "+971 52 311 8870", date: "Jun 8, 2026", pickupTime: "11:05:00 AM", boxes: 1, status: "delivered" },
    { id: "11", ref: "rf-117", customer: "Omar Idris", phone: "+971 55 442 9123", date: "Jun 7, 2026", pickupTime: "2:40:10 PM", boxes: 3, status: "returned" },
    { id: "9", ref: "rf-090", customer: "Sara Mansoor", phone: "+971 54 778 1130", date: "Jun 6, 2026", pickupTime: "9:15:45 AM", boxes: 1, status: "cancelled" },
    { id: "8", ref: "rf-088", customer: "Karim Nabil", phone: "+971 50 220 4471", date: "Jun 5, 2026", pickupTime: "6:50:00 PM", boxes: 2, status: "failed" },
    { id: "6", ref: "h0", customer: "Mike Test", phone: "+971 52 977 5990", date: "Jun 4, 2026", pickupTime: "10:30:00 AM", boxes: 1, status: "delivered" },
];

export default function OrderHistoryPage() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<string>("all");

    const filtered = useMemo(() => {
        return history.filter((o) => {
            if (status !== "all" && o.status !== status) return false;
            if (!search.trim()) return true;
            const q = search.toLowerCase();
            return o.id.toLowerCase().includes(q) || o.ref.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q);
        });
    }, [search, status]);
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
                        <Select
                            aria-label="Status"
                            size="md"
                            items={[
                                { id: "all", label: "Show all" },
                                { id: "delivered", label: "Delivered" },
                                { id: "returned", label: "Returned" },
                                { id: "cancelled", label: "Cancelled" },
                                { id: "failed", label: "Failed" },
                            ]}
                            selectedKey={status}
                            onSelectionChange={(k) => setStatus(String(k))}
                            className="sm:w-40"
                        >
                            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                        </Select>
                        <Button color="secondary" size="md" iconLeading={Download01}>
                            Export to Excel
                        </Button>
                    </div>
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
