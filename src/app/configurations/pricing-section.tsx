"use client";

import { useState, type FC } from "react";
import { Calendar, Check } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { CurrencyIcon } from "@/components/foundations/currency-icon";
import { cx } from "@/utils/cx";

type Plan = {
    id: string;
    name: string;
    description: string;
    price: number;
    badge?: string;
    features: string[];
};

const plans: Plan[] = [
    {
        id: "basic",
        name: "Basic",
        description: "For small teams just getting set up.",
        price: 19,
        features: ["Up to 500 orders / month", "Custom SMS templates", "1 store location", "Email support"],
    },
    {
        id: "growth",
        name: "Growth",
        description: "For growing businesses with more volume.",
        price: 49,
        badge: "Most popular",
        features: [
            "Up to 5,000 orders / month",
            "COD reconciliation",
            "Up to 5 store locations",
            "Cloud telephony integration",
            "Priority email & chat support",
        ],
    },
    {
        id: "scale",
        name: "Scale",
        description: "Advanced controls for established teams.",
        price: 99,
        features: [
            "Unlimited orders",
            "Unlimited locations",
            "Custom roles & permissions",
            "Developer API access",
            "Dedicated account manager",
        ],
    },
];

const CURRENT_PLAN_ID = "growth";
const NEXT_BILLING_DATE = "July 12, 2026";

const PlanCard: FC<{ plan: Plan; isCurrent: boolean }> = ({ plan, isCurrent }) => {
    return (
        <div
            className={cx(
                "relative flex flex-col gap-6 rounded-2xl border bg-primary p-6 md:p-8",
                isCurrent ? "border-brand ring-1 ring-brand" : "border-secondary",
            )}
        >
            {isCurrent && (
                <span className="absolute -top-3 left-6">
                    <Badge color="success" type="pill-color" size="md">
                        Your current plan
                    </Badge>
                </span>
            )}

            <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold text-primary">{plan.name}</h3>
                    <p className="text-sm text-tertiary">{plan.description}</p>
                </div>
                {plan.badge && !isCurrent && (
                    <Badge color="brand" type="pill-color" size="md">
                        {plan.badge}
                    </Badge>
                )}
            </div>

            <div className="flex items-baseline gap-1.5">
                <CurrencyIcon className="size-7 self-center text-primary" />
                <span className="text-display-md font-semibold text-primary">{plan.price}</span>
                <span className="text-md text-tertiary">/month</span>
            </div>

            <ul className="flex flex-col gap-3">
                {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-secondary">
                        <Check className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            <Button
                size="md"
                color={isCurrent ? "secondary" : "primary"}
                isDisabled={isCurrent}
                className="mt-auto w-full"
            >
                {isCurrent ? "Current plan" : `Choose ${plan.name}`}
            </Button>
        </div>
    );
};

export const PricingSection = () => {
    const [autoRenew, setAutoRenew] = useState(true);
    const currentPlan = plans.find((p) => p.id === CURRENT_PLAN_ID)!;

    return (
        <section className="flex flex-col gap-8">
            <div className="flex flex-col items-center gap-3 text-center">
                <Badge color="brand" type="pill-color" size="md">
                    Pricing
                </Badge>
                <h2 className="text-display-sm font-semibold text-primary">Plans that scale with you</h2>
                <p className="max-w-xl text-md text-tertiary">
                    Simple, transparent pricing. Switch or cancel anytime — no hidden fees.
                </p>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-secondary bg-secondary_subtle p-6 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-tertiary">Current plan</span>
                        <Badge color="success" type="pill-color" size="sm">
                            Active
                        </Badge>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-semibold text-primary">{currentPlan.name}</span>
                        <span className="text-sm text-tertiary">·</span>
                        <CurrencyIcon className="size-4 self-center text-primary" />
                        <span className="text-md font-medium text-primary">{currentPlan.price}</span>
                        <span className="text-sm text-tertiary">/month</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3 md:items-end">
                    <div className="flex items-center gap-2 text-sm text-secondary">
                        <Calendar className="size-4 text-fg-quaternary" aria-hidden="true" />
                        <span>
                            Next billing date: <span className="font-medium text-primary">{NEXT_BILLING_DATE}</span>
                        </span>
                    </div>
                    <Checkbox
                        label="Auto-renew this plan"
                        isSelected={autoRenew}
                        onChange={setAutoRenew}
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => (
                    <PlanCard key={plan.id} plan={plan} isCurrent={plan.id === CURRENT_PLAN_ID} />
                ))}
            </div>
        </section>
    );
};
