"use client";

import { useMemo, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Building02,
    Check,
    InfoCircle,
    MarkerPin01,
    Minus,
    Package,
    Plus,
    Snowflake01,
    Thermometer01,
    Trash01,
    Users01,
} from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { TextArea } from "@/components/base/textarea/textarea";
import { Toggle } from "@/components/base/toggle/toggle";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import {
    Drawer,
    DrawerClose,
    DrawerFooter,
    DrawerHeader,
    DrawerPanel,
    DrawerPopup,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { cx } from "@/utils/cx";

// ----------------------------------------------------------------------------- types
type Temperature = "ambient" | "dry" | "chilled" | "frozen";
type BoxSize = "s" | "m" | "l";

type Service = {
    id: string;
    name: string;
    description: string;
    temperature: Temperature;
    sizes: BoxSize[];
};

type Recipient = {
    id: string;
    name: string;
    phone: string;
    email?: string;
    addressType: "building" | "tower" | "commercial";
    city: string;
    address: string;
    floor?: string;
    unit?: string;
    notes?: string;
    dontContact: boolean;
};

const SERVICES: Service[] = [
    { id: "bulk", name: "Bulk delivery", description: "Standard multi-drop delivery for everyday parcels.", temperature: "dry", sizes: ["s", "m", "l"] },
    { id: "bulk-2", name: "Bulk express", description: "Priority same-day handling across the city.", temperature: "ambient", sizes: ["s", "m", "l"] },
    { id: "sub-22", name: "Subscription route", description: "Recurring scheduled drops for subscription customers.", temperature: "ambient", sizes: ["m", "l"] },
];

const TEMP_META: Record<Temperature, { label: string; color: "gray" | "blue" | "sky" | "indigo"; icon: typeof Thermometer01 }> = {
    ambient: { label: "Ambient", color: "blue", icon: Thermometer01 },
    dry: { label: "Dry", color: "gray", icon: Package },
    chilled: { label: "Chilled", color: "sky", icon: Snowflake01 },
    frozen: { label: "Frozen", color: "indigo", icon: Snowflake01 },
};

const SIZE_LABEL: Record<BoxSize, string> = { s: "Small", m: "Medium", l: "Large" };
const PICKUP_LOCATIONS = [
    { id: "moe", label: "MOE — Mall of the Emirates Hub" },
    { id: "dso", label: "DSO — Dubai Silicon Oasis Hub" },
    { id: "jbr", label: "JBR — Jumeirah Beach Hub" },
];
const COUNTRY_CODES = [
    { id: "+971", label: "+971" },
    { id: "+966", label: "+966" },
    { id: "+965", label: "+965" },
];

const STEPS = ["Order details", "Service & boxes", "Recipients", "Review"] as const;
const MIN_RECIPIENTS = 2;

// ----------------------------------------------------------------------------- stepper
const Stepper = ({ current, onStep }: { current: number; onStep: (i: number) => void }) => (
    <nav aria-label="Progress" className="flex items-center">
        {STEPS.map((label, i) => {
            const state = i < current ? "done" : i === current ? "current" : "upcoming";
            return (
                <div key={label} className="flex flex-1 items-center last:flex-none">
                    <button
                        type="button"
                        disabled={i > current}
                        onClick={() => i < current && onStep(i)}
                        className="flex items-center gap-2.5 disabled:cursor-default"
                    >
                        <span
                            className={cx(
                                "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition",
                                state === "done" && "bg-brand-solid text-white",
                                state === "current" && "bg-brand-solid text-white ring-4 ring-brand-secondary",
                                state === "upcoming" && "bg-secondary text-tertiary",
                            )}
                        >
                            {state === "done" ? <Check className="size-4" /> : i + 1}
                        </span>
                        <span
                            className={cx(
                                "hidden text-sm font-semibold whitespace-nowrap sm:inline",
                                state === "upcoming" ? "text-tertiary" : "text-primary",
                            )}
                        >
                            {label}
                        </span>
                    </button>
                    {i < STEPS.length - 1 && (
                        <span className={cx("mx-3 h-0.5 flex-1 rounded-full", i < current ? "bg-brand-solid" : "bg-border-secondary")} />
                    )}
                </div>
            );
        })}
    </nav>
);

// ----------------------------------------------------------------------------- shared bits
const Card = ({ title, description, children, className }: { title: string; description?: string; children: React.ReactNode; className?: string }) => (
    <section className={cx("flex flex-col gap-5 rounded-xl border border-secondary bg-primary p-5 shadow-xs", className)}>
        <div className="flex flex-col gap-0.5">
            <h2 className="text-md font-semibold text-primary">{title}</h2>
            {description && <p className="text-sm text-tertiary">{description}</p>}
        </div>
        {children}
    </section>
);

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
    <div className={cx("flex items-start justify-between gap-4 rounded-xl border bg-primary p-4 transition-colors", isSelected ? "border-brand" : "border-secondary")}>
        <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-sm font-semibold text-primary">{title}</span>
            <span className="text-xs text-tertiary">{description}</span>
        </div>
        <Toggle aria-label={title} isSelected={isSelected} onChange={onChange} />
    </div>
);

