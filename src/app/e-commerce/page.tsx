"use client";

import { useState } from "react";
import { ChevronDown, ClipboardDownload, Eye, SearchMd, Trash01, Truck01 } from "@untitledui/icons";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Input } from "@/components/base/input/input";
import {
    Dialog,
    DialogClose,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogPanel,
    DialogPopup,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { TablePagination, useTablePagination } from "@/components/application/table/table-pagination";

type EcommerceOrder = {
    id: string;
    referenceId: string;
    status: "Placed" | "New";
    customerName: string;
    phone: string;
    createdAt: string;
    codAmount: string;
    area: string;
    address: string;
    primaryAction: "Details" | "Deliver";
};

const orders: EcommerceOrder[] = [
    {
        id: "order-1002-a",
        referenceId: "1002",
        status: "Placed",
        customerName: "John Doe",
        phone: "+971555555551",
        createdAt: "January 15, 2023",
        codAmount: "0 AED",
        area: "New York",
        address: "123 Main St",
        primaryAction: "Details",
    },
    {
        id: "order-1002-b",
        referenceId: "1002",
        status: "Placed",
        customerName: "John Doe",
        phone: "+971555555551",
        createdAt: "January 15, 2023",
        codAmount: "0 AED",
        area: "New York",
        address: "123 Main St",
        primaryAction: "Details",
    },
    {
        id: "order-1031",
        referenceId: "1031",
        status: "New",
        customerName: "Ahmed Abdullah",
        phone: "+971555555551",
        createdAt: "September 8, 2025",
        codAmount: "5.25 AED",
        area: "Cluster M",
        address: "Cluster M",
        primaryAction: "Deliver",
    },
    {
        id: "order-1030",
        referenceId: "1030",
        status: "Placed",
        customerName: "Jack Smith",
        phone: "+971555555551",
        createdAt: "September 3, 2025",
        codAmount: "5.25 AED",
        area: "Cluster M",
        address: "Cluster M",
        primaryAction: "Details",
    },
];

const statusColor = {
    Placed: "success",
    New: "brand",
} as const;

const orderFilterOptions = [
    { id: "all", label: "Show All" },
    { id: "placed", label: "Placed" },
    { id: "new", label: "New" },
];

const OrderActionsMenu = ({ order }: { order: EcommerceOrder }) => (
    <Dropdown.Root>
        <Dropdown.DotsButton />
        <Dropdown.Popover className="w-48">
            <Dropdown.Menu>
                <Dropdown.Item icon={order.primaryAction === "Deliver" ? Truck01 : Eye}>
                    {order.primaryAction}
                </Dropdown.Item>
                <Dropdown.Item icon={Trash01}>Delete</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown.Popover>
    </Dropdown.Root>
);

const BulkConversionDialog = ({ orders }: { orders: EcommerceOrder[] }) => (
    <Dialog>
        <DialogTrigger render={<Button size="md" iconLeading={ClipboardDownload} />}>Convert to Bulk</DialogTrigger>
        <DialogPopup className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>Convert Shopify orders to bulk</DialogTitle>
                <DialogDescription>
                    Review the selected orders before moving them into the bulk conversion workflow.
                </DialogDescription>
            </DialogHeader>

            <Form className="contents" onSubmit={(event) => event.preventDefault()}>
                <DialogPanel className="flex flex-col gap-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-lg bg-secondary px-3 py-2">
                            <p className="text-xs font-medium text-tertiary">Orders</p>
                            <p className="text-lg font-semibold text-primary">{orders.length}</p>
                        </div>
                        <div className="rounded-lg bg-secondary px-3 py-2">
                            <p className="text-xs font-medium text-tertiary">Ready</p>
                            <p className="text-lg font-semibold text-primary">3</p>
                        </div>
                        <div className="rounded-lg bg-secondary px-3 py-2">
                            <p className="text-xs font-medium text-tertiary">COD total</p>
                            <p className="text-lg font-semibold text-primary">10.50 AED</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        {orders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between gap-3 rounded-lg border border-secondary px-3 py-2">
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-primary">#{order.referenceId} - {order.customerName}</p>
                                    <p className="truncate text-xs text-tertiary">{order.area} - {order.codAmount}</p>
                                </div>
                                <BadgeWithDot color={statusColor[order.status]} size="sm">
                                    {order.status}
                                </BadgeWithDot>
                            </div>
                        ))}
                    </div>
                </DialogPanel>

                <DialogFooter>
                    <DialogClose render={<Button color="tertiary" size="md" type="button" />}>Cancel</DialogClose>
                    <Button color="primary" size="md" iconLeading={ClipboardDownload} type="submit">
                        Convert {orders.length} orders
                    </Button>
                </DialogFooter>
            </Form>
        </DialogPopup>
    </Dialog>
);

