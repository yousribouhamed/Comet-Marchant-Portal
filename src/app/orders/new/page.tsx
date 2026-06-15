"use client";

import { useEffect, useRef, useState } from "react";
import {
    ArrowLeft,
    Calendar,
    Check,
    CreditCard01,
    FileCheck02,
    Hash01,
    MarkerPin01,
    Minus,
    Package,
    Phone,
    Plus,
    Save01,
    Thermometer01,
    User01,
    XClose,
} from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { TextArea } from "@/components/base/textarea/textarea";
import { Toggle } from "@/components/base/toggle/toggle";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { CurrencyIcon } from "@/components/foundations/currency-icon";
import { cx } from "@/utils/cx";

type StepId = "recipient" | "dropoff" | "pickup" | "schedule" | "boxes" | "options" | "reference";

const STEPS: { id: StepId; label: string }[] = [
    { id: "recipient", label: "Recipient" },
    { id: "dropoff", label: "Drop-off address" },
    { id: "pickup", label: "Pickup" },
    { id: "schedule", label: "Schedule" },
    { id: "boxes", label: "Boxes & cargo" },
    { id: "options", label: "Delivery options" },
    { id: "reference", label: "Reference" },
];

const COUNTRY_CODES = [
    { id: "+971", label: "+971" },
    { id: "+966", label: "+966" },
    { id: "+965", label: "+965" },
    { id: "+973", label: "+973" },
    { id: "+974", label: "+974" },
];

const WAREHOUSES = [
    { id: "moe", label: "MOE — Mall of the Emirates Hub" },
    { id: "jbr", label: "JBR — Jumeirah Beach Residence" },
    { id: "downtown", label: "Downtown Dubai" },
];

const TEMPERATURES = [
    { id: "ambient", label: "Ambient" },
    { id: "dry", label: "Dry" },
    { id: "chilled", label: "Chilled" },
    { id: "frozen", label: "Frozen" },
];

const TIME_WINDOWS = [
    { id: "9-11", label: "9:00 AM – 11:00 AM" },
    { id: "11-13", label: "11:00 AM – 1:00 PM" },
    { id: "13-15", label: "1:00 PM – 3:00 PM" },
    { id: "15-17", label: "3:00 PM – 5:00 PM" },
    { id: "17-19", label: "5:00 PM – 7:00 PM" },
    { id: "19-21", label: "7:00 PM – 9:00 PM" },
];

const Section = ({
    id,
    title,
    subtitle,
    icon: Icon,
    children,
}: {
    id: StepId;
    title: string;
    subtitle: string;
    icon: React.FC<{ className?: string }>;
    children: React.ReactNode;
}) => (
    <section id={id} className="scroll-mt-24 rounded-2xl border border-secondary bg-primary p-6 shadow-xs">
        <header className="mb-5 flex items-start gap-3">
            <FeaturedIcon icon={Icon} color="gray" theme="modern" size="md" />
            <div className="flex flex-col gap-0.5">
                <h2 className="text-md font-semibold text-primary">{title}</h2>
                <p className="text-sm text-tertiary">{subtitle}</p>
            </div>
        </header>
        <div className="flex flex-col gap-4">{children}</div>
    </section>
);

const Stepper = ({
    activeId,
    onSelect,
    completed,
}: {
    activeId: StepId;
    onSelect: (id: StepId) => void;
    completed: Set<StepId>;
}) => (
    <nav aria-label="Form sections" className="flex flex-col gap-1">
        {STEPS.map((step, i) => {
            const done = completed.has(step.id);
            const active = step.id === activeId;
            return (
                <button
                    key={step.id}
                    type="button"
                    onClick={() => onSelect(step.id)}
                    className={cx(
                        "group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left transition duration-100 ease-linear",
                        active ? "bg-secondary_subtle" : "hover:bg-primary_hover",
                    )}
                >
                    <span
                        className={cx(
                            "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                            done && "bg-brand-solid text-white",
                            !done && active && "bg-brand-solid text-white",
                            !done && !active && "bg-secondary text-tertiary",
                        )}
                    >
                        {done ? <Check className="size-3.5" aria-hidden="true" /> : i + 1}
                    </span>
                    <span
                        className={cx(
                            "text-sm font-medium",
                            active ? "text-primary" : "text-secondary",
                        )}
                    >
                        {step.label}
                    </span>
                </button>
            );
        })}
    </nav>
);