const Counter = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-secondary bg-primary px-3 py-2.5">
        <div className="flex items-center gap-2">
            <Package className="size-4 text-fg-quaternary" aria-hidden="true" />
            <span className="text-sm font-medium text-secondary">{label}</span>
        </div>
        <div className="flex items-center gap-1">
            <Button color="secondary" size="sm" iconLeading={Minus} aria-label={`Decrease ${label}`} isDisabled={value <= 0} onClick={() => onChange(Math.max(0, value - 1))} />
            <span className="w-8 text-center text-sm font-semibold tabular-nums text-primary">{value}</span>
            <Button color="secondary" size="sm" iconLeading={Plus} aria-label={`Increase ${label}`} onClick={() => onChange(value + 1)} />
        </div>
    </div>
);

// ----------------------------------------------------------------------------- recipient drawer
const emptyDraft = (): Omit<Recipient, "id"> => ({
    name: "",
    phone: "",
    email: "",
    addressType: "building",
    city: "",
    address: "",
    floor: "",
    unit: "",
    notes: "",
    dontContact: false,
});

const AddRecipientDrawer = ({ onAdd }: { onAdd: (r: Recipient) => void }) => {
    const [open, setOpen] = useState(false);
    const [code, setCode] = useState("+971");
    const [draft, setDraft] = useState(emptyDraft());
    const set = <K extends keyof ReturnType<typeof emptyDraft>>(k: K, v: ReturnType<typeof emptyDraft>[K]) => setDraft((d) => ({ ...d, [k]: v }));

    const valid = draft.name.trim() && draft.phone.trim() && draft.city.trim() && draft.address.trim();

    const submit = () => {
        if (!valid) return;
        onAdd({ ...draft, id: crypto.randomUUID(), phone: `${code} ${draft.phone}` });
        setDraft(emptyDraft());
        setCode("+971");
        setOpen(false);
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger render={(props) => <Button {...props} color="primary" size="md" iconLeading={Plus}>Add recipient</Button>} />
            <DrawerPopup className="max-w-lg">
                <DrawerHeader>
                    <DrawerTitle>Add recipient</DrawerTitle>
                </DrawerHeader>
                <DrawerPanel className="flex flex-col gap-5">
                    {/* contact */}
                    <div className="flex flex-col gap-4">
                        <span className="text-xs font-semibold tracking-wide text-tertiary uppercase">Contact</span>
                        <div className="flex gap-2">
                            <Select aria-label="Country code" label="Code" size="md" items={COUNTRY_CODES} selectedKey={code} onSelectionChange={(k) => setCode(String(k))} className="w-28">
                                {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                            </Select>
                            <Input label="Phone number" value={draft.phone} onChange={(v) => set("phone", v)} placeholder="529775990" className="flex-1" />
                        </div>
                        <Input label="Full name" value={draft.name} onChange={(v) => set("name", v)} placeholder="Customer name" isRequired />
                        <Input label="Email" type="email" value={draft.email ?? ""} onChange={(v) => set("email", v)} placeholder="name@email.com" />
                        <Checkbox label="Don't contact this customer" isSelected={draft.dontContact} onChange={(v) => set("dontContact", v)} />
                    </div>

                    <div className="h-px w-full bg-border-secondary" />

                    {/* location */}
                    <div className="flex flex-col gap-4">
                        <span className="text-xs font-semibold tracking-wide text-tertiary uppercase">Drop-off location</span>

                        {/* map placeholder */}
                        <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-lg border border-secondary bg-secondary_subtle">
                            <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(var(--color-border-secondary)_1px,transparent_1px),linear-gradient(90deg,var(--color-border-secondary)_1px,transparent_1px)] [background-size:28px_28px]" />
                            <FeaturedIcon icon={MarkerPin01} color="brand" theme="dark" size="sm" className="relative z-10" />
                        </div>

                        <span className="text-xs font-medium text-tertiary">Address type</span>
                        <ButtonGroup
                            size="md"
                            selectedKeys={[draft.addressType]}
                            onSelectionChange={(keys) => {
                                const next = [...keys][0];
                                if (next) set("addressType", next as Recipient["addressType"]);
                            }}
                        >
                            <ButtonGroupItem id="building" iconLeading={Building02}>Building</ButtonGroupItem>
                            <ButtonGroupItem id="tower" iconLeading={Building02}>Tower</ButtonGroupItem>
                            <ButtonGroupItem id="commercial" iconLeading={Building02}>Commercial</ButtonGroupItem>
                        </ButtonGroup>

                        <div className="grid grid-cols-2 gap-3">
                            <Input label="City" value={draft.city} onChange={(v) => set("city", v)} placeholder="Dubai" isRequired />
                            <Input label="Address" value={draft.address} onChange={(v) => set("address", v)} placeholder="Street, area" isRequired />
                            <Input label="Floor (optional)" value={draft.floor ?? ""} onChange={(v) => set("floor", v)} placeholder="17" />
                            <Input label="Unit (optional)" value={draft.unit ?? ""} onChange={(v) => set("unit", v)} placeholder="1705" />
                        </div>
                        <TextArea label="Notes" value={draft.notes ?? ""} onChange={(v) => set("notes", v)} placeholder="Delivery instructions…" rows={2} />
                    </div>
                </DrawerPanel>
                <DrawerFooter>
                    <DrawerClose render={(props) => <Button {...props} color="secondary" size="md">Cancel</Button>} />
                    <Button color="primary" size="md" onClick={submit} isDisabled={!valid}>Add recipient</Button>
                </DrawerFooter>
            </DrawerPopup>
        </Drawer>
    );
};

