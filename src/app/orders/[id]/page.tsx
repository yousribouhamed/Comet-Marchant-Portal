"use client";

import { use, useState } from "react";
import {
    ArrowLeft,
    Check,
    Copy01,
    Download01,
    Edit01,
    MarkerPin01,
    Package,
    Phone,
    RefreshCw01,
    Thermometer01,
    Truck01,
    User01,
    XClose,
} from "@untitledui/icons";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { Toggle } from "@/components/base/toggle/toggle";
import { Dialog, DialogClose, DialogFooter, DialogHeader, DialogPanel, DialogPopup, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { CurrencyIcon } from "@/components/foundations/currency-icon";
import { useClipboard } from "@/hooks/use-clipboard";
import { cx } from "@/utils/cx";

type Stage = "created" | "pickup" | "in_transit" | "out_for_delivery" | "delivered";

type Detail = {
    id: string;
    ref: string;
    status: "in_progress" | "delivered" | "scheduled" | "cancelled";
    statusLabel: string;
    stage: Stage;
    eta: string;
    customer: {
        name: string;
        phone: string;
        address: string;
        building: string;
        floor: string;
        unit: string;
        note?: string;
    };
    pickupLocation: string;
    isScheduled: boolean;
    scheduledPickup: string;
    scheduledDelivery: string;
    boxes: { size: "Small" | "Medium" | "Large"; count: number }[];
    temperature: "Ambient" | "Dry" | "Chilled" | "Frozen";
    deliverInPerson: boolean;
    proofOfDelivery: boolean;
    codAmount?: number;
    trackingUrl: string;
};

const ORDERS: Record<string, Detail> = {
    "6": {
        id: "6",
        ref: "sdfsdf",
        status: "in_progress",
        statusLabel: "In progress",
        stage: "in_transit",
        eta: "Jun 12, 2026 · 6:30 AM",
        customer: {
            name: "Mike Test",
            phone: "+971 52 977 5990",
            address: "Al Khail Gate, Al Quoz Industrial 2, Dubai, United Arab Emirates",
            building: "12",
            floor: "17",
            unit: "1705",
            note: "Please call me 15 minutes before arrival.",
        },
        pickupLocation: "MOE — Mall of the Emirates Hub",
        isScheduled: true,
        scheduledPickup: "Jun 12, 2026 · 5:00 AM – 6:30 AM",
        scheduledDelivery: "Jun 12, 2026 · 5:00 AM – 6:30 AM",
        boxes: [{ size: "Large", count: 1 }],
        temperature: "Ambient",
        deliverInPerson: false,
        proofOfDelivery: false,
        trackingUrl: "https://track.comet.ae/o/6-sdfsdf",
    },
    "5": {
        id: "5",
        ref: "1321",
        status: "scheduled",
        statusLabel: "Scheduled",
        stage: "created",
        eta: "Jun 13, 2026 · 8:00 PM",
        customer: {
            name: "Mike Test",
            phone: "+971 52 977 5990",
            address: "Sheikh Zayed Road, Downtown, Dubai, United Arab Emirates",
            building: "8",
            floor: "12",
            unit: "1204",
        },
        pickupLocation: "MOE — Mall of the Emirates Hub",
        isScheduled: true,
        scheduledPickup: "Jun 13, 2026 · 7:00 PM – 8:00 PM",
        scheduledDelivery: "Jun 13, 2026 · 8:00 PM – 9:00 PM",
        boxes: [{ size: "Large", count: 1 }],
        temperature: "Ambient",
        deliverInPerson: true,
        proofOfDelivery: true,
        codAmount: 250,
        trackingUrl: "https://track.comet.ae/o/5-1321",
    },
    "1": {
        id: "1",
        ref: "h1",
        status: "delivered",
        statusLabel: "Delivered",
        stage: "delivered",
        eta: "Jun 9, 2026 · 2:55 PM",
        customer: {
            name: "Mike Test",
            phone: "+971 52 977 5991",
            address: "Jumeirah Beach Residence, Dubai, United Arab Emirates",
            building: "JBR-3",
            floor: "9",
            unit: "904",
        },
        pickupLocation: "MOE — Mall of the Emirates Hub",
        isScheduled: true,
        scheduledPickup: "Jun 9, 2026 · 1:00 PM – 2:00 PM",
        scheduledDelivery: "Jun 9, 2026 · 2:30 PM – 3:00 PM",
        boxes: [
            { size: "Medium", count: 1 },
            { size: "Large", count: 1 },
        ],
        temperature: "Dry",
        deliverInPerson: true,
        proofOfDelivery: true,
        trackingUrl: "https://track.comet.ae/o/1-h1",
    },
};

const STAGE_ORDER: Stage[] = ["created", "pickup", "in_transit", "out_for_delivery", "delivered"];
const STAGE_LABEL: Record<Stage, string> = {
    created: "Created",
    pickup: "Picked up",
    in_transit: "In transit",
    out_for_delivery: "Out for delivery",
    delivered: "Delivered",
};

const STATUS_BADGE: Record<Detail["status"], { color: "warning" | "success" | "blue" | "gray" }> = {
    in_progress: { color: "warning" },
    delivered: { color: "success" },
    scheduled: { color: "blue" },
    cancelled: { color: "gray" },
};

function fallback(id: string): Detail {
    return {
        id,
        ref: "unknown",
        status: "scheduled",
        statusLabel: "Scheduled",
        stage: "created",
        eta: "—",
        customer: { name: "Unknown customer", phone: "—", address: "—", building: "—", floor: "—", unit: "—" },
        pickupLocation: "—",
        isScheduled: false,
        scheduledPickup: "—",
        scheduledDelivery: "—",
        boxes: [],
        temperature: "Ambient",
        deliverInPerson: false,
        proofOfDelivery: false,
        trackingUrl: "https://track.comet.ae/o/" + id,
    };
}

const ProgressTracker = ({ stage }: { stage: Stage }) => {
    const currentIndex = STAGE_ORDER.indexOf(stage);
    return (
        <div className="flex w-full items-center gap-2">
            {STAGE_ORDER.map((s, i) => {
                const state = i < currentIndex ? "done" : i === currentIndex ? "current" : "pending";
                return (
                    <div key={s} className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <div
                            className={cx(
                                "h-1.5 rounded-full",
                                state === "done" && "bg-brand-solid",
                                state === "current" && "animate-pulse bg-brand-solid",
                                state === "pending" && "bg-quaternary",
                            )}
                        />
                        <span
                            className={cx(
                                "truncate text-xs font-medium",
                                state === "pending" ? "text-quaternary" : "text-secondary",
                            )}
                        >
                            {STAGE_LABEL[s]}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

const COUNTRY_CODES = [
    { id: "+971", label: "+971" },
    { id: "+966", label: "+966" },
    { id: "+965", label: "+965" },
    { id: "+974", label: "+974" },
    { id: "+973", label: "+973" },
];

function splitPhone(phone: string): { code: string; number: string } {
    const m = phone.match(/^(\+\d{1,4})\s*(.*)$/);
    if (m) return { code: m[1], number: m[2].replace(/\s+/g, "") };
    return { code: "+971", number: phone.replace(/\s+/g, "") };
}

const EditCustomerDialog = ({ order }: { order: Detail }) => {
    const initial = splitPhone(order.customer.phone);
    const [name, setName] = useState(order.customer.name);
    const [code, setCode] = useState<string>(initial.code);
    const [number, setNumber] = useState(initial.number);

    return (
        <Dialog>
            <DialogTrigger
                render={(props) => (
                    <Button {...props} color="tertiary" size="sm" iconLeading={Edit01}>
                        Edit customer
                    </Button>
                )}
            />
            <DialogPopup className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Ref id: <span className="text-brand-secondary">{order.ref}</span>
                    </DialogTitle>
                </DialogHeader>
                <DialogPanel className="flex flex-col gap-4">
                    <Input
                        label="Customer name"
                        value={name}
                        onChange={setName}
                        placeholder="Enter customer name"
                    />
                    <div className="flex gap-2">
                        <Select
                            aria-label="Country code"
                            label="Country code"
                            size="md"
                            items={COUNTRY_CODES}
                            selectedKey={code}
                            onSelectionChange={(k) => setCode(String(k))}
                            className="w-32"
                        >
                            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                        </Select>
                        <Input
                            label="Customer contact #"
                            value={number}
                            onChange={setNumber}
                            placeholder="529775990"
                            className="flex-1"
                        />
                    </div>
                </DialogPanel>
                <DialogFooter className="flex-row justify-end gap-3">
                    <DialogClose
                        render={(props) => (
                            <Button {...props} color="secondary" size="md">
                                Cancel
                            </Button>
                        )}
                    />
                    <DialogClose
                        render={(props) => (
                            <Button {...props} color="primary" size="md">
                                Submit
                            </Button>
                        )}
                    />
                </DialogFooter>
            </DialogPopup>
        </Dialog>
    );
};

const EditOrderDialog = ({ order }: { order: Detail }) => {
    const [refId, setRefId] = useState(order.ref);
    const [pod, setPod] = useState(order.proofOfDelivery);
    const [inPerson, setInPerson] = useState(order.deliverInPerson);
    const [collectPayment, setCollectPayment] = useState(typeof order.codAmount === "number");

    return (
        <Dialog>
            <DialogTrigger
                render={(props) => (
                    <Button {...props} color="tertiary" size="sm" iconLeading={Edit01}>
                        Edit order
                    </Button>
                )}
            />
            <DialogPopup className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-brand-secondary">Order details</DialogTitle>
                </DialogHeader>
                <DialogPanel className="flex flex-col gap-3">
                    <Input
                        label="Enter Company Reference ID"
                        value={refId}
                        onChange={setRefId}
                        placeholder="Reference ID"
                    />

                    <ToggleCard
                        title="Require a proof of delivery"
                        description="(In person = signature) or (drop-off = picture)"
                        isSelected={pod}
                        onChange={setPod}
                    />

                    <ToggleCard
                        title="Try to deliver in person"
                        description="Only delivery to a person will be accepted"
                        isSelected={inPerson}
                        onChange={setInPerson}
                    />

                    <label className="flex items-start justify-between gap-4 rounded-xl border border-secondary bg-primary p-4 shadow-xs has-[:checked]:border-brand">
                        <div className="flex min-w-0 flex-col gap-1">
                            <span className="text-sm font-semibold text-primary">Collect payment</span>
                            <span className="text-xs text-tertiary">(Payment will be collected from customer)</span>
                        </div>
                        <Checkbox isSelected={collectPayment} onChange={setCollectPayment} aria-label="Collect payment" />
                    </label>
                </DialogPanel>
                <DialogFooter className="flex-row justify-end gap-3">
                    <DialogClose
                        render={(props) => (
                            <Button {...props} color="secondary" size="md">
                                Cancel changes
                            </Button>
                        )}
                    />
                    <DialogClose
                        render={(props) => (
                            <Button {...props} color="primary" size="md">
                                Save changes
                            </Button>
                        )}
                    />
                </DialogFooter>
            </DialogPopup>
        </Dialog>
    );
};

const ToggleCard = ({
    title,
    description,
    isSelected,
    onChange,
}: {
    title: string;
    description: string;
    isSelected: boolean;
    onChange: (v: boolean) => void;
}) => (
    <div
        className={cx(
            "flex items-start justify-between gap-4 rounded-xl border bg-primary p-4 shadow-xs transition-colors",
            isSelected ? "border-brand" : "border-secondary",
        )}
    >
        <div className="flex min-w-0 flex-col gap-1">
            <span className="text-sm font-semibold text-primary">{title}</span>
            <span className="text-xs text-tertiary">{description}</span>
        </div>
        <Toggle aria-label={title} isSelected={isSelected} onChange={onChange} />
    </div>
);

const Section = ({
    title,
    action,
    children,
}: {
    title: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}) => (
    <section className="flex flex-col gap-4 rounded-xl border border-secondary bg-primary p-5 shadow-xs">
        <div className="flex items-center justify-between gap-3">
            <h2 className="text-md font-semibold text-primary">{title}</h2>
            {action}
        </div>
        {children}
    </section>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-tertiary">{label}</span>
        <span className="text-sm text-primary">{children}</span>
    </div>
);

const InlineCard = ({
    icon: Icon,
    title,
    value,
    valueColor = "gray",
}: {
    icon: React.FC<{ className?: string }>;
    title: string;
    value: string;
    valueColor?: "gray" | "success" | "warning";
}) => (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-secondary bg-primary px-5 py-4 shadow-xs">
        <div className="flex items-center gap-3">
            <FeaturedIcon icon={Icon} color="gray" theme="modern" size="sm" />
            <span className="text-sm font-medium text-primary">{title}</span>
        </div>
        <Badge color={valueColor} type="pill-color" size="sm">
            {value}
        </Badge>
    </div>
);

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const order = ORDERS[id] ?? fallback(id);
    const { copied, copy } = useClipboard();
    const isTrackingCopied = copied === "tracking";

    return (
        <div className="flex flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
            <Button color="link-gray" size="md" iconLeading={ArrowLeft} href="/orders">
                Back to orders
            </Button>

            {/* Header */}
            <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold tracking-wider text-tertiary uppercase">
                        Order #{order.id}
                    </span>
                    <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">
                        Ref. <span className="text-brand-secondary">#{order.ref.toUpperCase()}</span>
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-tertiary">Status</span>
                        <BadgeWithDot color={STATUS_BADGE[order.status].color} type="pill-color" size="md">
                            {order.statusLabel}
                        </BadgeWithDot>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button color="secondary" size="md" iconLeading={Download01}>
                        Download delivery label
                    </Button>
                    <Button color="primary-destructive" size="md" iconLeading={XClose}>
                        Cancel order
                    </Button>
                </div>
            </header>

            {/* Status banner */}
            <div className="relative flex flex-col gap-5 overflow-hidden rounded-2xl bg-brand-secondary p-6">
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold tracking-wider text-brand-secondary uppercase">
                        Estimated delivery
                    </span>
                    <span className="text-lg font-semibold text-primary">{order.eta}</span>
                </div>
                <ProgressTracker stage={order.stage} />
                <Truck01
                    aria-hidden="true"
                    className="absolute -top-2 -right-4 size-32 text-brand-tertiary opacity-30 md:opacity-50"
                />
            </div>

            {/* Two column body */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="flex flex-col gap-6 lg:col-span-2">
                    {/* Location details */}
                    <Section
                        title="Location & customer"
                        action={<EditCustomerDialog order={order} />}
                    >
                        <Field label="Pickup location">
                            <span className="flex items-center gap-2">
                                <MarkerPin01 className="size-4 text-fg-quaternary" aria-hidden="true" />
                                {order.pickupLocation}
                            </span>
                        </Field>

                        <div className="h-px w-full bg-border-secondary" />

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Customer name">
                                <span className="flex items-center gap-2">
                                    <User01 className="size-4 text-fg-quaternary" aria-hidden="true" />
                                    {order.customer.name}
                                </span>
                            </Field>
                            <Field label="Customer phone">
                                <span className="flex items-center gap-2">
                                    <Phone className="size-4 text-fg-quaternary" aria-hidden="true" />
                                    {order.customer.phone}
                                </span>
                            </Field>
                        </div>

                        <Field label="Address">{order.customer.address}</Field>

                        <div className="grid grid-cols-3 gap-4">
                            <Field label="Building">{order.customer.building}</Field>
                            <Field label="Floor">{order.customer.floor}</Field>
                            <Field label="Unit">{order.customer.unit}</Field>
                        </div>

                        {order.customer.note && (
                            <div className="rounded-lg border border-secondary bg-secondary_subtle p-3">
                                <span className="text-xs font-semibold text-tertiary">Customer note</span>
                                <p className="mt-1 text-sm text-secondary">{order.customer.note}</p>
                            </div>
                        )}
                    </Section>

                    {/* Order details */}
                    <Section
                        title="Order details"
                        action={<EditOrderDialog order={order} />}
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Scheduled">
                                <Badge color={order.isScheduled ? "success" : "gray"} type="pill-color" size="sm">
                                    {order.isScheduled ? "Yes" : "No"}
                                </Badge>
                            </Field>
                            <Field label="Temperature">
                                <span className="flex items-center gap-2">
                                    <Thermometer01 className="size-4 text-fg-quaternary" aria-hidden="true" />
                                    {order.temperature}
                                </span>
                            </Field>
                            <Field label="Scheduled pickup">{order.scheduledPickup}</Field>
                            <Field label="Scheduled delivery">{order.scheduledDelivery}</Field>
                        </div>

                        <div className="h-px w-full bg-border-secondary" />

                        <Field label="Boxes">
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                                {order.boxes.length === 0 ? (
                                    <span className="text-sm text-tertiary">No boxes</span>
                                ) : (
                                    order.boxes.map((b) => (
                                        <span
                                            key={b.size}
                                            className="flex items-center gap-1.5 rounded-md border border-secondary px-2 py-1 text-xs font-medium text-secondary"
                                        >
                                            <Package className="size-3.5 text-fg-quaternary" aria-hidden="true" />
                                            {b.count} × {b.size}
                                        </span>
                                    ))
                                )}
                            </div>
                        </Field>

                        {typeof order.codAmount === "number" && (
                            <Field label="Cash on delivery">
                                <span className="inline-flex items-center gap-1 font-semibold">
                                    <CurrencyIcon className="size-3.5 text-fg-quaternary" />
                                    {order.codAmount.toFixed(2)}
                                </span>
                            </Field>
                        )}
                    </Section>

                    {/* Delivery options — combines in-person + POD */}
                    <Section title="Delivery options">
                        <div className="grid gap-3 sm:grid-cols-2">
                            <InlineCard
                                icon={User01}
                                title="Deliver in person"
                                value={order.deliverInPerson ? "Required" : "Not required"}
                                valueColor={order.deliverInPerson ? "success" : "gray"}
                            />
                            <InlineCard
                                icon={Check}
                                title="Proof of delivery"
                                value={order.proofOfDelivery ? "Required" : "Not required"}
                                valueColor={order.proofOfDelivery ? "success" : "gray"}
                            />
                        </div>
                    </Section>
                </div>

                {/* Right column — Order tracking */}
                <div className="flex flex-col gap-6">
                    <Section title="Order tracking">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-sm font-medium text-secondary">Shareable tracking link</span>
                            <div className="flex w-full items-center gap-2 rounded-lg border border-secondary bg-secondary_subtle px-3 py-2">
                                <code
                                    className="min-w-0 flex-1 truncate font-mono text-sm text-secondary"
                                    title={order.trackingUrl}
                                    aria-label="Shareable tracking link"
                                >
                                    {order.trackingUrl}
                                </code>
                                <Button
                                    size="sm"
                                    color="secondary"
                                    iconLeading={isTrackingCopied ? Check : Copy01}
                                    onClick={() => copy(order.trackingUrl, "tracking")}
                                    className={cx("shrink-0", isTrackingCopied && "text-success-primary")}
                                >
                                    {isTrackingCopied ? "Copied" : "Copy"}
                                </Button>
                            </div>
                        </div>

                        <Button color="secondary" size="md" iconLeading={RefreshCw01}>
                            Resend to customer
                        </Button>

                        {/* Map placeholder */}
                        <div className="relative flex h-72 w-full items-center justify-center overflow-hidden rounded-lg border border-secondary bg-secondary_subtle">
                            <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(var(--color-border-secondary)_1px,transparent_1px),linear-gradient(90deg,var(--color-border-secondary)_1px,transparent_1px)] [background-size:32px_32px]" />
                            <div className="absolute top-8 left-10 flex flex-col items-center gap-1">
                                <FeaturedIcon icon={MarkerPin01} color="brand" theme="dark" size="sm" />
                                <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-secondary shadow-xs">
                                    Pickup
                                </span>
                            </div>
                            <div className="absolute right-12 bottom-16 flex flex-col items-center gap-1">
                                <FeaturedIcon icon={MarkerPin01} color="success" theme="dark" size="sm" />
                                <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-secondary shadow-xs">
                                    Drop-off
                                </span>
                            </div>
                            <span className="relative z-10 rounded-full bg-primary/80 px-3 py-1 text-xs font-medium text-tertiary shadow-xs backdrop-blur">
                                Live map preview
                            </span>
                        </div>
                    </Section>
                </div>
            </div>
        </div>
    );
}