const Counter = ({
    label,
    value,
    onChange,
    description,
}: {
    label: string;
    value: number;
    onChange: (n: number) => void;
    description?: string;
}) => (
    <div className="flex items-center justify-between rounded-xl border border-secondary bg-primary p-4">
        <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-primary">{label}</span>
            {description && <span className="text-xs text-tertiary">{description}</span>}
        </div>
        <div className="flex items-center gap-2">
            <Button
                size="sm"
                color="tertiary"
                iconLeading={Minus}
                aria-label={`Decrease ${label}`}
                isDisabled={value === 0}
                onClick={() => onChange(Math.max(0, value - 1))}
            />
            <span className="w-8 text-center text-sm font-semibold tabular-nums text-primary">{value}</span>
            <Button
                size="sm"
                color="tertiary"
                iconLeading={Plus}
                aria-label={`Increase ${label}`}
                onClick={() => onChange(value + 1)}
            />
        </div>
    </div>
);

export default function CreateOrderPage() {
    const [active, setActive] = useState<StepId>("recipient");

    // Recipient
    const [name, setName] = useState("");
    const [code, setCode] = useState("+971");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    // Drop-off
    const [address, setAddress] = useState("");
    const [building, setBuilding] = useState("");
    const [floor, setFloor] = useState("");
    const [unit, setUnit] = useState("");
    const [city, setCity] = useState("");
    const [note, setNote] = useState("");

    // Pickup + schedule
    const [pickup, setPickup] = useState("moe");
    const [pickupDate, setPickupDate] = useState("");
    const [pickupWindow, setPickupWindow] = useState("9-11");
    const [deliveryDate, setDeliveryDate] = useState("");
    const [deliveryWindow, setDeliveryWindow] = useState("11-13");

    // Boxes
    const [sBoxes, setSBoxes] = useState(0);
    const [mBoxes, setMBoxes] = useState(0);
    const [lBoxes, setLBoxes] = useState(1);
    const [temperature, setTemperature] = useState("ambient");

    // Options
    const [pod, setPod] = useState(false);
    const [inPerson, setInPerson] = useState(false);
    const [collectPayment, setCollectPayment] = useState(false);
    const [codAmount, setCodAmount] = useState("");

    // Reference
    const [refId, setRefId] = useState("");
    const [internalNote, setInternalNote] = useState("");

    // Track which steps are "done" by simple non-empty heuristic
    const completed = new Set<StepId>();
    if (name && phone.length >= 6) completed.add("recipient");
    if (address && city) completed.add("dropoff");
    if (pickup) completed.add("pickup");
    if (pickupDate && deliveryDate) completed.add("schedule");
    if (sBoxes + mBoxes + lBoxes > 0) completed.add("boxes");
    if (refId) completed.add("reference");

    // Scrollspy
    const rootRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const sections = STEPS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
        if (!sections.length) return;
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible[0]) setActive(visible[0].target.id as StepId);
            },
            { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.3, 0.6, 1] },
        );
        sections.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const goToStep = (id: StepId) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const totalBoxes = sBoxes + mBoxes + lBoxes;
    const canSubmit = name && phone && address && city && pickupDate && deliveryDate && totalBoxes > 0;

    return (
        <div ref={rootRef} className="flex min-h-svh flex-col">
            {/* Header */}
            <header className="flex flex-col gap-4 px-4 pt-6 pb-4 md:px-8 md:pt-8">
                <Button color="link-gray" size="md" iconLeading={ArrowLeft} href="/orders">
                    Back to orders
                </Button>
                <div className="flex flex-col gap-1">
                    <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">Create order</h1>
                    <p className="text-md text-tertiary">
                        Add a new pickup and delivery. All sections marked with a tick are complete.
                    </p>
                </div>
            </header>

            {/* Body */}
            <div className="flex-1 px-4 pb-32 md:px-8">
                <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
                    {/* Stepper */}
                    <aside className="lg:sticky lg:top-24 lg:self-start">
                        <Stepper activeId={active} onSelect={goToStep} completed={completed} />
                    </aside>

                    {/* Form */}
                    <div className="flex flex-col gap-6">
                        {/* Recipient */}
                        <Section
                            id="recipient"
                            title="Recipient"
                            subtitle="Who's receiving this order?"
                            icon={User01}
                        >
                            <Input
                                label="Customer name"
                                placeholder="e.g. Mike Test"
                                value={name}
                                onChange={setName}
                                isRequired
                            />
                            <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
                                <Select
                                    aria-label="Country code"
                                    label="Country code"
                                    items={COUNTRY_CODES}
                                    selectedKey={code}
                                    onSelectionChange={(k) => setCode(String(k))}
                                >
                                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                </Select>
                                <Input
                                    label="Phone number"
                                    placeholder="529775990"
                                    value={phone}
                                    onChange={setPhone}
                                    icon={Phone}
                                    isRequired
                                />
                            </div>
                            <Input
                                label="Email (optional)"
                                placeholder="customer@example.com"
                                value={email}
                                onChange={setEmail}
                                type="email"
                            />
                        </Section>

                        {/* Drop-off */}
                        <Section
                            id="dropoff"
                            title="Drop-off address"
                            subtitle="Where the package will be delivered."
                            icon={MarkerPin01}
                        >
                            <Input
                                label="Address line"
                                placeholder="Al Khail Gate, Al Quoz Industrial 2"
                                value={address}
                                onChange={setAddress}
                                isRequired
                            />
                            <div className="grid gap-4 sm:grid-cols-3">
                                <Input label="Building" placeholder="12" value={building} onChange={setBuilding} />
                                <Input label="Floor" placeholder="17" value={floor} onChange={setFloor} />
                                <Input label="Unit" placeholder="1705" value={unit} onChange={setUnit} />
                            </div>
                            <Input label="City / Area" placeholder="Dubai" value={city} onChange={setCity} isRequired />
                            <TextArea
                                label="Customer note (optional)"
                                placeholder="e.g. Please call 15 minutes before arrival."
                                rows={3}
                                value={note}
                                onChange={setNote}
                            />
                        </Section>

                        {/* Pickup */}
                        <Section
                            id="pickup"
                            title="Pickup"
                            subtitle="Which warehouse should the courier collect from?"
                            icon={Package}
                        >
                            <Select
                                aria-label="Pickup warehouse"
                                label="Pickup warehouse"
                                items={WAREHOUSES}
                                selectedKey={pickup}
                                onSelectionChange={(k) => setPickup(String(k))}
                            >
                                {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                            </Select>
                        </Section>

                        {/* Schedule */}
                        <Section
                            id="schedule"
                            title="Schedule"
                            subtitle="When should we pick up and deliver?"
                            icon={Calendar}
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Input
                                    label="Pickup date"
                                    type="date"
                                    value={pickupDate}
                                    onChange={setPickupDate}
                                    isRequired
                                />
                                <Select
                                    aria-label="Pickup time window"
                                    label="Pickup time window"
                                    items={TIME_WINDOWS}
                                    selectedKey={pickupWindow}
                                    onSelectionChange={(k) => setPickupWindow(String(k))}
                                >
                                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                </Select>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Input
                                    label="Delivery date"
                                    type="date"
                                    value={deliveryDate}
                                    onChange={setDeliveryDate}
                                    isRequired
                                />
                                <Select
                                    aria-label="Delivery time window"
                                    label="Delivery time window"
                                    items={TIME_WINDOWS}
                                    selectedKey={deliveryWindow}
                                    onSelectionChange={(k) => setDeliveryWindow(String(k))}
                                >
                                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                </Select>
                            </div>
                        </Section>

                        {/* Boxes & cargo */}
                        <Section
                            id="boxes"
                            title="Boxes & cargo"
                            subtitle="How many boxes and what storage temperature?"
                            icon={Package}
                        >
                            <div className="grid gap-3 sm:grid-cols-3">
                                <Counter
                                    label="Small"
                                    description="Up to 30×30×30 cm"
                                    value={sBoxes}
                                    onChange={setSBoxes}
                                />
                                <Counter
                                    label="Medium"
                                    description="Up to 50×50×50 cm"
                                    value={mBoxes}
                                    onChange={setMBoxes}
                                />
                                <Counter
                                    label="Large"
                                    description="Above 50×50×50 cm"
                                    value={lBoxes}
                                    onChange={setLBoxes}
                                />
                            </div>
                            <Select
                                aria-label="Temperature"
                                label="Storage temperature"
                                items={TEMPERATURES}
                                selectedKey={temperature}
                                onSelectionChange={(k) => setTemperature(String(k))}
                                icon={Thermometer01}
                            >
                                {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                            </Select>
                        </Section>

                        {/* Delivery options */}
                        <Section
                            id="options"
                            title="Delivery options"
                            subtitle="Proof of delivery, in-person handover, and cash-on-delivery."
                            icon={FileCheck02}
                        >
                            <ToggleRow
                                title="Require proof of delivery"
                                description="Signature for in-person handoff or photo for drop-off."
                                isSelected={pod}
                                onChange={setPod}
                            />
                            <ToggleRow
                                title="Deliver in person"
                                description="Only handover to the named recipient will be accepted."
                                isSelected={inPerson}
                                onChange={setInPerson}
                            />
                            <ToggleRow
                                title="Collect payment (cash on delivery)"
                                description="Courier collects the amount from the customer."
                                isSelected={collectPayment}
                                onChange={setCollectPayment}
                            >
                                {collectPayment && (
                                    <div className="mt-3">
                                        <Input
                                            label="Amount to collect"
                                            placeholder="0.00"
                                            value={codAmount}
                                            onChange={setCodAmount}
                                            icon={CurrencyIcon}
                                            inputMode="decimal"
                                        />
                                    </div>
                                )}
                            </ToggleRow>
                        </Section>

                        {/* Reference */}
                        <Section
                            id="reference"
                            title="Reference"
                            subtitle="Your company's internal identifiers for this order."
                            icon={Hash01}
                        >
                            <Input
                                label="Company reference ID"
                                placeholder="e.g. RF-2026-118"
                                value={refId}
                                onChange={setRefId}
                                isRequired
                            />
                            <TextArea
                                label="Internal note (optional)"
                                placeholder="Visible only to your team."
                                rows={3}
                                value={internalNote}
                                onChange={setInternalNote}
                            />
                        </Section>
                    </div>
                </div>
            </div>

            {/* Sticky footer action bar */}
            <footer className="sticky bottom-0 z-20 mt-6 flex flex-col gap-3 border-t border-secondary bg-primary/95 px-4 py-4 backdrop-blur md:flex-row md:items-center md:justify-between md:px-8">
                <div className="flex items-center gap-3 text-sm text-tertiary">
                    <Badge color="gray" type="modern" size="md">
                        {totalBoxes} {totalBoxes === 1 ? "box" : "boxes"}
                    </Badge>
                    {collectPayment && codAmount && (
                        <Badge color="warning" type="pill-color" size="md">
                            COD: <CurrencyIcon className="size-3" /> {codAmount}
                        </Badge>
                    )}
                    <span className="hidden md:inline">
                        {completed.size} of {STEPS.length} sections complete
                    </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button color="link-destructive" size="md" iconLeading={XClose} href="/orders">
                        Discard
                    </Button>
                    <Button color="secondary" size="md" iconLeading={Save01}>
                        Save draft
                    </Button>
                    <Button color="primary" size="md" iconLeading={Check} isDisabled={!canSubmit}>
                        Create order
                    </Button>
                </div>
            </footer>
        </div>
    );
}

const ToggleRow = ({
    title,
    description,
    isSelected,
    onChange,
    children,
}: {
    title: string;
    description: string;
    isSelected: boolean;
    onChange: (v: boolean) => void;
    children?: React.ReactNode;
}) => (
    <div
        className={cx(
            "rounded-xl border p-4 transition-colors",
            isSelected ? "border-brand bg-secondary_subtle" : "border-secondary bg-primary",
        )}
    >
        <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-sm font-semibold text-primary">{title}</span>
                <span className="text-xs text-tertiary">{description}</span>
            </div>
            <Toggle aria-label={title} isSelected={isSelected} onChange={onChange} />
        </div>
        {children}
    </div>
);