// ----------------------------------------------------------------------------- page
export default function CreateBulkOrderPage() {
    const [step, setStep] = useState(0);

    // step 1
    const [orderName, setOrderName] = useState("");
    const [pickup, setPickup] = useState<string>("moe");
    const [deliveryDate, setDeliveryDate] = useState("2026-06-15");
    const [requirePod, setRequirePod] = useState(false);
    const [inPerson, setInPerson] = useState(false);

    // step 2
    const [serviceId, setServiceId] = useState<string | null>(null);
    const [boxes, setBoxes] = useState<Record<BoxSize, number>>({ s: 0, m: 0, l: 0 });
    const service = SERVICES.find((s) => s.id === serviceId) ?? null;
    const totalBoxes = boxes.s + boxes.m + boxes.l;

    // step 3
    const [recipients, setRecipients] = useState<Recipient[]>([]);

    const stepValid = useMemo(() => {
        if (step === 0) return orderName.trim() !== "" && !!pickup && !!deliveryDate;
        if (step === 1) return !!service && totalBoxes > 0;
        if (step === 2) return recipients.length >= MIN_RECIPIENTS;
        return true;
    }, [step, orderName, pickup, deliveryDate, service, totalBoxes, recipients.length]);

    const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
    const back = () => setStep((s) => Math.max(0, s - 1));

    return (
        <div className="flex min-h-[calc(100vh-56px)] flex-col">
            {/* header + stepper */}
            <div className="border-b border-secondary bg-primary px-4 py-5 md:px-8">
                <div className="mx-auto flex max-w-5xl flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-display-xs font-semibold text-primary">Create bulk order</h1>
                        <p className="text-sm text-tertiary">One pickup, one service — delivered to many recipients.</p>
                    </div>
                    <Stepper current={step} onStep={setStep} />
                </div>
            </div>

            {/* body */}
            <div className="flex-1 px-4 py-6 md:px-8 md:py-8">
                <div className="mx-auto max-w-5xl">
                    {step === 0 && (
                        <div className="grid gap-6 lg:grid-cols-2">
                            <Card title="Order info" description="Name this batch and pick where it ships from.">
                                <Input label="Order name" value={orderName} onChange={setOrderName} placeholder="e.g. Friday grocery run" isRequired />
                                <Select label="Pickup location" selectedKey={pickup} onSelectionChange={(k) => setPickup(String(k))} items={PICKUP_LOCATIONS} icon={MarkerPin01}>
                                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                </Select>
                                <Input label="Delivery date" type="date" value={deliveryDate} onChange={setDeliveryDate} isRequired />
                            </Card>

                            <Card title="Delivery options" description="Applied to every recipient in this batch.">
                                <ToggleCard
                                    title="Require proof of delivery"
                                    description="In person = signature · drop-off = photo"
                                    isSelected={requirePod}
                                    onChange={setRequirePod}
                                />
                                <ToggleCard
                                    title="Try to deliver in person"
                                    description="Only hand-to-person delivery is accepted"
                                    isSelected={inPerson}
                                    onChange={setInPerson}
                                />
                            </Card>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="grid gap-6 lg:grid-cols-5">
                            {/* services list */}
                            <div className="flex flex-col gap-3 lg:col-span-3">
                                <h2 className="text-md font-semibold text-primary">Select a service</h2>
                                {SERVICES.map((s) => {
                                    const selected = s.id === serviceId;
                                    const temp = TEMP_META[s.temperature];
                                    return (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => {
                                                setServiceId(s.id);
                                                setBoxes({ s: 0, m: 0, l: 0 });
                                            }}
                                            className={cx(
                                                "flex items-center gap-4 rounded-xl border bg-primary p-4 text-left shadow-xs transition",
                                                selected ? "border-brand ring-1 ring-brand" : "border-secondary hover:border-brand",
                                            )}
                                        >
                                            <FeaturedIcon icon={temp.icon} color="brand" theme="light" size="lg" />
                                            <div className="flex min-w-0 flex-1 flex-col gap-1">
                                                <span className="text-sm font-semibold text-primary">{s.name}</span>
                                                <span className="text-xs text-tertiary">{s.description}</span>
                                                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                                    <Badge color={temp.color} type="pill-color" size="sm">{temp.label}</Badge>
                                                    {s.sizes.map((sz) => (
                                                        <Badge key={sz} color="gray" type="modern" size="sm">{sz.toUpperCase()}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <span className={cx("flex size-5 shrink-0 items-center justify-center rounded-full border", selected ? "border-brand bg-brand-solid text-white" : "border-secondary")}>
                                                {selected && <Check className="size-3" />}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* box config */}
                            <div className="lg:col-span-2">
                                {service ? (
                                    <Card title="Configure boxes" description={`Quantities per box size for ${service.name}.`}>
                                        {service.sizes.map((sz) => (
                                            <Counter key={sz} label={SIZE_LABEL[sz]} value={boxes[sz]} onChange={(v) => setBoxes((b) => ({ ...b, [sz]: v }))} />
                                        ))}
                                        <div className="mt-1 flex items-center justify-between rounded-lg bg-secondary_subtle px-3 py-2.5">
                                            <span className="text-sm font-medium text-secondary">Total boxes</span>
                                            <span className="text-sm font-semibold tabular-nums text-primary">{totalBoxes}</span>
                                        </div>
                                    </Card>
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-secondary p-8 text-center">
                                        <FeaturedIcon icon={Package} color="gray" theme="modern" size="lg" />
                                        <p className="text-sm text-tertiary">Select a service to configure box quantities.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col gap-5">
                            {/* requirement banner */}
                            <div className="flex flex-col gap-3 rounded-xl border border-secondary bg-primary p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <FeaturedIcon icon={Users01} color="brand" theme="light" size="md" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-primary">
                                            {recipients.length} {recipients.length === 1 ? "recipient" : "recipients"} added
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-tertiary">
                                            <InfoCircle className="size-3.5" aria-hidden="true" />
                                            Bulk orders need at least {MIN_RECIPIENTS} recipients.
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {recipients.length >= MIN_RECIPIENTS && (
                                        <Badge color="success" type="pill-color" size="md">Minimum met</Badge>
                                    )}
                                    <AddRecipientDrawer onAdd={(r) => setRecipients((list) => [...list, r])} />
                                </div>
                            </div>

                            {/* list / empty */}
                            {recipients.length === 0 ? (
                                <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-secondary px-6 py-16 text-center">
                                    <FeaturedIcon icon={Users01} color="gray" theme="modern" size="lg" />
                                    <div className="flex flex-col gap-1">
                                        <p className="text-md font-semibold text-primary">No recipients yet</p>
                                        <p className="max-w-sm text-sm text-tertiary">Add at least {MIN_RECIPIENTS} customers who will receive a drop from this batch.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {recipients.map((r, i) => (
                                        <div key={r.id} className="flex items-start justify-between gap-3 rounded-xl border border-secondary bg-primary p-4 shadow-xs">
                                            <div className="flex min-w-0 gap-3">
                                                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-secondary text-sm font-semibold text-brand-secondary">
                                                    {i + 1}
                                                </span>
                                                <div className="flex min-w-0 flex-col gap-0.5">
                                                    <span className="truncate text-sm font-semibold text-primary">{r.name}</span>
                                                    <span className="text-xs text-tertiary">{r.phone}</span>
                                                    <span className="flex items-start gap-1 text-xs text-tertiary">
                                                        <MarkerPin01 className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                                                        <span className="truncate">{r.address}, {r.city}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <Button
                                                color="tertiary-destructive"
                                                size="sm"
                                                iconLeading={Trash01}
                                                aria-label={`Remove ${r.name}`}
                                                onClick={() => setRecipients((list) => list.filter((x) => x.id !== r.id))}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col gap-6">
                            <SummaryRow label="Order name" value={orderName || "—"} onEdit={() => setStep(0)} />
                            <div className="grid gap-6 lg:grid-cols-2">
                                <Card title="Order details">
                                    <SummaryLine label="Pickup" value={PICKUP_LOCATIONS.find((p) => p.id === pickup)?.label ?? "—"} />
                                    <SummaryLine label="Delivery date" value={deliveryDate} />
                                    <SummaryLine label="Proof of delivery" value={requirePod ? "Required" : "Not required"} />
                                    <SummaryLine label="Deliver in person" value={inPerson ? "Required" : "Not required"} />
                                </Card>
                                <Card title="Service & boxes">
                                    <SummaryLine label="Service" value={service?.name ?? "—"} />
                                    <SummaryLine label="Temperature" value={service ? TEMP_META[service.temperature].label : "—"} />
                                    <SummaryLine label="Small / Medium / Large" value={`${boxes.s} / ${boxes.m} / ${boxes.l}`} />
                                    <SummaryLine label="Total boxes" value={String(totalBoxes)} />
                                </Card>
                            </div>
                            <Card title={`Recipients (${recipients.length})`}>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {recipients.map((r, i) => (
                                        <div key={r.id} className="flex items-center gap-2.5 rounded-lg border border-secondary px-3 py-2">
                                            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-secondary text-xs font-semibold text-brand-secondary">{i + 1}</span>
                                            <div className="flex min-w-0 flex-col">
                                                <span className="truncate text-sm font-medium text-primary">{r.name}</span>
                                                <span className="truncate text-xs text-tertiary">{r.phone}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>

            {/* sticky footer */}
            <div className="sticky bottom-0 border-t border-secondary bg-primary px-4 py-4 md:px-8">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
                    {step === 0 ? (
                        <Button color="link-gray" size="md" href="/orders">Cancel</Button>
                    ) : (
                        <Button color="secondary" size="md" iconLeading={ArrowLeft} onClick={back}>Back</Button>
                    )}

                    {step < STEPS.length - 1 ? (
                        <Button color="primary" size="md" iconTrailing={ArrowRight} onClick={next} isDisabled={!stepValid}>
                            Continue
                        </Button>
                    ) : (
                        <Button color="primary" size="md" iconLeading={Check} onClick={() => alert("Bulk order created")}>
                            Create bulk order
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

const SummaryLine = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-tertiary">{label}</span>
        <span className="text-sm font-medium text-primary">{value}</span>
    </div>
);

const SummaryRow = ({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) => (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-secondary bg-secondary_subtle px-5 py-4">
        <div className="flex flex-col">
            <span className="text-xs font-medium text-tertiary">{label}</span>
            <span className="text-md font-semibold text-primary">{value}</span>
        </div>
        <Button color="tertiary" size="sm" onClick={onEdit}>Edit</Button>
    </div>
);
