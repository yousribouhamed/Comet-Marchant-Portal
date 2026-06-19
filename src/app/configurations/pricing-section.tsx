"use client";

import { useState, type FC } from "react";
import { AlertTriangle, ArrowRight, Calendar, Check, CalendarHeart01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { BadgeGroup } from "@/components/base/badges/badge-groups";
import { Button } from "@/components/base/buttons/button";
import { Toggle } from "@/components/base/toggle/toggle";
import {
    Dialog,
    DialogClose,
    DialogFooter,
    DialogHeader,
    DialogPanel,
    DialogPopup,
    DialogTitle,
} from "@/components/ui/dialog";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { CurrencyIcon } from "@/components/foundations/currency-icon";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cx } from "@/utils/cx";

type Plan = {
    id: string;
    name: string;
    description: string;
    price: number;
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

const PlanCard: FC<{ plan: Plan; isCurrent: boolean; onChoose?: () => void }> = ({ plan, isCurrent, onChoose }) => {
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
                onClick={onChoose}
                className="mt-auto w-full"
            >
                {isCurrent ? "Current plan" : `Choose ${plan.name}`}
            </Button>
        </div>
    );
};

export const PricingSection = () => {
    const [autoRenew, setAutoRenew] = useState(false);
    const [pendingPlan, setPendingPlan] = useState<Plan | null>(null);
    const [scheduledPlan, setScheduledPlan] = useState<Plan | null>(plans.find((p) => p.id === "scale") ?? null);
    const currentPlan = plans.find((p) => p.id === CURRENT_PLAN_ID)!;
    const isUpgrade = pendingPlan ? pendingPlan.price > currentPlan.price : false;

    return (
        <section className="flex flex-col gap-6">
            {/* Current plan summary — scheduled change pill sits on top */}
            <div className="rounded-2xl border border-secondary bg-secondary_subtle">
                {scheduledPlan && (
                    <div className="flex flex-col gap-3 border-b border-secondary px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <BadgeGroup
                            addonText="Scheduled change"
                            color="brand"
                            theme="light"
                            size="lg"
                            iconTrailing={null}
                        >
                            Switching to {scheduledPlan.name} on {NEXT_BILLING_DATE}
                        </BadgeGroup>
                        <div className="flex items-center gap-1">
                            <Button color="link-destructive" size="sm" onClick={() => setScheduledPlan(null)}>
                                Cancel change
                            </Button>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
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
                        <div className="mt-1 flex items-center gap-2 text-sm text-tertiary">
                            <Calendar className="size-4 text-fg-quaternary" aria-hidden="true" />
                            <span>
                                Renews on <span className="font-medium text-primary">{NEXT_BILLING_DATE}</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl border border-secondary bg-primary p-3 md:items-center">
                        <div className="flex min-w-0 flex-col gap-0.5">
                            <span className="text-sm font-semibold text-primary">Auto-renew</span>
                            <span className="text-xs text-tertiary">Charge this plan automatically each cycle.</span>
                        </div>
                        <Toggle aria-label="Auto-renew this plan" isSelected={autoRenew} onChange={setAutoRenew} />
                    </div>
                </div>
            </div>

            {/* Plans */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        isCurrent={plan.id === CURRENT_PLAN_ID}
                        onChoose={() => setPendingPlan(plan)}
                    />
                ))}
            </div>

            {/* Confirm plan switch */}
            <Dialog open={pendingPlan !== null} onOpenChange={(open) => !open && setPendingPlan(null)}>
                <DialogPopup className="max-w-md">
                    <DialogHeader>
                        <div className="flex items-start gap-4">
                            <FeaturedIcon icon={CalendarHeart01} color="brand" theme="light" size="md" className="shrink-0" />
                            <div className="flex flex-col gap-1">
                                <DialogTitle>{isUpgrade ? "Upgrade to" : "Switch to"} {pendingPlan?.name}?</DialogTitle>
                                <p className="text-sm text-tertiary">
                                    Your new plan will start on{" "}
                                    <span className="font-medium text-primary">{NEXT_BILLING_DATE}</span> — your
                                    next billing date. You'll stay on {currentPlan.name} until then.
                                </p>
                            </div>
                        </div>
                    </DialogHeader>
                    <DialogPanel className="flex flex-col gap-4">
                        {/* Plan comparison */}
                        <div className="flex items-center gap-3 rounded-lg border border-secondary bg-secondary_subtle p-3">
                            <div className="flex min-w-0 flex-1 flex-col">
                                <span className="text-xs text-tertiary">Today</span>
                                <span className="truncate text-sm font-semibold text-primary">{currentPlan.name}</span>
                                <span className="text-xs text-tertiary">
                                    Ð {currentPlan.price}/mo
                                </span>
                            </div>
                            <ArrowRight className="size-5 shrink-0 text-fg-quaternary" aria-hidden="true" />
                            <div className="flex min-w-0 flex-1 flex-col items-end text-right">
                                <span className="text-xs text-tertiary">From {NEXT_BILLING_DATE.split(",")[0]}</span>
                                <span className="truncate text-sm font-semibold text-brand-secondary">{pendingPlan?.name}</span>
                                <span className="text-xs text-tertiary">
                                    Ð {pendingPlan?.price}/mo
                                </span>
                            </div>
                        </div>

                        {/* Auto-renew warning when on */}
                        {autoRenew ? (
                            <Alert variant="warning">
                                <AlertTriangle />
                                <AlertTitle>Turn off auto-renew first</AlertTitle>
                                <AlertDescription>
                                    Auto-renew is on, so we'll bill you for {currentPlan.name} again on{" "}
                                    {NEXT_BILLING_DATE}. Turn it off to let this switch take effect.
                                </AlertDescription>
                                <AlertAction>
                                    <Button size="sm" color="secondary" onClick={() => setAutoRenew(false)}>
                                        Turn off auto-renew
                                    </Button>
                                </AlertAction>
                            </Alert>
                        ) : (
                            <Alert variant="success">
                                <Check />
                                <AlertDescription>
                                    Auto-renew is off — your switch to {pendingPlan?.name} will go through on {NEXT_BILLING_DATE}.
                                </AlertDescription>
                            </Alert>
                        )}
                    </DialogPanel>
                    <DialogFooter className="flex-row justify-end gap-3">
                        <DialogClose render={(props) => <Button {...props} color="secondary" size="md">Cancel</Button>} />
                        <DialogClose
                            render={(props) => (
                                <Button
                                    {...props}
                                    color="primary"
                                    size="md"
                                    isDisabled={autoRenew}
                                    onClick={() => pendingPlan && setScheduledPlan(pendingPlan)}
                                >
                                    Schedule switch
                                </Button>
                            )}
                        />
                    </DialogFooter>
                </DialogPopup>
            </Dialog>
        </section>
    );
};
