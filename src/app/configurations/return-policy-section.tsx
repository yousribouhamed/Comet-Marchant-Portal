"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AlertCircle, Coins01, CreditCard02, InfoCircle, PackageCheck, PackageX, RefreshCcw02, Truck01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { CurrencyIcon } from "@/components/foundations/currency-icon";
import { Input } from "@/components/ui/input";
import { cx } from "@/utils/cx";

type PolicyType = "cod" | "paid-online";

type PolicyConfig = {
    id: PolicyType;
    title: string;
    subtitle: string;
    icon: typeof Coins01;
    threshold: string;
    belowAction: string;
    belowTone: "error" | "brand";
};

const normalizeThreshold = (value: string) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric < 0) return 0;
    return numeric;
};

const formatAmount = (value: string) =>
    normalizeThreshold(value).toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

export const ReturnPolicySection = () => {
    const [codThreshold, setCodThreshold] = useState("0");
    const [paidOnlineThreshold, setPaidOnlineThreshold] = useState("0");

    const policies: PolicyConfig[] = useMemo(
        () => [
            {
                id: "cod",
                title: "COD orders",
                subtitle: "Define the return limit for cash-on-delivery orders.",
                icon: Coins01,
                threshold: codThreshold,
                belowAction: "discarded",
                belowTone: "error",
            },
            {
                id: "paid-online",
                title: "Paid online orders",
                subtitle: "Define the return limit for prepaid and online-paid orders.",
                icon: CreditCard02,
                threshold: paidOnlineThreshold,
                belowAction: "dropped off at the customer location",
                belowTone: "brand",
            },
        ],
        [codThreshold, paidOnlineThreshold],
    );

    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section className="flex flex-col gap-6">
                <div className="rounded-xl border border-secondary bg-primary p-6 shadow-xs">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex max-w-2xl flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <FeaturedIcon icon={RefreshCcw02} color="brand" theme="light" size="md" />
                                <div className="flex flex-col">
                                    <h2 className="text-xl font-semibold text-primary">Return policy</h2>
                                    <p className="text-sm text-tertiary">Set order-value thresholds that decide where returned orders go.</p>
                                </div>
                            </div>
                            <p className="text-sm leading-6 text-tertiary">
                                Orders equal to or above the threshold return to your pickup location. Orders below the threshold follow the
                                fallback action for that payment type.
                            </p>
                        </div>
                        <Badge color="brand" type="pill-color" size="sm">
                            Dirham thresholds
                        </Badge>
                    </div>
                </div>

                <div className="grid gap-4">
                    {policies.map((policy) => (
                        <PolicyCard
                            key={policy.id}
                            policy={policy}
                            onThresholdChange={policy.id === "cod" ? setCodThreshold : setPaidOnlineThreshold}
                        />
                    ))}
                </div>
            </section>

            <aside className="flex flex-col gap-4">
                <div className="rounded-xl border border-secondary bg-primary p-5 shadow-xs">
                    <div className="flex items-center gap-3">
                        <FeaturedIcon icon={Truck01} color="success" theme="light" size="md" />
                        <div className="flex flex-col">
                            <p className="text-sm font-medium text-tertiary">Pickup destination</p>
                            <h3 className="text-lg font-semibold text-primary">Merchant pickup location</h3>
                        </div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-tertiary">
                        Returned orders that meet the threshold will be routed back to your configured pickup location.
                    </p>
                </div>

                <div className="rounded-xl border border-secondary bg-primary p-5 shadow-xs">
                    <div className="flex items-center gap-3">
                        <FeaturedIcon icon={InfoCircle} color="warning" theme="light" size="md" />
                        <div className="flex flex-col">
                            <h3 className="text-md font-semibold text-primary">Current rules</h3>
                            <p className="text-sm text-tertiary">Live summary of the configured thresholds.</p>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-4">
                        {policies.map((policy) => (
                            <div key={policy.id} className="rounded-lg bg-secondary_subtle p-3">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-semibold text-primary">{policy.title}</p>
                                    <Badge color={policy.belowTone} type="pill-color" size="sm">
                                        <CurrencyAmount value={formatAmount(policy.threshold)} iconClassName="size-3" />
                                    </Badge>
                                </div>
                                <p className="mt-2 text-sm leading-6 text-tertiary">
                                    Below <CurrencyAmount value={formatAmount(policy.threshold)} />: {policy.belowAction}.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>
        </div>
    );
};

const PolicyCard = ({
    policy,
    onThresholdChange,
}: {
    policy: PolicyConfig;
    onThresholdChange: (value: string) => void;
}) => {
    const Icon = policy.icon;
    const threshold = formatAmount(policy.threshold);

    return (
        <div className="rounded-xl border border-secondary bg-primary p-5 shadow-xs">
            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-3">
                        <FeaturedIcon icon={Icon} color={policy.id === "cod" ? "warning" : "brand"} theme="light" size="md" />
                        <div className="flex flex-col gap-1">
                            <h3 className="text-lg font-semibold text-primary">{policy.title}</h3>
                            <p className="text-sm text-tertiary">{policy.subtitle}</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[260px_minmax(0,1fr)] md:items-end">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-secondary" htmlFor={`${policy.id}-threshold`}>
                            Return threshold
                        </label>
                        <div className="relative">
                            <CurrencyIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-tertiary" aria-hidden="true" />
                            <Input
                                id={`${policy.id}-threshold`}
                                type="number"
                                min={0}
                                step="0.01"
                                value={policy.threshold}
                                onChange={(event) => onThresholdChange(event.currentTarget.value)}
                                className="pl-10"
                                aria-describedby={`${policy.id}-summary`}
                            />
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <OutcomeTile
                            icon={PackageCheck}
                            title="Return to pickup"
                            text={
                                <>
                                    Orders equal to or above <CurrencyAmount value={threshold} />
                                </>
                            }
                            tone="success"
                        />
                        <OutcomeTile
                            icon={policy.belowTone === "error" ? PackageX : Truck01}
                            title={policy.belowTone === "error" ? "Fallback action" : "Customer drop-off"}
                            text={
                                <>
                                    Orders below <CurrencyAmount value={threshold} /> are {policy.belowAction}
                                </>
                            }
                            tone={policy.belowTone}
                        />
                    </div>
                </div>

                <div id={`${policy.id}-summary`} className="rounded-lg bg-secondary_subtle p-4">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="mt-0.5 size-4 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                        <p className="text-sm leading-6 text-secondary">
                            All orders <strong className="text-brand-secondary">equal to or above <CurrencyAmount value={threshold} /></strong> will be returned to
                            your pickup location. Orders <strong className="text-brand-secondary">below <CurrencyAmount value={threshold} /></strong> will be{" "}
                            {policy.belowAction}.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OutcomeTile = ({
    icon: Icon,
    title,
    text,
    tone,
}: {
    icon: typeof PackageCheck;
    title: string;
    text: ReactNode;
    tone: "success" | "error" | "brand";
}) => (
    <div className="flex gap-3 rounded-lg border border-secondary bg-primary p-3">
        <Icon
            className={cx(
                "mt-0.5 size-5 shrink-0",
                tone === "success" && "text-fg-success-primary",
                tone === "error" && "text-fg-error-primary",
                tone === "brand" && "text-fg-brand-primary",
            )}
            aria-hidden="true"
        />
        <div className="flex min-w-0 flex-col gap-1">
            <p className="text-sm font-semibold text-primary">{title}</p>
            <p className="text-sm text-tertiary">{text}</p>
        </div>
    </div>
);

const CurrencyAmount = ({ value, iconClassName }: { value: string; iconClassName?: string }) => (
    <span className="inline-flex items-center gap-1 whitespace-nowrap">
        <CurrencyIcon className={cx("size-3.5 text-current", iconClassName)} aria-hidden="true" />
        {value}
    </span>
);