export default function EcommercePage() {
    const [orderFilter, setOrderFilter] = useState("all");
    const orderFilterLabel = orderFilterOptions.find((option) => option.id === orderFilter)?.label ?? "Show All";
    const visibleOrders = orders.filter((order) => orderFilter === "all" || order.status.toLowerCase() === orderFilter);
    const pagination = useTablePagination(visibleOrders);

    return (
        <div className="flex flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
            <header className="flex flex-col gap-1">
                <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">Integrations</h1>
                <p className="text-md text-tertiary">Shopify orders are normalized into a scannable table with repeated field labels removed.</p>
            </header>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <Input className="w-full lg:max-w-md" size="md" placeholder="Search by reference ID" icon={SearchMd} />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <BulkConversionDialog orders={visibleOrders} />
                    <Dropdown.Root>
                        <Button color="secondary" size="md" iconTrailing={ChevronDown} className="w-max min-w-34 justify-between">
                            {orderFilterLabel}
                        </Button>
                        <Dropdown.Popover placement="bottom left" className="w-44">
                            <Dropdown.Menu
                                aria-label="Filter orders"
                                selectionMode="single"
                                selectedKeys={new Set([orderFilter])}
                                onAction={(key) => setOrderFilter(String(key))}
                            >
                                {orderFilterOptions.map((option) => (
                                    <Dropdown.Item key={option.id} id={option.id}>
                                        {option.label}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown.Popover>
                    </Dropdown.Root>
                </div>
            </div>

            <TableCard.Root size="sm">
                <TableCard.Header
                    title="Shopify orders"
                    badge={`${orders.length} orders`}
                    description="Extracted from the crowded order cards: each repeated label is now a column header."
                />

                <Table aria-label="Shopify orders" size="sm">
                    <Table.Header>
                        <Table.Head id="referenceId" isRowHeader label="Ref ID" />
                        <Table.Head id="status" label="Status" />
                        <Table.Head id="customer" label="Customer" />
                        <Table.Head id="createdAt" label="Created" />
                        <Table.Head id="codAmount" label="COD" />
                        <Table.Head id="area" label="Area" />
                        <Table.Head id="address" label="Address" />
                        <Table.Head id="actions" label="" className="w-16" />
                    </Table.Header>

                    <Table.Body items={pagination.paginatedItems}>
                        {(order) => (
                            <Table.Row id={order.id}>
                                <Table.Cell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-primary">#{order.referenceId}</span>
                                        <span className="text-xs text-quaternary">Shopify</span>
                                    </div>
                                </Table.Cell>
                                <Table.Cell>
                                    <BadgeWithDot color={statusColor[order.status]} size="sm">
                                        {order.status}
                                    </BadgeWithDot>
                                </Table.Cell>
                                <Table.Cell>
                                    <div className="flex min-w-48 flex-col">
                                        <span className="font-medium text-primary">{order.customerName}</span>
                                        <span className="text-xs text-tertiary">{order.phone}</span>
                                    </div>
                                </Table.Cell>
                                <Table.Cell>
                                    <span className="whitespace-nowrap text-secondary">{order.createdAt}</span>
                                </Table.Cell>
                                <Table.Cell>
                                    <Badge color="gray" size="sm" type="modern">
                                        {order.codAmount}
                                    </Badge>
                                </Table.Cell>
                                <Table.Cell>
                                    <span className="font-medium text-secondary">{order.area}</span>
                                </Table.Cell>
                                <Table.Cell>
                                    <span className="text-secondary">{order.address}</span>
                                </Table.Cell>
                                <Table.Cell className="px-4">
                                    <div className="flex justify-end">
                                        <OrderActionsMenu order={order} />
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
                <TablePagination totalItems={visibleOrders.length} page={pagination.page} onPageChange={pagination.setPage} />
            </TableCard.Root>
        </div>
    );
}
