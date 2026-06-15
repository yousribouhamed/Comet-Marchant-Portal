"use client";

import { useMemo, useState } from "react";
import { CheckCircle, Coins01, CreditCard02, InfoCircle, Settings01, Wallet02 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { RadioButtonBase } from "@/components/base/radio-buttons/radio-buttons";
import { Toggle } from "@/components/base/toggle/toggle";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { cx } from "@/utils/cx";

type PaymentPreference = "customer" | "order";

const paymentOptions = [
    {
        id: "customer" as const,
        title: "Customer payment preference",
        description: "Customer can decide to pay by card, cash, or pay online.",
        icon: Wallet02,
        methods: ["Cash", "Card", "Pay online"],
    },
    {
        id: "order" as const,
        title: "Set only while order creation",
        description: "The payment method selected while creating the order is enforced for that order.",
        icon: Settings01,
        methods: ["Chosen by merchant"],
    },
];

export const PaymentSettingsSection = () => {
    const [preference, setPreference] = useState<PaymentPreference>("customer");
    const [allowCash, setAllowCash] = useState(true);
    const [allowCard, setAllowCard] = useState(true);
    const [allowPayOnline, setAllowPayOnline] = useState(true);

    const selectedOption = paymentOptions.find((option) => option.id === preference) ?? paymentOptions[0];
    const enabledMethods = useMemo(
        () =>
            [
                allowCash && "Cash",
                allowCard && "Card",
                allowPayOnline && "Pay online",
            ].filter(Boolean) as string[],
        [allowCard, allowCash, allowPayOnline],
    );

    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section className="flex flex-col gap-6 rounded-xl border border-secondary bg-primary p-6 shadow-xs">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex max-w-2xl flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <FeaturedIcon icon={CreditCard02} color="brand" theme="light" size="md" />
                            <div className="flex flex-col">
                                <h2 className="text-xl font-semibold text-primary">Payment method preference</h2>
                                <p className="text-sm text-tertiary">Choose who controls payment method selection during order checkout.</p>
                            </div>
                        </div>
                        <p className="text-sm leading-6 text-tertiary">
                            Use customer preference when buyers should have payment flexibility. Use order-only selection when operations
                            need strict payment control at order creation.
                        </p>
                    </div>

                    <Badge color="success" type="pill-color" size="sm">
                        Active setting
                    </Badge>
                </div>

                <fieldset className="grid gap-4">
                    <legend className="sr-only">Payment method preference</legend>
                    {paymentOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = preference === option.id;

                        return (
                            <label
                                key={option.id}
                                className={cx(
                                    "flex cursor-pointer gap-4 rounded-xl border bg-primary p-4 transition duration-100 ease-linear",
                                    isSelected ? "border-brand bg-brand-primary_alt shadow-xs" : "border-secondary hover:bg-primary_hover",
                                )}
                            >
                                <RadioButtonBase size="md" isSelected={isSelected} className="mt-1" />
                                <input
                                    type="radio"
                                    value={option.id}
                                    checked={isSelected}
                                    onChange={() => setPreference(option.id)}
                                    className="sr-only"
                                />
                                <div className="flex min-w-0 flex-1 flex-col gap-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <FeaturedIcon icon={Icon} color={isSelected ? "brand" : "gray"} theme="light" size="sm" />
                                            <div className="flex flex-col gap-1">
                                                <p className="text-md font-semibold text-primary">{option.title}</p>
                                                <p className="text-sm text-tertiary">{option.description}</p>
                                            </div>
                                        </div>
                                        {isSelected && <CheckCircle className="size-5 shrink-0 text-fg-success-primary" aria-hidden="true" />}
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {option.methods.map((method) => (
                                            <Badge key={method} color="gray" type="modern" size="sm">
                                                {method}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </label>
                        );
                    })}
                </fieldset>

                <div className="rounded-xl border border-secondary bg-secondary_subtle p-4">
                    <div className="flex items-start gap-3">
                        <InfoCircle className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-semibold text-primary">Recommended setup</p>
                            <p className="text-sm leading-6 text-tertiary">
                                Keep customer preference enabled if you want fewer checkout changes from support teams and fewer failed
                                delivery attempts caused by payment mismatch.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button size="md" iconLeading={CheckCircle}>
                        Save payment setting
                    </Button>
                </div>
            </section>

            <aside className="flex flex-col gap-4">
                <div className="rounded-xl border border-secondary bg-primary p-5 shadow-xs">
                    <div className="flex items-center gap-3">
                        <FeaturedIcon icon={selectedOption.icon} color="brand" theme="light" size="md" />
                        <div className="flex flex-col">
                            <p className="text-sm font-medium text-tertiary">Current preference</p>
                            <h3 className="text-lg font-semibold text-primary">{selectedOption.title}</h3>
                        </div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-tertiary">{selectedOption.description}</p>
                </div>

                <div className="rounded-xl border border-secondary bg-primary p-5 shadow-xs">
                    <div className="flex items-center gap-3">
                        <FeaturedIcon icon={Coins01} color="success" theme="light" size="md" />
                        <div className="flex flex-col">
                            <h3 className="text-md font-semibold text-primary">Customer methods</h3>
                            <p className="text-sm text-tertiary">Shown when customer preference is enabled.</p>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-4">
                        <Toggle size="md" label="Cash" hint="Allow cash on delivery" isSelected={allowCash} onChange={setAllowCash} />
                        <Toggle size="md" label="Card" hint="Allow card payment at checkout" isSelected={allowCard} onChange={setAllowCard} />
                        <Toggle size="md" label="Pay online" hint="Allow payment link or online checkout" isSelected={allowPayOnline} onChange={setAllowPayOnline} />
                    </div>

                    <div className="mt-5 rounded-lg bg-secondary_subtle p-3">
                        <p className="text-sm text-tertiary">
                            Enabled now: <span className="font-semibold text-primary">{enabledMethods.length ? enabledMethods.join(", ") : "None"}</span>
                        </p>
                    </div>
                </div>
            </aside>
        </div>
    );
};
